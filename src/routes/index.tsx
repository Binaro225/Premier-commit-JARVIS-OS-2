import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/jarvis/AppShell";
import { ChatHistory } from "@/components/jarvis/ChatHistory";
import { CommandBar } from "@/components/jarvis/CommandBar";
import { CoreStatusLabel, JarvisCore, type CoreState } from "@/components/jarvis/JarvisCore";
import { OfflineBanner } from "@/components/jarvis/OfflineBanner";
import { SettingsModal } from "@/components/jarvis/SettingsModal";
import { Suggestions } from "@/components/jarvis/Suggestions";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useOnlineStatus } from "@/hooks/usePwa";
import { askJarvis, cleanText, GENERIC_ERROR } from "@/lib/jarvisApi";
import { speak, stopSpeech } from "@/lib/tts";
import {
  clearHistory,
  loadHistory,
  loadSettings,
  newId,
  saveHistory,
  saveSettings,
  welcomeMessage,
  type Message,
  type Settings,
} from "@/lib/jarvisStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JARVIS OS — Console vocale de votre assistant IA" },
      {
        name: "description",
        content:
          "Parlez ou écrivez à JARVIS depuis une console holographique unique : réponses vocales instantanées, historique local, installable sur Android.",
      },
      { property: "og:title", content: "JARVIS OS — Console vocale de votre assistant IA" },
      {
        property: "og:description",
        content:
          "Une interface futuriste unique pour dialoguer avec votre assistant IA, à la voix comme au clavier.",
      },
    ],
  }),
  component: JarvisScreen,
});

