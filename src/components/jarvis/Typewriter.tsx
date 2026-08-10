import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Effet machine à écrire pour les réponses de l'IA. */
export function Typewriter({
  text,
  enabled = true,
  speed = 12,
}: {
  text: string;
  enabled?: boolean;
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const instant = reduce || !enabled;
  const [count, setCount] = useState(instant ? text.length : 0);

  useEffect(() => {
    if (instant) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    const step = Math.max(1, Math.ceil(text.length / 400));
    const id = setInterval(() => {
      i += step;
      setCount(Math.min(text.length, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, instant, speed]);

  const done = count >= text.length;

  return (
    <span>
      {text.slice(0, count)}
      {!done && <span className="animate-caret text-primary">▊</span>}
    </span>
  );
}
