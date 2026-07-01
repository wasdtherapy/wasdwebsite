"use client";
import { useEffect, useRef, useState } from "react";
import BreathRing, { Phase } from "@/components/BreathRing";
import { useStore } from "@/lib/store";
import { setLayer, stopAllLayers } from "@/lib/soundscape";
import Illustration from "@/components/Illustration";

const PH: Phase[] = [
  { ru: "вдох", en: "inhale", dur: 5, scale: 1 },
  { ru: "выдох", en: "exhale", dur: 5, scale: 0.7 },
];

const SESSIONS = [3, 5, 10, 15, 20];
const SOUNDS = [
  { id: "bowls", ru: "Чаши", en: "Bowls" },
  { id: "om", ru: "Ом", en: "Om" },
  { id: "rain", ru: "Дождь", en: "Rain" },
  { id: "ocean", ru: "Океан", en: "Ocean" },
];

const GUIDE_RU = [
  "Устройся удобно и прикрой глаза.",
  "Отпусти плечи. Пусть лицо расслабится.",
  "Сделай глубокий вдох… и медленный выдох.",
  "Следи за дыханием. Ничего не меняй.",
  "Мысли приходят и уходят. Это нормально.",
  "Почувствуй вес тела. Ты в безопасности.",
  "Отпусти всё, что держишь. Просто будь здесь.",
  "Возвращайся к вдоху и выдоху.",
];
const GUIDE_EN = [
  "Settle in and gently close your eyes.",
  "Drop your shoulders. Let your face soften.",
  "Take a deep breath in… and a slow breath out.",
  "Follow your breath. Change nothing.",
  "Thoughts come and go. That is okay.",
  "Feel the weight of your body. You are safe.",
  "Release whatever you are holding. Just be here.",
  "Return to the inhale and the exhale.",
];

export default function Meditate() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [min, setMin] = useState(5);
  const [sound, setSound] = useState("bowls");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!running) { if (ref.current) clearInterval(ref.current); return; }
    ref.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= min * 60) { setRunning(false); return min * 60; }
        return e + 1;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, min]);

  useEffect(() => {
    if (running) { stopAllLayers(); setLayer(sound, true, 0.45); }
    else stopAllLayers();
  }, [running, sound]);

  const start = () => { setElapsed(0); setRunning(true); };
  const finished = elapsed >= min * 60 && !running && elapsed > 0;
  const gi = Math.min(GUIDE_RU.length - 1, Math.floor(elapsed / Math.max(20, (min * 60) / GUIDE_RU.length)));
  const remain = min * 60 - elapsed;
  const mm = String(Math.floor(remain / 60)).padStart(2, "0");
  const ss = String(remain % 60).padStart(2, "0");

  return (
    <section className="tool">
      <h1>{t("Медитация", "Meditate")}</h1>
      <p className="sub">{t("Гайдовая практика с мягкими подсказками и живым фоном. Просто следуй за дыханием.", "A guided practice with gentle prompts and a living ambience. Just follow the breath.")}</p>
      <Illustration variant="night" />
      <div className="eyebrow">{t("длительность", "duration")}</div>
      <div className="seg">
        {SESSIONS.map((m) => (
          <button key={m} className={m === min ? "chip on" : "chip"} onClick={() => { setRunning(false); setElapsed(0); setMin(m); }}>{m} {t("мин", "min")}</button>
        ))}
      </div>
      <div className="eyebrow">{t("фон", "ambience")}</div>
      <div className="seg">
        {SOUNDS.map((s) => (
          <button key={s.id} className={s.id === sound ? "chip on" : "chip"} onClick={() => setSound(s.id)}>{t(s.ru, s.en)}</button>
        ))}
      </div>
      <BreathRing phases={PH} running={running} />
      <div className="eyebrow">{running ? `${mm}:${ss}` : finished ? t("готово · хорошая работа", "done · well done") : t("готов начать", "ready")}</div>
      <p className="sub">{running ? t(GUIDE_RU[gi], GUIDE_EN[gi]) : t("Надень наушники и нажми «Начать».", "Put on headphones and press Start.")}</p>
      <div className="controls">
        <button className="btn" onClick={() => (running ? setRunning(false) : start())}>{running ? t("Стоп", "Stop") : t("Начать", "Start")}</button>
      </div>
      <div className="note">{t("Нет «правильной» медитации. Если отвлёкся — просто мягко вернись к дыханию. Начни с 3 минут каждый день.", "There is no perfect meditation. If you drift, gently return to the breath. Start with 3 minutes a day.")}</div>
    </section>
  );
}