function JarvisScreen() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
  const [settings, setSettings] = useState<Settings>({ voiceEnabled: true, autoSendVoice: true });
  const [input, setInput] = useState("");
  const [state, setState] = useState<CoreState>("idle");
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [freshIds, setFreshIds] = useState<string[]>([]);
  const online = useOnlineStatus();
  const speakingRef = useRef(false);

  useEffect(() => {
    setMessages(loadHistory());
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveHistory(messages);
  }, [messages, hydrated]);

  useEffect(() => {
    if (hydrated) saveSettings(settings);
  }, [settings, hydrated]);

  useEffect(() => () => stopSpeech(), []);

  const activeTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;

  /* Progression simulée des threads en cours d'exécution. */
  useEffect(() => {
    if (activeTasks === 0) return;
    const id = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.status === "IN_PROGRESS"
            ? { ...t, progress: Math.min(93, t.progress + 3 + Math.random() * 9) }
            : t,
        ),
      );
    }, 700);
    return () => clearInterval(id);
  }, [activeTasks]);

  /* L'état du noyau suit les threads actifs, l'écoute et la parole. */
  useEffect(() => {
    setState((s) => {
      if (s === "listening" || s === "speaking" || s === "error") return s;
      return activeTasks > 0 ? "processing" : "idle";
    });
  }, [activeTasks]);

  const stopAudio = useCallback(() => {
    stopSpeech();
    speakingRef.current = false;
    setSpeakingId(null);
    setState((s) => (s === "speaking" ? "idle" : s));
  }, []);

  const playMessage = useCallback(async (message: Message) => {
    const text = cleanText(message.tts ?? message.text);
    if (!text) return;
    stopSpeech();
    speakingRef.current = true;
    setSpeakingId(message.id);
    setState("speaking");
    await speak(text, {
      onEnd: () => {
        speakingRef.current = false;
        setSpeakingId(null);
        setState("idle");
      },
    });
  }, []);

  const flagError = useCallback((text: string, retryPrompt?: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: newId(),
        role: "jarvis",
        text,
        at: Date.now(),
        error: true,
        ...(retryPrompt ? { retryPrompt } : {}),
      },
    ]);
    setState("error");
    setTimeout(() => setState((s) => (s === "error" ? "idle" : s)), 3200);
  }, []);

  /**
   * Envoi non bloquant : chaque demande devient un thread indépendant (PID).
   * On peut continuer à dialoguer pendant qu'un thread travaille ; la réponse
   * arrive dans le flux dès qu'elle est prête.
   */
  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      setInput("");

      const task: Task = {
        id: newId(),
        pid: newPid(),
        label: taskLabel(text),
        status: "IN_PROGRESS",
        progress: 6,
        at: Date.now(),
      };
      setTasks((prev) => [task, ...prev].slice(0, 12));
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "user", text, at: Date.now(), pid: task.pid },
      ]);

      void (async () => {
        try {
          const reply = await askJarvis(text);
          const jarvisMsg: Message = {
            id: newId(),
            role: "jarvis",
            text: reply.output,
            tts: reply.tts,
            at: Date.now(),
            pid: task.pid,
          };
          setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, status: "COMPLETE", progress: 100 } : t)),
          );
          setMessages((prev) => [...prev, jarvisMsg]);
          setFreshIds((prev) => [...prev, jarvisMsg.id]);
          if (settings.voiceEnabled && !speakingRef.current) void playMessage(jarvisMsg);
        } catch {
          setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, status: "FAILED", progress: 100 } : t)),
          );
          flagError(GENERIC_ERROR, text);
        }
      })();
    },
    [flagError, playMessage, settings.voiceEnabled],
  );

  const speech = useSpeechRecognition({
    onFinal: (text) => {
      if (settings.autoSendVoice) send(text);
      else setInput(text);
    },
    onError: (message) => flagError(message),
  });

  useEffect(() => {
    if (speech.listening) setState("listening");
    else setState((s) => (s === "listening" ? "idle" : s));
  }, [speech.listening]);

  const userTurns = useMemo(() => messages.filter((m) => m.role === "user").length, [messages]);

  return (
    <>
      <AppShell
        onOpenSettings={() => setSettingsOpen(true)}
        online={online}
        busy={activeTasks > 0}
        aside={<TaskPanel tasks={tasks} />}
      >
        <div className="flex shrink-0 flex-col items-center gap-2 pt-2 pb-2">
          <JarvisCore state={state} size={150} />
          <CoreStatusLabel state={state} />
        </div>

        <OfflineBanner online={online} />

        <ChatHistory
          messages={messages}
          speakingId={speakingId}
          freshIds={freshIds}
          processing={activeTasks > 0}
          processingCount={activeTasks}
          onReplay={(m) => (speakingId === m.id ? stopAudio() : void playMessage(m))}
          onStop={stopAudio}
          onRetry={(prompt) => send(prompt)}
        />

        {speech.interim && (
          <p className="px-3 pb-1 font-mono text-[0.7rem] text-primary/80" aria-live="polite">
            &gt; {speech.interim}
          </p>
        )}

        {userTurns < 3 && <Suggestions onPick={(t) => send(t)} />}

        <CommandBar
          value={input}
          onChange={setInput}
          onSend={() => send(input)}
          state={state}
          listening={speech.listening}
          micSupported={speech.supported}
          voiceEnabled={settings.voiceEnabled}
          onToggleVoice={() => {
            if (settings.voiceEnabled) stopAudio();
            setSettings((s) => ({ ...s, voiceEnabled: !s.voiceEnabled }));
          }}
          onStopAudio={stopAudio}
          onMicToggle={speech.toggle}
          onHoldStart={speech.start}
          onHoldEnd={speech.stop}
        />
      </AppShell>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={(patch) => setSettings((s) => ({ ...s, ...patch }))}
        onTestVoice={() =>
          void playMessage({
            id: "test-voice",
            role: "jarvis",
            text: "Test vocal. Tous les systèmes sont opérationnels.",
            at: Date.now(),
          })
        }
        onClearHistory={() => {
          clearHistory();
          stopAudio();
          setTasks([]);
          setMessages([welcomeMessage()]);
        }}
      />
    </>
  );
}

