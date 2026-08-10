import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { LoadingState } from "./LoadingState";
import type { Message } from "@/lib/jarvisStore";

type Props = {
  messages: Message[];
  speakingId: string | null;
  freshIds: string[];
  processing: boolean;
  processingCount: number;
  onReplay: (message: Message) => void;
  onStop: () => void;
  onRetry: (prompt: string) => void;
};

export function ChatHistory({
  messages,
  speakingId,
  freshIds,
  processing,
  processingCount,
  onReplay,
  onStop,
  onRetry,
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, processing]);

  return (
    <div
      className="scroll-slim flex-1 space-y-2.5 overflow-y-auto px-3 pb-2"
      role="log"
      aria-live="polite"
      aria-label="Flux de la console JARVIS"
    >
      {messages.map((m) => (
        <ChatMessage
          key={m.id}
          message={m}
          isSpeakingThis={speakingId === m.id}
          isFresh={freshIds.includes(m.id)}
          onReplay={onReplay}
          onStop={onStop}
          onRetry={onRetry}
        />
      ))}
      {processing && <LoadingState count={processingCount} />}
      <div ref={endRef} />
    </div>
  );
}
