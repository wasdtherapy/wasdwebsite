"use client";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";

const KEY = "wt_mood_v1";
type Entry = { date: string; mood: number; note: string };
const MOODS = [
  { v: 1, ic: "😞", ru: "Тяжело", en: "Rough" },
  { v: 2, ic: "😕", ru: "Так себе", en: "Meh" },
  { v: 3, ic: "😐", ru: "Нормально", en: "Okay" },
  { v: 4, ic: "🙂", ru: "Хорошо", en: "Good" },
  { v: 5, ic: "😌", ru: "Спокойно", en: "Calm" },
];
const today = () => new Date().toISOString().slice(0, 10);

function streak(entries: Entry[]) {
  const days = new Set(entries.map((e) => e.date));
  let n = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) { n++; d.setDate(d.getDate() - 1); } else break;
  }
  return n;
}

function MoodChart({ entries, lang }: { entries: Entry[]; lang: string }) {
  // last 14 days, chronological
  const days: { date: string; mood: number | null }[] = [];
  const map = new Map(entries.map((e) => [e.date, e.mood]));
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, mood: map.has(key) ? (map.get(key) as number) : null });
  }
  const pts = days.map((d, i) => ({ ...d, x: 18 + (444 / 13) * i }));
  const y = (m: number) => 96 - ((m - 1) / 4) * 76;
  const real = pts.filter((p) => p.mood != null);
  if (real.length < 2) {
    return <div className="sub mood-empty">{lang === "ru" ? "Отметь настроение пару дней — и здесь появится график динамики." : "Log your mood for a couple of days — a trend chart will appear here."}</div>;
  }
  const line = real.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${y(p.mood as number).toFixed(1)}`).join(" ");
  const avg = (real.reduce((a, p) => a + (p.mood as number), 0) / real.length);
  return (
    <div className="mood-chart">
      <svg viewBox="0 0 480 120" preserveAspectRatio="none" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((m) => (
          <line key={m} x1="18" x2="462" y1={y(m)} y2={y(m)} className="mc-grid" />
        ))}
        <path d={line} className="mc-line" />
        {real.map((p, i) => (
          <circle key={i} cx={p.x} cy={y(p.mood as number)} r="3.6" className="mc-dot" />
        ))}
      </svg>
      <div className="mc-cap">{lang === "ru" ? "Среднее за 14 дней" : "14-day average"}: <b>{avg.toFixed(1)}</b> / 5</div>
    </div>
  );
}

export default function Mood() {
  const lang = useStore((s) => s.lang);
  const mindful = useStore((s) => s.mindfulSeconds);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [mood, setMood] = useState(0);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setEntries(JSON.parse(raw)); } catch {}
  }, []);
  const persist = (next: Entry[]) => { setEntries(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {} };
  const save = () => {
    if (!mood) return;
    const rest = entries.filter((e) => e.date !== today());
    const next = [{ date: today(), mood, note: note.trim() }, ...rest].slice(0, 60);
    persist(next); setSaved(true); setNote("");
    setTimeout(() => setSaved(false), 1800);
  };
  const del = (date: string) => persist(entries.filter((e) => e.date !== date));

  const st = streak(entries);
  const mins = Math.round(mindful / 60);
  const chart = useMemo(() => <MoodChart entries={entries} lang={lang} />, [entries, lang]);
  return (
    <section className="tool">
      <h1>{t("Настроение", "Mood")}</h1>
      <p className="sub">{t("Отметь, как ты сейчас. Без оценок и давления — просто мягкий след твоего пути.", "Note how you feel right now. No pressure charts — just a gentle trace of your path.")}</p>
      <div className="stat-row">
        <div className="stat"><b>{st}</b><span>{t("дней подряд", "day streak")}</span></div>
        <div className="stat"><b>{mins}</b><span>{t("минут тишины", "calm minutes")}</span></div>
        <div className="stat"><b>{entries.length}</b><span>{t("всего отметок", "check-ins")}</span></div>
      </div>

      {chart}

      <div className="mood-row">
        {MOODS.map((m) => (
          <button key={m.v} className={mood === m.v ? "mood-b on" : "mood-b"} onClick={() => setMood(m.v)} aria-label={t(m.ru, m.en)}>
            <span className="mood-ic">{m.ic}</span>
            <span className="mood-l">{t(m.ru, m.en)}</span>
          </button>
        ))}
      </div>
      <textarea className="j-input" rows={2} placeholder={t("Пара слов о дне (необязательно)…", "A couple words about today (optional)…")} value={note} onChange={(e) => setNote(e.target.value)} />
      <button className="btn" onClick={save}>{saved ? t("Сохранено ✓", "Saved ✓") : t("Отметить день", "Log today")}</button>
      <div className="j-list">
        {entries.map((e) => {
          const m = MOODS.find((x) => x.v === e.mood);
          return (
            <div key={e.date} className="j-entry">
              <button className="j-del" onClick={() => del(e.date)} aria-label="delete">×</button>
              <div className="j-date">{e.date} · {m?.ic} {t(m?.ru ?? "", m?.en ?? "")}</div>
              {e.note && <div className="j-text">{e.note}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
