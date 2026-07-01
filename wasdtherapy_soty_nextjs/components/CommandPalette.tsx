"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

type Item = { ru: string; en: string; run: () => void };

export default function CommandPalette() {
  const router = useRouter();
  const lang = useStore((s) => s.lang);
  const setPalette = useStore((s) => s.setPalette);
  const toggleLang = useStore((s) => s.toggleLang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(() => [
    { ru: "Главная", en: "Home", run: () => router.push("/") },
    { ru: "Дыхание", en: "Breathe", run: () => router.push("/breathe") },
    { ru: "Звуки", en: "Sounds", run: () => router.push("/sounds") },
    { ru: "Фокус", en: "Focus", run: () => router.push("/focus") },
    { ru: "Медитация", en: "Meditate", run: () => router.push("/meditate") },
    { ru: "Сон", en: "Sleep", run: () => router.push("/sleep") },
    { ru: "АСМР", en: "ASMR", run: () => router.push("/asmr") },
    { ru: "Игры", en: "Play", run: () => router.push("/play") },
    { ru: "Дневник", en: "Journal", run: () => router.push("/journal") },
    { ru: "Настроение", en: "Mood", run: () => router.push("/mood") },
    { ru: "Дзен-сад", en: "Zen garden", run: () => router.push("/zen") },
    { ru: "Аффирмации", en: "Affirmations", run: () => router.push("/affirmations") },
    { ru: "О проекте", en: "About", run: () => router.push("/about") },
    { ru: "Сменить язык", en: "Toggle language", run: () => toggleLang() },
    { ru: "Палитра: Аврора", en: "Palette: Aurora", run: () => setPalette("aurora") },
    { ru: "Палитра: Небула", en: "Palette: Nebula", run: () => setPalette("nebula") },
    { ru: "Палитра: Бездна", en: "Palette: Abyss", run: () => setPalette("abyss") },
    { ru: "Палитра: Уголь", en: "Palette: Ember", run: () => setPalette("ember") },
    { ru: "Палитра: Био", en: "Palette: Bio", run: () => setPalette("bio") },
  ], [router, setPalette, toggleLang]);

  const filtered = items.filter((it) => (it.ru + " " + it.en).toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { if (open) { setQ(""); setActive(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);

  if (!open) return null;
  const choose = (it: Item) => { it.run(); setOpen(false); };
  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[active]) choose(filtered[active]); }
  };
  return (
    <div className="cmd" onPointerDown={() => setOpen(false)}>
      <div className="cmd-box" onPointerDown={(e) => e.stopPropagation()}>
        <input ref={inputRef} className="cmd-input" placeholder={t("Куда отправимся? Напиши…", "Where to? Type…")} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onInputKey} />
        <div className="cmd-list">
          {filtered.length === 0 && <div className="cmd-empty">{t("Ничего не найдено", "Nothing found")}</div>}
          {filtered.map((it, k) => (
            <button key={k} className={k === active ? "cmd-item on" : "cmd-item"} onPointerEnter={() => setActive(k)} onClick={() => choose(it)}>
              {t(it.ru, it.en)}
            </button>
          ))}
        </div>
        <div className="cmd-foot">{t("↑↓ выбрать · Enter открыть · Esc закрыть", "↑↓ to move · Enter to open · Esc to close")}</div>
      </div>
    </div>
  );
}
