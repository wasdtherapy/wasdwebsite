"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { setLayer as playLayer } from "@/lib/soundscape";

type L = { ru: string; en: string };
type Rec = { title: L; href: string; cta: L; layers: string[]; note: L };

const ICON = { fontSize: "18px", marginRight: "6px" };

const MOODS: { id: string; ru: string; en: string; icon: string }[] = [
  { id: "anxious", ru: "Тревога", en: "Anxious", icon: "🌊" },
  { id: "restless", ru: "Не усидеть", en: "Restless", icon: "🍃" },
  { id: "tired", ru: "Усталость", en: "Tired", icon: "☕" },
  { id: "sad", ru: "Грусть", en: "Low", icon: "🔥" },
  { id: "focus", ru: "Нужен фокус", en: "Focus", icon: "🎯" },
  { id: "sleep", ru: "Не уснуть", en: "Can't sleep", icon: "🌙" },
];

const REC: Record<string, Rec> = {
  anxious: { title: { ru: "Дыхание 4-7-8", en: "4-7-8 breathing" }, href: "/breathe", cta: { ru: "Открыть дыхание", en: "Open breathing" }, layers: ["rain", "bowls"], note: { ru: "Удлини выдох — телу станет спокойнее уже за минуту.", en: "Lengthen the exhale — the body calms within a minute." } },
  restless: { title: { ru: "Заземление и ветер", en: "Grounding & wind" }, href: "/breathe", cta: { ru: "Открыть дыхание", en: "Open breathing" }, layers: ["wind", "forest"], note: { ru: "Ровный ритм дыхания вернёт тело в момент.", en: "A steady breath brings the body back to now." } },
  tired: { title: { ru: "Мягкий фокус", en: "Gentle focus" }, href: "/focus", cta: { ru: "Открыть фокус", en: "Open focus" }, layers: ["cafe", "stream"], note: { ru: "Не бодрись силой — тёплый фон поможет собраться.", en: "Don't force it — a warm backdrop helps you gather." } },
  sad: { title: { ru: "Тёплые аффирмации", en: "Warm affirmations" }, href: "/affirmations", cta: { ru: "Открыть аффирмации", en: "Open affirmations" }, layers: ["fire", "bowls"], note: { ru: "Побудь с собой по-доброму. Ты имеешь на это право.", en: "Be gentle with yourself. You're allowed to." } },
  focus: { title: { ru: "Глубокая работа", en: "Deep work" }, href: "/focus", cta: { ru: "Открыть фокус", en: "Open focus" }, layers: ["white", "stream"], note: { ru: "Ровный шум скрывает отвлечения и держит ритм.", en: "Steady noise masks distractions and holds the rhythm." } },
  sleep: { title: { ru: "Погружение в сон", en: "Into sleep" }, href: "/sleep", cta: { ru: "Открыть сон", en: "Open sleep" }, layers: ["ocean", "night"], note: { ru: "Приглуши свет и отпусти день. Волны сделают остальное.", en: "Dim the light and let the day go. The waves do the rest." } },
};

export default function Guide() {
  const lang = useStore((s) => s.lang);
  const setLayerStore = useStore((s) => s.setLayer);
  const [pick, setPick] = useState<string | null>(null);
  const t = (o: L) => (lang === "ru" ? o.ru : o.en);
  const tt = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const rec = pick ? REC[pick] : null;
  const playMix = (layers: string[]) => {
    layers.forEach((id) => {
      try { playLayer(id, true, 0.6); } catch {}
      setLayerStore(id, true);
    });
  };
  return (
    <section className="section">
      <div className="eyebrow">{tt("приватный гид", "private guide")}</div>
      <h1>{tt("Что тебе сейчас нужно?", "What do you need now?")}</h1>
      <p className="dim">{tt("Всё считается прямо в твоём браузере — ничего не отправляется.", "Everything is computed in your browser — nothing is sent.")}</p>
      <div className="guide-grid">
        {MOODS.map((m) => (
          <button key={m.id} className="guide-opt" onClick={() => setPick(m.id)}>
            <span style={ICON}>{m.icon}</span> {lang === "ru" ? m.ru : m.en}
          </button>
        ))}
      </div>
      {rec && (
        <div className="guide-card">
          <h3>{t(rec.title)}</h3>
          <p className="dim">{t(rec.note)}</p>
          <div className="guide-actions">
            <Link className="v10-btn" href={rec.href}>{t(rec.cta)}</Link>
            <button className="v10-btn ghost" onClick={() => playMix(rec.layers)}>{tt("Включить звук", "Play soundscape")}</button>
          </div>
        </div>
      )}
    </section>
  );
}
