"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, Palette } from "@/lib/store";

type Item = { id: string; ru: string; en: string; hint?: string; run: () => void };

export default function CommandPalette() {
  const router = useRouter();
  const lang = useStore((s) => s.lang);
  const toggleLang = useStore((s) => s.toggleLang);
  const setPalette = useStore((s) => s.setPalette);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(() => {
    const go = (href: string) => () => { setOpen(false); router.push(href); };
    const pal = (p: Palette) => () => { setPalette(p); };
    return [
      { id: "breathe", ru: "Дыхание", en: "Breathe", run: go("/breathe") },
      { id: "sounds", ru: "Звуки", en: "Sounds", run: go("/sounds") },
      { id: "focus", ru: "Фокус", en: "Focus", run: go("/focus") },
      { id: "meditate", ru: "Медитация", en: "Meditate", run: go("/meditate") },
      { id: "sleep", ru: "Сон", en: "Sleep", run: go("/sleep") },
      { id: "asmr", ru: "АСМР", en: "ASMR", run: go("/asmr") },
      { id: "play", ru: "Игры", en: "Play", run: go("/play") },
      { id: "journal", ru: "Дневник", en: "Journal", run: go("/journal") },
      { id: "mood", ru: "Настроение", en: "Mood", run: go("/mood") },
      { id: "zen", ru: "Дзен-сад", en: "Zen garden", run: go("/zen") },
      { id: "affirmations", ru: "Аффирмации", en: "Affirmations", run: go("/affirmations") },
      { id: "about", ru: "О проекте", en: "About", run: go("/about") },
      { id: "home", ru: "На главную", en: "Home", run: go("/") },
      { id: "lang", ru: "Сменить язык", en: "Switch language", hint: "RU / EN", run: () => toggleLang() },
      { id: "p-aurora", ru: "Тема: Аврора", en: "Theme: Aurora", hint: "palette", run: pal("aurora") },
      { id: "p-nebula", ru: "Тема: Туманность", en: "Theme: Nebula", hint: "palette", run: pal("nebula") },
      { id: "p-abyss", ru: "Тема: Бездна", en: "Theme: Abyss", hint: "palette", run: pal("abyss") },
      { id: "p-ember", ru: "Тема: Угли", en: "Theme: Ember", hint: "palette", run: pal("ember") },
      { id: "p-bio", ru: "Тема: Био", en: "Theme: Bio", hint: "palette", run: pal("bio") },
    ];
  }, [router, setPalette, toggleLang]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => (it.ru + " " + it.en + " " + it.id).toLowerCase().includes(s));
  }, [q, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  useEffect(() => { setSel(0); }, [q]);

  if (!open) return null;

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); filtered[sel]?.run(); }
  };

  return (
    <div className="cmd" onClick={() => setOpen(false)}>
      <div className="cmd-box" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmd-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onInputKey}
          placeholder={t("Куда пойдём? Тема, язык, практика…", "Where to? Theme, language, practice…")}
        />
        <div className="cmd-list">
          {filtered.length === 0 && <div className="cmd-empty">{t("Ничего не найдено", "Nothing found")}</div>}
          {filtered.map((it, k) => (
            <button
              key={it.id}
              className={k === sel ? "cmd-item on" : "cmd-item"}
              onMouseEnter={() => setSel(k)}
              onClick={() => it.run()}
            >
              <span>{t(it.ru, it.en)}</span>
              {it.hint && <span className="cmd-hint">{it.hint}</span>}
            </button>
          ))}
        </div>
        <div className="cmd-foot">{t("↑↓ выбор · Enter открыть · Esc закрыть", "↑↓ to move · Enter to open · Esc to close")}</div>
      </div>
    </div>
  );
}
