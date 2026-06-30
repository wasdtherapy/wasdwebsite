"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const KEY = "wt_onboarded_v1";

export default function Onboarding() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setOpen(true); } catch {}
  }, []);

  const slides = [
    { ic: "🌬", ru: "Добро пожаловать", en: "Welcome", rd: "wasd/therapy — тихое место, чтобы замедлиться и подышать. Без рекламы, без регистрации.", ed: "wasd/therapy is a quiet place to slow down and breathe. No ads, no signup." },
    { ic: "🎧", ru: "Надень наушники", en: "Put on headphones", rd: "Звук генерируется вживую и никогда не повторяется. С наушниками — заметно глубже.", ed: "Audio is generated live and never repeats. Headphones make it far deeper." },
    { ic: "⌘", ru: "Быстрый доступ", en: "Quick access", rd: "Нажми ⌘K (или Ctrl+K) в любой момент, чтобы мгновенно прыгнуть в любую практику.", ed: "Press ⌘K (or Ctrl+K) anytime to jump straight into any practice." },
  ];

  if (!open) return null;
  const close = () => { try { localStorage.setItem(KEY, "1"); } catch {} setOpen(false); };
  const s = slides[i];
  const last = i === slides.length - 1;

  return (
    <div className="onb" role="dialog" aria-modal="true">
      <div className="onb-card">
        <div className="onb-ic">{s.ic}</div>
        <h3>{t(s.ru, s.en)}</h3>
        <p>{t(s.rd, s.ed)}</p>
        <div className="onb-dots">
          {slides.map((_, k) => <span key={k} className={k === i ? "on" : ""} />)}
        </div>
        <div className="onb-row">
          <button className="onb-skip" onClick={close}>{t("Пропустить", "Skip")}</button>
          <button className="btn" onClick={() => (last ? close() : setI(i + 1))}>
            {last ? t("Начать", "Start") : t("Дальше", "Next")}
          </button>
        </div>
      </div>
    </div>
  );
}
