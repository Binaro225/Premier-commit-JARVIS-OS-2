import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw, TerminalSquare, User } from "lucide-react";
import { AudioOutput } from "./AudioOutput";
import { Typewriter } from "./Typewriter";
import type { Message } from "@/lib/jarvisStore";

type Props = {
  message: Message;
  isSpeakingThis: boolean;
  isFresh: boolean;
  onReplay: (message: Message) => void;
  onStop: () => void;
  onRetry: (prompt: string) => void;
};

function stamp(at: number) {
  return new Date(at).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ChatMessage({
  message,
  isSpeakingThis,
  isFresh,
  onReplay,
  onStop,
  onRetry,
}: Props) {
  const reduce = useReducedMotion();
  const isUser = message.role === "user";

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: "easeOut" }}
      className={`clip-hud border bg-card/60 px-3 py-2.5 backdrop-blur-md ${
        isUser
          ? "ml-auto max-w-[92%] border-accent/35"
          : message.error
            ? "max-w-full border-destructive/40"
            : "max-w-full border-primary/25 glow-inset"
      }`}
    >
      <header className="mb-1.5 flex items-center gap-2">
        {isUser ? (
          <User className="size-3 text-accent" aria-hidden />
        ) : (
          <TerminalSquare
            className={`size-3 ${message.error ? "text-destructive" : "text-primary"}`}
            aria-hidden
          />
        )}
        <span
          className={`hud-label ${
            isUser ? "text-accent" : message.error ? "text-destructive" : "text-primary"
          }`}
        >
          {isUser ? "user@local" : message.error ? "core_error" : "jarvis_core"}
        </span>
        {message.pid && (
          <span className="font-mono text-[0.6rem] text-muted-foreground">{message.pid}</span>
        )}
        <span className="ml-auto font-mono text-[0.6rem] tabular-nums text-muted-foreground">
          {stamp(message.at)}
        </span>
      </header>

      <p
        className={`font-mono text-[0.8rem] leading-relaxed whitespace-pre-wrap ${
          message.error ? "text-destructive" : isUser ? "text-foreground/90" : "text-foreground"
        }`}
      >
        {isUser || message.error ? (
          message.text
        ) : (
          <Typewriter text={message.text} enabled={isFresh} />
        )}
      </p>

      {!isUser && !message.error && (
        <AudioOutput playing={isSpeakingThis} onToggle={() => (isSpeakingThis ? onStop() : onReplay(message))} />
      )}

      {message.error && message.retryPrompt && (
        <button
          type="button"
          onClick={() => onRetry(message.retryPrompt as string)}
          className="clip-hud-sm mt-2 inline-flex min-h-9 items-center gap-1.5 border border-destructive/40 bg-destructive/10 px-3 font-mono text-[0.68rem] text-destructive transition-colors hover:bg-destructive/20"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          [RETRY_COMMAND]
        </button>
      )}
    </motion.article>
  );
}
