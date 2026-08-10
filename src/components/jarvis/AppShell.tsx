import { useEffect, useState, type ReactNode } from "react";
import { Settings2, Terminal } from "lucide-react";
import { Telemetry } from "./Telemetry";

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[0.68rem] tabular-nums text-foreground/80" aria-label="Heure locale">
      {time}
    </span>
  );
}

export function AppShell({
  children,
  aside,
  onOpenSettings,
  online,
  busy,
}: {
  children: ReactNode;
  aside: ReactNode;
  onOpenSettings: () => void;
  online: boolean;
  busy: boolean;
}) {
  return (
    <main className="hud-grid scanlines relative flex h-[100dvh] flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,oklch(0.874_0.147_199.6/10%),transparent)]"
        aria-hidden
      />

      <header className="relative flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-3 pt-[max(0.6rem,env(safe-area-inset-top))] pb-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-primary" aria-hidden />
          <h1 className="font-display text-glow text-[0.82rem] leading-none font-bold tracking-[0.14em] text-primary">
            JARVIS-OS
            <span className="ml-1 animate-hud-blink text-primary/70">// CORE v4.09</span>
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Clock />
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Ouvrir les paramètres"
            className="clip-hud-sm inline-flex size-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Settings2 className="size-4" aria-hidden />
          </button>
        </div>

        <div className="w-full">
          <Telemetry online={online} busy={busy} />
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2 lg:grid lg:grid-cols-[1fr_20rem] lg:gap-3 lg:p-3">
        <div className="glass-panel clip-hud flex min-h-0 flex-1 flex-col overflow-hidden lg:order-1">
          {children}
        </div>
        <div className="min-h-0 shrink-0 lg:order-2 lg:overflow-hidden">{aside}</div>
      </div>
    </main>
  );
}
