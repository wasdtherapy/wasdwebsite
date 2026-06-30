"use client";
import { useEffect, useState } from "react";
import BreathRing, { Phase } from "@/components/BreathRing";
import { useStore } from "@/lib/store";

type Tech = { id: string; ru: string; en: string; dr: string; de: string; phases: Phase[] };

const TECHS: Tech[] = [
  { id: "478", ru: "4-7-8", en: "4-7-8", dr: "Сон и тревога", de: "Sleep & anxiety", phases: [
    { ru: "вдох", en: "inhale", dur: 4, scale: 1 }, { ru: "задержка", en: "hold", dur: 7, scale: 1 }, { ru: "выдох", en: "exhale", dur: 8, scale: 0.7 } ] },
  { id: "box", ru: "Бокс 4-4-4-4", en: "Box 4-4-4-4", dr: "Фокус и контроль", de: "Focus & control", phases: [
    { ru: "вдох", en: "inhale", dur: 4, scale: 1 }, { ru: "задержка", en: "hold", dur: 4, scale: 1 }, { ru: "выдох", en: "exhale", dur: 4, scale: 0.7 }, { ru: "пауза", en: "hold", dur: 4, scale: 0.7 } ] },
  { id: "coherent", ru: "Когерентное 5-5", en: "Coherent 5-5", dr: "Баланс нервной системы", de: "Nervous system balance", phases: [
    { ru: "вдох", en: "inhale", dur: 5, scale: 1 }, { ru: "выдох", en: "exhale", dur: 5, scale: 0.7 } ] },
  { id: "calm", ru: "Успокоение 4-2-6", en: "Calming 4-2-6", dr: "Снять стресс", de: "Relieve stress", phases: [
    { ru: "вдох", en: "inhale", dur: 4, scale: 1 }, { ru: "задержка", en: "hold", dur: 2, scale: 1 }, { ru: "выдох", en: "exhale", dur: 6, scale: 0.7 } ] },
  { id: "relax", ru: "Релакс 4-4-8", en: "Relax 4-4-8", dr: "Глубокое расслабление", de: "Deep relaxation", phases: [
    { ru: "вдох", en: "inhale", dur: 4, scale: 1 }, { ru: "задержка", en: "hold", dur: 4, scale: 1 }, { ru: "выдох", en: "exhale", dur: 8, scale: 0.7 } ] },
  { id: "energy", ru: "Энергия 6-2", en: "Energy 6-2", dr: "Бодрость утром", de: "Morning energy", phases: [
    { ru: "вдох", en: "inhale", dur: 6, scale: 1 }, { ru: "выдох", en: "exhale", dur: 2, scale: 0.7 } ] },
];

export default function Breathe() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [ti, setTi] = useState(0);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const tech = TECHS[ti];
  useEffect(() => { setRunning(false); setCycles(0); }, [ti]);
  return (
    <section className="tool">
      <h1>{t("Дыхание", "Breathe")}</h1>
      <p className="sub">{t("Выбери технику и следуй за кольцом: расширяется — вдох, сжимается — выдох.", "Pick a technique and follow the ring: it grows on the inhale, shrinks on the exhale.")}</p>
      <div className="seg">
        {TECHS.map((x, i) => (
          <button key={x.id} className={i === ti ? "chip on" : "chip"} onClick={() => setTi(i)}>{t(x.ru, x.en)}</button>
        ))}
      </div>
      <BreathRing phases={tech.phases} running={running} onCycle={() => setCycles((c) => c + 1)} />
      <div className="controls">
        <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? t("Пауза", "Pause") : t("Начать", "Start")}</button>
        <button className="btn-ghost" onClick={() => { setRunning(false); setCycles(0); }}>{t("Сброс", "Reset")}</button>
      </div>
      <p className="sub">{t("Циклов пройдено", "Cycles done")}: <b>{cycles}</b></p>
      <div className="note">
        <b>{t(x_label(lang, tech), x_label(lang, tech))}</b><br />
        {t("Полезно: ", "Good for: ")}{t(tech.dr, tech.de)}.<br />
        {t("Совет: дыши через нос, расслабь плечи и сделай минимум 4 цикла. Для сна — 6–8 циклов лёжа.", "Tip: breathe through the nose, relax your shoulders, do at least 4 cycles. For sleep — 6–8 cycles lying down.")}
      </div>
    </section>
  );
}

function x_label(lang: string, tech: Tech) {
  return lang === "ru" ? tech.ru : tech.en;
}
