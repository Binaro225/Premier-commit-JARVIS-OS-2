import { Square, Volume2, VolumeX } from "lucide-react";

type Props = {
  voiceEnabled: boolean;
  speaking: boolean;
  onToggleVoice: () => void;
  onStop: () => void;
};

export function AudioControls({ voiceEnabled, speaking, onToggleVoice, onStop }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onToggleVoice}
        aria-pressed={voiceEnabled}
        aria-label={voiceEnabled ? "Couper la voix de JARVIS" : "Activer la voix de JARVIS"}
        className={`clip-hud-sm inline-flex min-h-9 items-center gap-1.5 border px-2 font-mono text-[0.6rem] tracking-[0.14em] uppercase transition-colors ${
          voiceEnabled
            ? "border-primary/45 bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:text-primary"
        }`}
      >
        {voiceEnabled ? (
          <Volume2 className="size-[15px]" aria-hidden />
        ) : (
          <VolumeX className="size-[15px]" aria-hidden />
        )}
        tts
      </button>

      {speaking && (
        <button
          type="button"
          onClick={onStop}
          aria-label="Arrêter la voix immédiatement"
          className="clip-hud-sm inline-flex min-h-9 items-center gap-1.5 border border-destructive/45 bg-destructive/10 px-2 font-mono text-[0.6rem] tracking-[0.14em] text-destructive uppercase"
        >
          <Square className="size-[15px]" aria-hidden />
          stop
        </button>
      )}
    </div>
  );
}
