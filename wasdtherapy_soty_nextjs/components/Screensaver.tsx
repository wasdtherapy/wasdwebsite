"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { speak, cancelSpeech } from "@/lib/voice";
import { breathHaptic } from "@/lib/haptics";

const PHASES = [
  { key: "in" as const, secs: 4, ru: "Вдох", en: "Breathe in" },
  { key: "hold" as const, secs: 4, ru: "Задержка", en: "Hold" },
  { key: "out" as const, secs: 6, ru: "Выдох", en: "Breathe out" },
];

export default function Screensaver() {
  const on = useStore((s) => s.screensaver);
  const setOn = useStore((s) => s.setScreensaver);
  const lang = useStore((s) => s.lang);
  const voiceOn = useStore((s) => s.voiceOn);
  const hapticsOn = useStore((s) => s.hapticsOn);
  const [phase, setPhase] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!on) return;
    let idx = 0;
    const run = () => {
      const p = PHASES[idx % PHASES.length];
      setPhase(idx % PHASES.length);
      if (voiceOn) speak(lang === "ru" ? p.ru : p.en, lang);
      if (hapticsOn) breathHaptic(p.key);
      timer.current = setTimeout(() => { idx++; run(); }, p.secs * 1000);
    };
    run();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOn(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      cancelSpeech();
      window.removeEventListener("keydown", onKey);
    };
  }, [on, voiceOn, hapticsOn, lang, setOn]);
  if (!on) return null;
  const p = PHASES[phase];
  return (
    <div className="saver" onClick={() => setOn(false)} role="dialog" aria-label="ambient breathing">
      <div className={`saver-orb saver-${p.key}`} />
      <div className="saver-label">{lang === "ru" ? p.ru : p.en}</div>
      <div className="saver-exit">{lang === "ru" ? "нажми, чтобы выйти" : "tap to exit"}</div>
    </div>
  );
}
