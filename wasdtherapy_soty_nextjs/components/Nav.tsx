"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import PaletteSwitcher from "./PaletteSwitcher";

const LINKS = [
  { href: "/breathe", ru: "Дыхание", en: "Breathe" },
  { href: "/scenarios", ru: "Сценарии", en: "Scenarios" },
  { href: "/sounds", ru: "Звуки", en: "Sounds" },
  { href: "/focus", ru: "Фокус", en: "Focus" },
  { href: "/meditate", ru: "Медитация", en: "Meditate" },
  { href: "/sleep", ru: "Сон", en: "Sleep" },
  { href: "/asmr", ru: "АСМР", en: "ASMR" },
  { href: "/play", ru: "Игры", en: "Play" },
  { href: "/journal", ru: "Дневник", en: "Journal" },
  { href: "/mood", ru: "Настроение", en: "Mood" },
  { href: "/garden", ru: "Сад", en: "Garden" },
  { href: "/zen", ru: "Дзен", en: "Zen" },
  { href: "/affirmations", ru: "Аффирмации", en: "Affirmations" },
];

export default function Nav() {
  const lang = useStore((s) => s.lang);
  const toggleLang = useStore((s) => s.toggleLang);
  const pathname = usePathname();
  const [snd, setSnd] = useState(false);
  useEffect(() => {
    try { setSnd(localStorage.getItem("wt_uisound") === "1"); } catch {}
  }, []);
  const toggleSnd = () => {
    const v = !snd;
    setSnd(v);
    try { localStorage.setItem("wt_uisound", v ? "1" : "0"); } catch {}
  };
  return (
    <header className="nav">
      <Link href="/" className="brand">wasd<span>/</span>therapy</Link>
      <nav className="nav-links">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={pathname === l.href ? "on" : ""}>
            {lang === "ru" ? l.ru : l.en}
          </Link>
        ))}
      </nav>
      <div className="nav-right">
        <PaletteSwitcher />
        <button className={`lang-btn snd-btn ${snd ? "on" : ""}`} onClick={toggleSnd} aria-label="toggle interface sound" title={lang === "ru" ? "Звук интерфейса" : "Interface sound"}>♪</button>
        <button className="lang-btn" onClick={toggleLang} aria-label="toggle language">{lang.toUpperCase()}</button>
      </div>
    </header>
  );
}
