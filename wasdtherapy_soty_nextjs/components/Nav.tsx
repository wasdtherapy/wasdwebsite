"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";

const LINKS = [
  { href: "/breathe", ru: "Дыхание", en: "Breathe" },
  { href: "/sounds", ru: "Звуки", en: "Sounds" },
  { href: "/focus", ru: "Фокус", en: "Focus" },
];

export default function Nav() {
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  return (
    <header className="nav">
      <Link href="/" className="brand">wasd<span>/</span>therapy</Link>
      <nav>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}>{lang === "ru" ? l.ru : l.en}</Link>
        ))}
      </nav>
      <button onClick={() => setLang(lang === "ru" ? "en" : "ru")} aria-label="toggle language">
        {lang.toUpperCase()}
      </button>
    </header>
  );
}
