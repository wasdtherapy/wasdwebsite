"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

type NavItem = { href: string; ru: string; en: string; icon: string };
const NAV: NavItem[] = [
  { href: "/", ru: "Главная", en: "Home", icon: "◇" },
  { href: "/breathe", ru: "Дыхание", en: "Breathe", icon: "🫧" },
  { href: "/guide", ru: "Гид", en: "Guide", icon: "🧭" },
  { href: "/sense", ru: "Сенсор", en: "Sense", icon: "🌬" },
  { href: "/scenarios", ru: "Сценарии", en: "Scenarios", icon: "🎬" },
  { href: "/sounds", ru: "Звуки", en: "Sounds", icon: "🌊" },
  { href: "/focus", ru: "Фокус", en: "Focus", icon: "🎯" },
  { href: "/meditate", ru: "Медитация", en: "Meditate", icon: "🧘" },
  { href: "/sleep", ru: "Сон", en: "Sleep", icon: "🌙" },
  { href: "/asmr", ru: "АСМР", en: "ASMR", icon: "🍃" },
  { href: "/play", ru: "Игры", en: "Play", icon: "🫧" },
  { href: "/journal", ru: "Дневник", en: "Journal", icon: "📓" },
  { href: "/mood", ru: "Настроение", en: "Mood", icon: "📈" },
  { href: "/garden", ru: "Сад", en: "Garden", icon: "🌱" },
  { href: "/zen", ru: "Дзен", en: "Zen", icon: "⛩" },
  { href: "/affirmations", ru: "Аффирмации", en: "Affirmations", icon: "✨" },
  { href: "/about", ru: "О проекте", en: "About", icon: "☺" },
];

type Cmd = { ru: string; en: string; icon: string; run: () => void };

export default function CommandPalette() {
  const router = useRouter();
  const lang = useStore((s) => s.lang);
  const setPalette = useStore((s) => s.setPalette);
  const toggleLang = useStore((s) => s.toggleLang);
  const open = useStore((s) => s.menuOpen);
  const setOpen = useStore((s) => s.setMenuOpen);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const cmds: Cmd[] = useMemo(() => [
    { ru: "Сменить язык", en: "Toggle language", icon: "🌐", run: () => toggleLang() },
    { ru: "Палитра: Аврора", en: "Palette: Aurora", icon: "🎨", run: () => setPalette("aurora") },
    { ru: "Палитра: Небула", en: "Palette: Nebula", icon: "🎨", run: () => setPalette("nebula") },
    { ru: "Палитра: Бездна", en: "Palette: Abyss", icon: "🎨", run: () => setPalette("abyss") },
    { ru: "Палитра: Уголь", en: "Palette: Ember", icon: "🎨", run: () => setPalette("ember") },
    { ru: "Палитра: Био", en: "Palette: Bio", icon: "🎨", run: () => setPalette("bio") },
  ], [setPalette, toggleLang]);

  const ql = q.trim().toLowerCase();
  const match = (a: string, b: string) => (a + " " + b).toLowerCase().includes(ql);
  const navMatched = NAV.filter((n) => match(n.ru, n.en));
  const pinned = navMatched.filter((n) => favorites.includes(n.href));
  const rest = navMatched.filter((n) => !favorites.includes(n.href));
  const cmdMatched = cmds.filter((c) => match(c.ru, c.en));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(!open); }
      else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);
  useEffect(() => { if (open) { setQ(""); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);

  if (!open) return null;

  const go = (href: string) => { router.push(href); setOpen(false); };
  const runCmd = (c: Cmd) => { c.run(); setOpen(false); };
  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = [...pinned, ...rest][0];
      if (first) go(first.href);
      else if (cmdMatched[0]) runCmd(cmdMatched[0]);
    }
  };

  const Row = (n: NavItem) => {
    const on = favorites.includes(n.href);
    return (
      <div key={n.href} className="cmd-row">
        <button className="cmd-go" onClick={() => go(n.href)}>
          <span className="cmd-ic">{n.icon}</span>{t(n.ru, n.en)}
        </button>
        <button className={on ? "cmd-star on" : "cmd-star"} onClick={() => toggleFavorite(n.href)} aria-label={on ? "unpin" : "pin"} title={on ? t("Открепить", "Unpin") : t("Закрепить", "Pin")}>{on ? "★" : "☆"}</button>
      </div>
    );
  };

  return (
    <div className="cmd" onPointerDown={() => setOpen(false)}>
      <div className="cmd-box" onPointerDown={(e) => e.stopPropagation()}>
        <input ref={inputRef} className="cmd-input" placeholder={t("Поиск раздела… напиши название", "Search a section… type a name")} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onInputKey} />
        <div className="cmd-list">
          {pinned.length > 0 && <div className="cmd-head">{t("Закреплённое", "Pinned")}</div>}
          {pinned.map(Row)}
          {rest.length > 0 && <div className="cmd-head">{t("Разделы", "Sections")}</div>}
          {rest.map(Row)}
          {cmdMatched.length > 0 && <div className="cmd-head">{t("Действия", "Actions")}</div>}
          {cmdMatched.map((c, k) => (
            <button key={"c" + k} className="cmd-go cmd-cmd" onClick={() => runCmd(c)}>
              <span className="cmd-ic">{c.icon}</span>{t(c.ru, c.en)}
            </button>
          ))}
          {navMatched.length === 0 && cmdMatched.length === 0 && <div className="cmd-empty">{t("Ничего не найдено", "Nothing found")}</div>}
        </div>
        <div className="cmd-foot">{t("Enter открыть · ☆ закрепить · Esc закрыть", "Enter to open · ☆ to pin · Esc to close")}</div>
      </div>
    </div>
  );
}
