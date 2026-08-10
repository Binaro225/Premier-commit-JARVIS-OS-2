import { useEffect, useState } from "react";
import { Activity, Cpu, MemoryStick, Radio } from "lucide-react";

function useTelemetry(online: boolean, busy: boolean) {
  const [cpu, setCpu] = useState(14);
  const [ram, setRam] = useState(32.8);
  const [ping, setPing] = useState(12);

  useEffect(() => {
    const tick = () => {
      setCpu(() => {
        const base = busy ? 62 : 13;
        return Math.min(99, Math.max(4, base + Math.round((Math.random() - 0.4) * 18)));
      });
      setRam(() => {
        const base = busy ? 41 : 32;
        return Math.min(63.9, Math.max(18, +(base + (Math.random() - 0.5) * 6).toFixed(1)));
      });
      setPing(() => (online ? 8 + Math.floor(Math.random() * 26) : 0));
    };
    tick();
    const id = setInterval(tick, 2400);
    return () => clearInterval(id);
  }, [busy, online]);

  return { cpu, ram, ping };
}

function Gauge({
  icon: Icon,
  label,
  value,
  tone = "text-primary",
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="clip-hud-sm flex items-center gap-1.5 border border-border bg-card px-2 py-1">
      <Icon className={`size-3 ${tone}`} aria-hidden />
      <span className="hud-label text-muted-foreground">{label}</span>
      <span className={`font-mono text-[0.68rem] tabular-nums ${tone}`}>{value}</span>
    </div>
  );
}

export function Telemetry({ online, busy }: { online: boolean; busy: boolean }) {
  const { cpu, ram, ping } = useTelemetry(online, busy);

  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label="Télémétrie système">
      <Gauge icon={Cpu} label="cpu" value={`${cpu}%`} />
      <Gauge icon={MemoryStick} label="ram" value={`${ram.toFixed(1)}/64GB`} />
      <Gauge
        icon={Activity}
        label="ping"
        value={online ? `${ping}ms` : "--"}
        tone={online ? "text-primary" : "text-destructive"}
      />
      <div
        className={`clip-hud-sm flex items-center gap-1.5 border px-2 py-1 ${
          online ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10"
        }`}
      >
        <span className="relative flex size-1.5" aria-hidden>
          <span
            className={`absolute inset-0 animate-ping rounded-full ${
              online ? "bg-success/70" : "bg-destructive/70"
            }`}
          />
          <span
            className={`relative size-1.5 rounded-full ${online ? "bg-success" : "bg-destructive"}`}
          />
        </span>
        <span
          className={`hud-label ${online ? "text-success" : "text-destructive"}`}
          aria-live="polite"
        >
          {online ? "[system_online]" : "[link_lost]"}
        </span>
        <Radio className="size-3 opacity-0" aria-hidden />
      </div>
    </div>
  );
}
