"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { startPad, stopPad } from "@/lib/audio";

type Ph = { ru: string; en: string; dur: number; scale: number };
const PHASES: Ph[] = [
  { ru: "вдох", en: "inhale", dur: 4, scale: 1 },
  { ru: "задержка", en: "hold", dur: 2, scale: 1 },
  { ru: "выдох", en: "exhale", dur: 6, scale: 0.62 },
];

export default function QuickCalm() {
  const lang = useStore((s) => s.lang);
  const addMindful = useStore((s) => s.addMindful);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const orbRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    stopPad();
    if (elapsed > 4) addMindful(elapsed);
  }, [elapsed, addMindful]);

  useEffect(() => {
    const onOpen = () => { setOpen(true); setIdx(0); setElapsed(0); startPad().catch(() => {}); };
    window.addEventListener("wt-quickcalm", onOpen);
    return () => window.removeEventListener("wt-quickcalm", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    const tick = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => { window.removeEventListener("keydown", onKey); clearInterval(tick); };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const ph = PHASES[idx];
    const el = orbRef.current;
    if (el) {
      el.style.transition = `transform ${ph.dur}s cubic-bezier(.37,0,.45,1)`;
      el.style.transform = `scale(${ph.scale})`;
    }
    const to = setTimeout(() => setIdx((i) => (i + 1) % PHASES.length), ph.dur * 1000);
    return () => clearTimeout(to);
  }, [idx, open]);

  return (
    <>
      <button className="qc-fab" onClick={() => window.dispatchEvent(new Event("wt-quickcalm"))} aria-label={t("Быстрое успокоение", "Quick calm")} title={t("Быстрое успокоение", "Quick calm")}>
        <span>●</span>
      </button>
      {open && (
        <div className="qc-overlay" role="dialog" aria-modal="true">
          <button className="qc-close" onClick={close} aria-label="close">×</button>
          <div className="qc-hint">{t("Следуй за кругом. Дыши медленно.", "Follow the circle. Breathe slowly.")}</div>
          <div className="qc-stage">
            <div ref={orbRef} className="qc-orb">
              <span className="qc-word">{t(PHASES[idx].ru, PHASES[idx].en)}</span>
            </div>
          </div>
          <div className="qc-time">{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}</div>
          <button className="btn-ghost qc-done" onClick={close}>{t("Мне лучше", "I feel better")}</button>
        </div>
      )}
    </>
  );
}
