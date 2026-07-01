"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const KEY = "wt_onboarded_v1";

export default function Onboarding() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/") return;
    try { if (!localStorage.getItem(KEY)) setOpen(true); } catch {}
  }, [pathname]);
  const slides = [
    { icon: "🌬", ru: "Добро пожаловать", en: "Welcome", rd: "wasd/therapy — тихое место, чтобы замедлиться. Без рекламы, регистрации и спешки.", ed: "wasd/therapy is a quiet place to slow down. No ads, no signup, no rush." },
    { icon: "🎧", ru: "Надень наушники", en: "Headphones on", rd: "Звук генерируется вживую и никогда не повторяется. Так эффект сильнее.", ed: "Sound is generated live and never repeats. The effect is stronger this way." },
    { icon: "☰", ru: "Меню и поиск", en: "Menu & search", rd: "Нажми ☰ вверху (или ⌘K / Ctrl+K), чтобы найти и открыть любую практику — и закрепить любимые звёздочкой ★.", ed: "Tap ☰ at the top (or ⌘K / Ctrl+K) to find and open any practice — and pin favourites with a star ★." },
  ];
  if (!open) return null;
  const close = () => { try { localStorage.setItem(KEY, "1"); } catch {} setOpen(false); };
  const s = slides[i];
  const last = i === slides.length - 1;
  return (
    <div className="onb" role="dialog" aria-modal>
      <div className="onb-card">
        <div className="onb-ic">{s.icon}</div>
        <h2>{t(s.ru, s.en)}</h2>
        <p>{t(s.rd, s.ed)}</p>
        <div className="onb-dots">{slides.map((_, k) => <i key={k} className={k === i ? "on" : ""} />)}</div>
        <div className="onb-row">
          <button className="onb-skip" onClick={close}>{t("Пропустить", "Skip")}</button>
          <button className="btn" onClick={() => (last ? close() : setI(i + 1))}>{last ? t("Начать", "Start") : t("Дальше", "Next")}</button>
        </div>
      </div>
    </div>
  );
}
