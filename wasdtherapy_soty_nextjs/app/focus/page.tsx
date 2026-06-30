"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

const PRESETS = [5, 15, 25, 50];

export default function Focus() {
  const lang = useStore((s) => s.lang);
  const [total, setTotal] = useState(25 * 60);
  const [left, setLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (running) {
      iv.current = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
      return () => { if (iv.current) clearInterval(iv.current); };
    }
  }, [running]);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <main className="page">
      <h1 className="sec">{lang === "ru" ? "Фокус" : "Focus"}</h1>
      <div className="row" style={undefined}>
        {PRESETS.map((m) => (
          <button key={m} className="btn" onClick={() => { setTotal(m * 60); setLeft(m * 60); setRunning(false); }}>
            {m}{lang === "ru" ? " мин" : " min"}
          </button>
        ))}
      </div>
      <div className="stage"><div className="ring"><span>{fmt(left)}</span></div></div>
      <button className="btn primary" onClick={() => setRunning((r) => !r)}>
        {running ? (lang === "ru" ? "Пауза" : "Pause") : (lang === "ru" ? "Старт" : "Start")}
      </button>
    </main>
  );
}
