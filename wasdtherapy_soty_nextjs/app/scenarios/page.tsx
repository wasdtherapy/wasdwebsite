"use client";
import { useEffect, useRef, useState } from "react";
import BreathRing, { Phase } from "@/components/BreathRing";
import Illustration from "@/components/Illustration";
import { useStore } from "@/lib/store";
import { setLayer, stopAllLayers } from "@/lib/soundscape";

type Variant = "night" | "waves" | "sunrise" | "rain" | "sparkles";
type Scene = {
  id: string; ru: string; en: string; dr: string; de: string; icon: string;
  minutes: number; layers: string[]; phases: Phase[]; variant: Variant;
};

const IN = (dur: number) => ({ ru: "вдох", en: "inhale", dur, scale: 1 });
const HOLD = (dur: number) => ({ ru: "задержка", en: "hold", dur, scale: 1 });
const OUT = (dur: number) => ({ ru: "выдох", en: "exhale", dur, scale: 0.7 });

const SCENES: Scene[] = [
  { id: "sleep", ru: "Перед сном", en: "Before sleep", dr: "Дыхание 4-7-8 + дождь и ночь", de: "4-7-8 breathing + rain and night", icon: "🌙", minutes: 8, layers: ["rain", "night"], variant: "night", phases: [IN(4), HOLD(7), OUT(8)] },
  { id: "focus", ru: "Фокус на работе", en: "Deep focus", dr: "Бокс-дыхание + кафе и белый шум", de: "Box breathing + cafe and white noise", icon: "🌑", minutes: 12, layers: ["cafe", "white"], variant: "sparkles", phases: [IN(4), HOLD(4), OUT(4), HOLD(4)] },
  { id: "reset", ru: "5 минут перезагрузки", en: "5-min reset", dr: "Когерентное 5-5 + океан", de: "Coherent 5-5 + ocean", icon: "🌊", minutes: 5, layers: ["ocean"], variant: "waves", phases: [IN(5), OUT(5)] },
  { id: "morning", ru: "Бодрое утро", en: "Bright morning", dr: "Энергия 6-2 + лес и птицы", de: "Energy 6-2 + forest and birds", icon: "🌅", minutes: 6, layers: ["forest", "birds"], variant: "sunrise", phases: [IN(6), OUT(2)] },
  { id: "unwind", ru: "Снять тревогу", en: "Ease anxiety", dr: "Успокоение 4-2-6 + костёр", de: "Calming 4-2-6 + fire", icon: "🔥", minutes: 7, layers: ["fire", "wind"], variant: "rain", phases: [IN(4), HOLD(2), OUT(6)] },
];

export default function Scenarios() {
  const lang = useStore((s) => s.lang);
  const addMindful = useStore((s) => s.addMindful);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [active, setActive] = useState<Scene | null>(null);
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(0);
  const accRef = useRef(0);

  const stop = () => {
    setRunning(false);
    stopAllLayers();
    if (accRef.current > 4) addMindful(Math.round(accRef.current));
    accRef.current = 0;
    setActive(null);
  };

  const start = (sc: Scene) => {
    setActive(sc);
    setLeft(sc.minutes * 60);
    accRef.current = 0;
    setRunning(true);
    sc.layers.forEach((id) => setLayer(id, true, 0.55));
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      accRef.current += 1;
      setLeft((s) => {
        if (s <= 1) { stopAllLayers(); setRunning(false); addMindful(Math.round(accRef.current)); accRef.current = 0; return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => () => { stopAllLayers(); }, []);

  if (active) {
    const mm = Math.floor(left / 60), ss = left % 60;
    return (
      <section className="tool">
        <h1>{active.icon} {t(active.ru, active.en)}</h1>
        <p className="sub">{t(active.dr, active.de)}</p>
        <Illustration variant={active.variant} />
        <BreathRing phases={active.phases} running={running} />
        <div className="big-time">{mm}:{String(ss).padStart(2, "0")}</div>
        <div className="controls">
          <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? t("Пауза", "Pause") : t("Продолжить", "Resume")}</button>
          <button className="btn-ghost" onClick={stop}>{t("Завершить", "Finish")}</button>
        </div>
        {left === 0 && <p className="sub">{t("Сессия завершена. Молодец. ✨", "Session complete. Well done. ✨")}</p>}
      </section>
    );
  }

  return (
    <section className="tool">
      <h1>{t("Сценарии", "Scenarios")}</h1>
      <p className="sub">{t("Готовые связки «дыхание + звук + таймер». Один тап — и просто отпускай.", "Ready-made 'breath + sound + timer' flows. One tap, then just let go.")}</p>
      <div className="scene-grid">
        {SCENES.map((sc) => (
          <button key={sc.id} className="scene-card" onClick={() => start(sc)}>
            <div className="scene-ic">{sc.icon}</div>
            <div className="scene-name">{t(sc.ru, sc.en)}</div>
            <div className="scene-desc">{t(sc.dr, sc.de)}</div>
            <div className="scene-min">{sc.minutes} {t("мин", "min")}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
