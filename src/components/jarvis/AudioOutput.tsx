import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, Waves } from "lucide-react";

const BARS = [0.35, 0.7, 0.45, 0.9, 0.55, 1, 0.6, 0.8, 0.4, 0.75, 0.5, 0.85];

/** Carte audio-output : équaliseur néon + lecture / pause. */
export function AudioOutput({
  playing,
  onToggle,
}: {
  playing: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="clip-hud-sm mt-2.5 flex items-center gap-2 border border-primary/25 bg-primary/5 px-2 py-1.5">
      <button
        type="button"
        onClick={onToggle}
        aria-label={playing ? "Mettre en pause la synthèse vocale" : "Écouter la réponse"}
        className="clip-hud-sm flex size-8 items-center justify-center border border-primary/40 bg-primary/15 text-primary transition-colors hover:bg-primary/25"
      >
        {playing ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
      </button>

      <div className="flex h-6 flex-1 items-center gap-[3px]" aria-hidden>
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-primary"
            style={{ boxShadow: "0 0 8px var(--primary)" }}
            animate={
              playing && !reduce
                ? { height: [`${h * 30}%`, "100%", `${h * 45}%`] }
                : { height: `${h * 34}%` }
            }
            transition={{
              duration: 0.7 + (i % 4) * 0.16,
              repeat: playing && !reduce ? Infinity : 0,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <span className="hud-label flex items-center gap-1 text-primary/70">
        <Waves className="size-3" aria-hidden />
        {playing ? "tts_out" : "audio"}
      </span>
    </div>
  );
}
