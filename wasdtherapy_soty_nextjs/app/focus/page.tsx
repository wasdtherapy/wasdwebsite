"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { startPad, stopPad } from "@/lib/audio";

const PRESETS = [
  { id: "classic", ru: "Классика 25/5", en: "Classic 25/5", work: 25, brk: 5 },
  { id: "deep", ru: "Глубокий 50/10", en: "Deep 50/10", work: 50, brk: 10 },
  { id: "sprint", ru: "Спринт 15/3", en: "Sprint 15/3", work: 15, brk: 3 },
];

export default function Focus() {
  const lang = useStore((s) => s.lang);
  const ambientOn = useStore((s) => s.ambientOn);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [pi, setPi] = useState(0);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [left, setLeft] = useState(PRESETS[0].work * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const ref = useRef<any>(null);
  const p = PRESETS[pi];
  useEffect(() => { setRunning(false); setMode("work"); setLeft(p.work * 60); }, [pi]);
  useEffect(() => {
    if (!running) { if (ref.current) clearInterval(ref.current); return; }
    ref.current = setInterval(() => {
      setLeft((s) => {
        if (s > 1) return s - 1;
        if (mode === "work") { setDone((d) => d + 1); setMode("break"); return p.brk * 60; }
        setMode("work"); return p.work * 60;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, mode, pi]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <section className="tool">
      <h1>{t("Фокус", "Focus")}</h1>
      <p className="sub">{t("Работай сосредоточенно, потом отдыхай. Ритм помогает мозгу не выгорать.", "Work with intent, then rest. The rhythm keeps your mind from burning out.")}</p>
      <div className="seg">
        {PRESETS.map((x, i) => (
          <button key={x.id} className={i === pi ? "chip on" : "chip"} onClick={() => setPi(i)}>{t(x.ru, x.en)}</button>
        ))}
      </div>
      <div className="eyebrow">{mode === "work" ? t("работа", "focus") : t("перерыв", "break")}</div>
      <div className="big-time">{mm}:{ss}</div>
      <div className="controls">
        <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? t("Пауза", "Pause") : t("Старт", "Start")}</button>
        <button className="btn-ghost" onClick={() => { setRunning(false); setMode("work"); setLeft(p.work * 60); }}>{t("Сброс", "Reset")}</button>
        <button className="btn-ghost" onClick={() => (ambientOn ? stopPad() : startPad())}>{ambientOn ? t("Выкл. эмбиент", "Ambient off") : t("Вкл. эмбиент", "Ambient on")}</button>
      </div>
      <p className="sub">{t("Сессий завершено", "Sessions done")}: <b>{done}</b></p>
      <div className="note">
        {t("Как пользоваться: ", "How to use: ")}<b>{t("25 минут работы — 5 минут отдыха", "25 min work — 5 min rest")}</b>. {t("Во время перерыва встань, посмотри вдаль и сделай несколько медленных вдохов. Включи эмбиент или звуки для погружения.", "On the break stand up, look far away and take a few slow breaths. Turn on ambient or sounds to stay immersed.")}
      </div>
    </section>
  );
}
