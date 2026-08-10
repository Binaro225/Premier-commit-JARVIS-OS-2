import { WifiOff } from "lucide-react";
import { motion } from "framer-motion";

export function OfflineBanner({ online }: { online: boolean }) {
  if (online) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      role="status"
      className="clip-hud-sm mx-3 mb-2 flex items-center gap-2 border border-energy/45 bg-energy/10 px-3 py-2 font-mono text-[0.68rem] text-foreground"
    >
      <WifiOff className="size-4 shrink-0 text-energy" aria-hidden />
      [link_lost] JARVIS reprend dès que la connexion revient.
    </motion.div>
  );
}
