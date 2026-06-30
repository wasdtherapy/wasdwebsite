"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import PaletteSwitcher from "./PaletteSwitcher";

const LINKS = [
  { href: "/breathe", ru: "Дыхание", en: "Breathe" },
  { href: "/sounds", ru: "Звуки", en: "Sounds" },
  { href: "/focus", ru: "Фокус", en: "Focus" },
  { href: "/meditate", ru: "Медитация", en: "Meditate" },
  { href: "/affirmations", ru: "Аффирмации", en: "Affirmations" },
];

export default function Nav() {
  const lang = useStore((s) => s.lang);
  const toggleLang = useStore((s) => s.toggleLang);
  const pathname = usePathname();
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
        <button className="lang-btn" onClick={toggleLang} aria-label="toggle language">{lang.toUpperCase()}</button>
      </div>
    </header>
  );
}
