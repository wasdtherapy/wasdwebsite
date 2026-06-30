"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

export type Phase = { ru: string; en: string; dur: number; scale: number };

export default function BreathRing({ phases, running, onCycle }: { phases: Phase[]; running: boolean; onCycle?: () => void }) {
  const lang = useStore((s) => s.lang);
  const level = useStore((s) => s.audioLevel);
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(phases[0]?.dur ?? 4);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!running) setIdx(0); }, [running]);

  useEffect(() => {
    if (!running) {
      const el = ringRef.current;
      if (el) { el.style.transition = "transform 1.2s ease"; el.style.transform = "scale(0.72)"; }
      return;
    }
    const ph = phases[idx];
    const el = ringRef.current;
    if (el) {
      el.style.transition = `transform ${ph.dur}s cubic-bezier(.37,0,.45,1)`;
      el.style.transform = `scale(${ph.scale})`;
    }
    setCount(ph.dur);
    const cd = setInterval(() => setCount((c) => (c > 1 ? c - 1 : c)), 1000);
    const t = setTimeout(() => {
      const next = (idx + 1) % phases.length;
      if (next === 0 && onCycle) onCycle();
      setIdx(next);
    }, ph.dur * 1000);
    return () => { clearTimeout(t); clearInterval(cd); };
  }, [idx, running, phases]);

  const ph = phases[idx];
  const glowStyle = { boxShadow: `0 0 ${50 + level * 130}px ${8 + level * 34}px var(--c2)` };
  return (
    <div className="breathring">
      <div className="br-aura" />
      <div ref={ringRef} className="br-orb" style={glowStyle}>
        <div className="br-label">{running ? (lang === "ru" ? ph.ru : ph.en) : lang === "ru" ? "готов?" : "ready?"}</div>
        {running && <div className="br-count">{count}</div>}
      </div>
    </div>
  );
}
