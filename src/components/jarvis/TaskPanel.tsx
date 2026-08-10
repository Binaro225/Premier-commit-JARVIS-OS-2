import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, CircleDashed, Loader2, TriangleAlert } from "lucide-react";
import { STATUS_TONE, type Task } from "@/lib/tasks";

const ICONS = {
  PENDING: CircleDashed,
  IN_PROGRESS: Loader2,
  COMPLETE: CheckCircle2,
  FAILED: TriangleAlert,
};

function TaskCard({ task }: { task: Task }) {
  const reduce = useReducedMotion();
  const Icon = ICONS[task.status];
  const tone = STATUS_TONE[task.status];
  const barTone =
    task.status === "FAILED"
      ? "bg-destructive"
      : task.status === "COMPLETE"
        ? "bg-success"
        : "bg-primary";

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="clip-hud-sm border border-border bg-card/70 px-3 py-2.5 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[0.66rem] tracking-[0.14em] text-primary/90">
          {task.pid}
        </span>
        <span className={`hud-label flex items-center gap-1 ${tone}`}>
          <Icon
            className={`size-3 ${task.status === "IN_PROGRESS" && !reduce ? "animate-spin" : ""}`}
            aria-hidden
          />
          {task.status}
        </span>
      </div>

      <p className="mt-1 truncate font-mono text-[0.66rem] text-muted-foreground" title={task.label}>
        {task.label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden bg-secondary/70">
          <motion.div
            className={`h-full ${barTone}`}
            animate={{ width: `${Math.round(task.progress)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ boxShadow: "0 0 12px currentColor" }}
          />
        </div>
        <span className={`font-mono text-[0.62rem] tabular-nums ${tone}`}>
          {Math.round(task.progress)}%
        </span>
      </div>
    </motion.li>
  );
}

export function TaskPanel({ tasks }: { tasks: Task[] }) {
  const active = tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "PENDING").length;

  return (
    <section
      className="glass-panel clip-hud flex min-h-0 flex-col p-3"
      aria-label="Tâches de fond et processus"
    >
      <header className="mb-2 flex items-center justify-between gap-2">
        <h2 className="hud-label text-primary">[parallel_threads]</h2>
        <span className="font-mono text-[0.62rem] text-muted-foreground">{active} actifs</span>
      </header>

      {tasks.length === 0 ? (
        <p className="font-mono text-[0.66rem] leading-relaxed text-muted-foreground">
          Aucun processus. Lancez plusieurs demandes : JARVIS les traite en parallèle.
        </p>
      ) : (
        <ul className="scroll-slim flex max-h-[42vh] flex-col gap-2 overflow-y-auto pr-1 lg:max-h-none lg:flex-1">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </ul>
      )}
    </section>
  );
}
