import { ChevronRight, Send } from "lucide-react";
import { VoiceInputButton } from "./VoiceInputButton";
import { AudioControls } from "./AudioControls";
import type { CoreState } from "./JarvisCore";

const HINT: Record<CoreState, string> = {
  idle: "await_input",
  listening: "voice_capture",
  processing: "processing_threads",
  speaking: "audio_output",
  error: "await_input",
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  state: CoreState;
  listening: boolean;
  micSupported: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onStopAudio: () => void;
  onMicToggle: () => void;
  onHoldStart: () => void;
  onHoldEnd: () => void;
};

export function CommandBar({
  value,
  onChange,
  onSend,
  state,
  listening,
  micSupported,
  voiceEnabled,
  onToggleVoice,
  onStopAudio,
  onMicToggle,
  onHoldStart,
  onHoldEnd,
}: Props) {
  const speaking = state === "speaking";

  return (
    <div className="glass-panel border-t px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mb-2 flex items-center justify-between">
        <span className="hud-label text-muted-foreground" aria-live="polite">
          [{HINT[state]}]
        </span>
        <AudioControls
          voiceEnabled={voiceEnabled}
          speaking={speaking}
          onToggleVoice={onToggleVoice}
          onStop={onStopAudio}
        />
      </div>

      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <VoiceInputButton
          listening={listening}
          supported={micSupported}
          onToggle={onMicToggle}
          onHoldStart={onHoldStart}
          onHoldEnd={onHoldEnd}
        />

        <label className="clip-hud flex flex-1 items-start gap-1.5 border border-input bg-background/60 px-2.5 py-2 focus-within:border-primary/70">
          <span className="sr-only">Commande pour JARVIS</span>
          <ChevronRight className="mt-1.5 size-4 shrink-0 animate-hud-blink text-primary" aria-hidden />
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            rows={1}
            placeholder="saisir_commande…"
            className="scroll-slim max-h-28 min-h-8 w-full resize-none bg-transparent py-1 font-mono text-[0.8rem] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Exécuter la commande"
          className="clip-hud-sm flex min-h-11 items-center gap-1.5 border border-primary/45 bg-primary/15 px-3 font-mono text-[0.62rem] tracking-[0.14em] text-primary uppercase transition-colors hover:bg-primary/25 disabled:opacity-40 sm:px-4"
        >
          <Send className="size-4" aria-hidden />
          <span className="hidden sm:inline">[execute]</span>
        </button>
      </form>
    </div>
  );
}
