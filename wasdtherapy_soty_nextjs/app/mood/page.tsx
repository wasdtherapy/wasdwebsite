"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import Illustration from "@/components/Illustration";

type Entry = { date: string; mood: number; note: string };
const KEY = "wt_mood_v1";
const MOODS = [
  { v: 1, ic: "😞", ru: "Тяжело", en: "Rough" },
  { v: 2, ic: "😕", ru: "Так себе", en: "Meh" },
  { v: 3, ic: "😐", ru: "Нормально", en: "Okay" },
  { v: 4, ic: "🙂", ru: "Хорошо", en: "Good" },
  { v: 5, ic: "😌", ru: "Спокойно", en: "Calm" },
];

const iso = (d: Date) => d.toISOString().slice(0, 10);

function streak(entries: Entry[]): number {
  const days = new Set(entries.map((e) => e.date));
  let n = 0;
  const d = new Date();
  if (!days.has(iso(d))) { d.setDate(d.getDate() - 1); if (!days.has(iso(d))) return 0; }
  while (days.has(iso(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export default function Mood() {
  const lang = useStore((s) => s.lang);
  const mindful = useStore((s) => s.mindfulSeconds);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [note, setNote] = useState("");
  const [pick, setPick] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setEntries(JSON.parse(raw)); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) { try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch {} }
  }, [entries, loaded]);

  const save = () => {
    if (!pick) return;
    const today = iso(new Date());
    setEntries((p) => [{ date: today, mood: pick, note: note.trim() }, ...p.filter((e) => e.date !== today)]);
    setNote("");
    setPick(0);
  };
  const remove = (date: string) => setEntries((p) => p.filter((e) => e.date !== date));

  const st = streak(entries);
  const calmMin = Math.floor(mindful / 60);
  const fmtDate = (d: string) => {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "long" });
  };
  const moodIc = (v: number) => MOODS.find((m) => m.v === v)?.ic ?? "🙂";

  return (
    <section className="tool">
      <h1>{t("Настроение", "Mood")}</h1>
      <p className="sub">{t("Отмечай, как ты себя чувствуешь. Один тап в день — и ты видишь мягкие стрики и минуты тишины. Всё хранится только в браузере.", "Note how you feel. One tap a day reveals gentle streaks and calm minutes. Everything stays in your browser.")}</p>
      <Illustration variant="sunrise" />

      <div className="stat-row">
        <div className="stat"><b>{st}</b><span>{t(st === 1 ? "день подряд" : "дней подряд", "day streak")}</span></div>
        <div className="stat"><b>{calmMin}</b><span>{t("минут тишины", "calm minutes")}</span></div>
        <div className="stat"><b>{entries.length}</b><span>{t("всего отметок", "entries total")}</span></div>
      </div>

      <div className="mood-row">
        {MOODS.map((m) => (
          <button key={m.v} className={pick === m.v ? "mood-b on" : "mood-b"} onClick={() => setPick(m.v)}>
            <span className="mood-ic">{m.ic}</span>
            <span className="mood-l">{t(m.ru, m.en)}</span>
          </button>
        ))}
      </div>

      <textarea className="j-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("Пара слов о дне (по желанию)…", "A few words about your day (optional)…")} rows={2} />
      <div className="controls">
        <button className="btn" onClick={save} disabled={!pick}>{t("Отметить день", "Log today")}</button>
      </div>

      <div className="j-list">
        {entries.length === 0 && <div className="note">{t("Пока пусто. Отметь, как ты сегодня — это займёт секунду.", "Empty for now. Mark how you feel today — it takes a second.")}</div>}
        {entries.map((e) => (
          <div key={e.date} className="j-entry">
            <div className="j-date">{fmtDate(e.date)} · {moodIc(e.mood)}</div>
            {e.note && <div className="j-text">{e.note}</div>}
            <button className="j-del" onClick={() => remove(e.date)} aria-label="delete">×</button>
          </div>
        ))}
      </div>
      <div className="note">{t("Стрик не рвётся, если ты отметился вчера или сегодня. Это не давление, а мягкое напоминание возвращаться к себе.", "Your streak holds if you logged yesterday or today. Not pressure — a gentle nudge to return to yourself.")}</div>
    </section>
  );
}
