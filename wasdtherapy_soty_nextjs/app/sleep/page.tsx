"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { setLayer, stopAllLayers } from "@/lib/soundscape";
import Illustration from "@/components/Illustration";

const MINS = [15, 30, 45, 60];
const SOUNDS = [
  { id: "ocean", ru: "Океан", en: "Ocean" },
  { id: "rain", ru: "Дождь", en: "Rain" },
  { id: "night", ru: "Ночь", en: "Night" },
  { id: "white", ru: "Белый шум", en: "White noise" },
];

export default function Sleep() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [min, setMin] = useState(30);
  const [sound, setSound] = useState("ocean");
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(0);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!running) { if (ref.current) clearInterval(ref.current); return; }
    ref.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) { setRunning(false); stopAllLayers(); return 0; }
        return l - 1;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  useEffect(() => {
    if (running) { stopAllLayers(); setLayer(sound, true, 0.5); }
    else stopAllLayers();
  }, [running, sound]);

  const start = () => { setLeft(min * 60); setRunning(true); };
  const stop = () => { setRunning(false); stopAllLayers(); };
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <section className={running ? "tool sleeping" : "tool"}>
      <h1>{t("Таймер сна", "Sleep timer")}</h1>
      <p className="sub">{t("Мягкий звук, который плавно затихнет и выключится сам. Засыпай спокойно — экран потемнеет.", "A gentle sound that fades out and stops by itself. Fall asleep easy — the screen dims.")}</p>
      <Illustration variant="night" />
      <div className="eyebrow">{t("длительность", "duration")}</div>
      <div className="seg">
        {MINS.map((m) => (
          <button key={m} className={m === min ? "chip on" : "chip"} onClick={() => { if (!running) setMin(m); }}>{m} {t("мин", "min")}</button>
        ))}
      </div>
      <div className="eyebrow">{t("звук", "sound")}</div>
      <div className="seg">
        {SOUNDS.map((s) => (
          <button key={s.id} className={s.id === sound ? "chip on" : "chip"} onClick={() => setSound(s.id)}>{t(s.ru, s.en)}</button>
        ))}
      </div>
      <div className="big-time">{running ? `${mm}:${ss}` : `${min}:00`}</div>
      <div className="controls">
        <button className="btn" onClick={() => (running ? stop() : start())}>{running ? t("Остановить", "Stop") : t("Уснуть", "Sleep")}</button>
      </div>
      <div className="note">{t("Совет: положи телефон экраном вниз и закрой глаза. Звук исчезнет вместе с тобой.", "Tip: place your phone face down and close your eyes. The sound fades as you do.")}</div>
    </section>
  );
}
