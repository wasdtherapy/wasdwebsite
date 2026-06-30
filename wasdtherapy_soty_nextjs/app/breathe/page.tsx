"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

const PHASES = [
  { ru: "вдох", en: "inhale", dur: 4, scale: 1.3 },
  { ru: "задержка", en: "hold", dur: 7, scale: 1.3 },
  { ru: "выдох", en: "exhale", dur: 8, scale: 0.8 },
];

export default function Breathe() {
  const lang = useStore((s) => s.lang);
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!running) return;
    const p = PHASES[phase];
    const el = ref.current!;
    el.style.transition = `transform ${p.dur}s cubic-bezier(.4,0,.4,1)`;
    el.style.transform = `scale(${p.scale})`;
    const t = setTimeout(() => setPhase((phase + 1) % PHASES.length), p.dur * 1000);
    return () => clearTimeout(t);
  }, [phase, running]);
  const p = PHASES[phase];
  return (
    <main className="page">
      <h1 className="sec">{lang === "ru" ? "Дыхание" : "Breathe"}</h1>
      <div className="stage">
        <div ref={ref} className="ring"><span>{running ? (lang === "ru" ? p.ru : p.en) : ""}</span></div>
      </div>
      <button className="btn primary" onClick={() => setRunning((r) => !r)}>
        {running ? (lang === "ru" ? "Стоп" : "Stop") : (lang === "ru" ? "Начать" : "Begin")}
      </button>
    </main>
  );
}
