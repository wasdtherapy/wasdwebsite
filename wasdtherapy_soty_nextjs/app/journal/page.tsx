"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import Illustration from "@/components/Illustration";

type Entry = { id: number; text: string; date: string };
const KEY = "wt_journal_v1";
const PROMPTS_RU = ["За что ты благодарен сегодня?", "Что сегодня заставило тебя улыбнуться?", "Какой маленький момент стоит запомнить?"];
const PROMPTS_EN = ["What are you grateful for today?", "What made you smile today?", "What small moment is worth keeping?"];

export default function Journal() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setEntries(JSON.parse(raw)); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) { try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch {} }
  }, [entries, loaded]);

  const add = () => {
    const v = text.trim();
    if (!v) return;
    const e: Entry = { id: Date.now(), text: v, date: new Date().toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "long" }) };
    setEntries((p) => [e, ...p]);
    setText("");
  };
  const remove = (id: number) => setEntries((p) => p.filter((e) => e.id !== id));
  const pi = entries.length % 3;

  return (
    <section className="tool">
      <h1>{t("Дневник благодарности", "Gratitude journal")}</h1>
      <p className="sub">{t("Запиши пару строк о хорошем. Всё хранится только в твоём браузере — приватно и без аккаунтов.", "Write a few lines about the good. Everything stays in your browser — private, no accounts.")}</p>
      <Illustration variant="sparkles" />
      <div className="journal">
        <div className="j-prompt">{t(PROMPTS_RU[pi], PROMPTS_EN[pi])}</div>
        <textarea className="j-input" value={text} onChange={(e) => setText(e.target.value)} placeholder={t("Сегодня я благодарен за…", "Today I am grateful for…")} rows={3} />
        <div className="controls">
          <button className="btn" onClick={add}>{t("Сохранить", "Save")}</button>
        </div>
        <div className="j-list">
          {entries.length === 0 && <div className="note">{t("Пока пусто. Первая запись — самая важная.", "Empty for now. The first note matters most.")}</div>}
          {entries.map((e) => (
            <div key={e.id} className="j-entry">
              <div className="j-date">{e.date}</div>
              <div className="j-text">{e.text}</div>
              <button className="j-del" onClick={() => remove(e.id)} aria-label="delete">×</button>
            </div>
          ))}
        </div>
      </div>
      <div className="note">{t("Привычка замечать хорошее снижает тревогу. Достаточно одной строки в день.", "Noticing the good lowers anxiety. One line a day is enough.")}</div>
    </section>
  );
}
