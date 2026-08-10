import { motion, useReducedMotion } from "framer-motion";

export function LoadingState({ count = 1 }: { count?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex" aria-label="JARVIS traite votre demande">
      <div className="clip-hud-sm flex items-center gap-2 border border-primary/25 bg-primary/5 px-3 py-2">
        <span className="hud-label text-primary/80">jarvis_core</span>
        <span className="flex items-end gap-[3px]" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="w-[3px] bg-primary"
              animate={reduce ? { height: 6 } : { height: [4, 14, 6] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror", delay: i * 0.12 }}
            />
          ))}
        </span>
        <span className="font-mono text-[0.68rem] text-muted-foreground">
          traitement… {count > 1 ? `${count} threads` : "1 thread"}
        </span>
      </div>
    </div>
  );
}
