const SUGGESTIONS = [
  "Quelles sont mes 5 tâches du jour ?",
  "Analyse mes dernières ventes",
  "Calcule mon bénéfice",
  "Résume mes dépenses",
];

export function Suggestions({
  onPick,
  disabled,
}: {
  onPick: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="scroll-slim flex gap-2 overflow-x-auto px-3 pb-2"
      aria-label="Commandes suggérées"
    >
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onPick(s)}
          className="clip-hud-sm min-h-9 shrink-0 border border-primary/25 bg-primary/5 px-3 font-mono text-[0.66rem] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-40"
        >
          &gt; {s}
        </button>
      ))}
    </div>
  );
}
