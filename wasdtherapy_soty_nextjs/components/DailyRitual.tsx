"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

const TOTAL = 60;

const pday = (n: number) => {
  const m = n % 10, h = n % 100;
  if (m === 1 && h !== 11) return "день";
  if (m >= 2 && m <= 4 && (h < 10 || h >= 20)) return "дня";
  return "дней";
};

export default function DailyRitual() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const streak = useStore((s) => s.streak);
  const bestStreak = useStore((s) => s.bestStreak);
  const totalDays = useStore((s) => s.totalDays);
  const ritualDoneDay = useStore((s) => s.ritualDoneDay);
  const completeRitual = useStore((s) => s.completeRitual);
  const addMindful = useStore((s) => s.addMindful);
  const mindfulSeconds = useStore((s) => s.mindfulSeconds);
  const hydrated = useStore((s) => s.hydrated);

  const [today, setToday] = useState("");
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(TOTAL);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [justDone, setJustDone] = useState(false);
  const tick = useRef<number | null>(null);
  const breath = useRef<number | null>(null);

  useEffect(() => { setToday(new Date().toLocaleDateString("en-CA")); }, []);

  const clearAll = () => {
    if (tick.current) { clearInterval(tick.current); tick.current = null; }
    if (breath.current) { clearInterval(breath.current); breath.current = null; }
  };

  useEffect(() => {
    if (!running) return;
    setPhase("in");
    breath.current = window.setInterval(() => setPhase((p) => (p === "in" ? "out" : "in")), 5000);
    tick.current = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearAll();
          setRunning(false);
          addMindful(TOTAL);
          completeRitual();
          setJustDone(true);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return clearAll;
  }, [running]);

  const doneToday = hydrated && today !== "" && ritualDoneDay === today;
  const done = doneToday || justDone;
  const start = () => { setLeft(TOTAL); setJustDone(false); setRunning(true); };
  const stop = () => { clearAll(); setRunning(false); setLeft(TOTAL); };

  const mins = Math.floor(mindfulSeconds / 60);
  const scale = running ? (phase === "in" ? 1 : 0.62) : 0.82;
  const phaseLabel = phase === "in" ? t("Вдох", "Inhale") : t("Выдох", "Exhale");

  const doneMsg = streak > 1
    ? t(`${streak} ${pday(streak)} подряд. Возвращайся завтра, чтобы не потерять серию.`, `${streak} days in a row. Come back tomorrow to keep the streak.`)
    : t("Первый день готов. Вернись завтра — и серия начнёт расти.", "First day done. Come back tomorrow and your streak will grow.");

  return (
    <section className="ritual">
      <div className="ritual-inner">
        <div className="ritual-copy">
          <div className="eyebrow">{t("ритуал дня", "daily ritual")}</div>
          {done ? (
            <>
              <h2>{t("Готово на сегодня", "Done for today")} ✓</h2>
              <p>{doneMsg}</p>
            </>
          ) : (
            <>
              <h2>{streak > 0 ? t("Продолжи свою серию", "Keep your streak") : t("Одна минута тишины", "One minute of quiet")}</h2>
              <p>{t("Подыши вместе с кольцом одну минуту. Каждый день — маленький вклад в спокойствие.", "Breathe with the ring for one minute. Every day is a small deposit of calm.")}</p>
            </>
          )}
          <div className="ritual-stats">
            <div><b>🔥 {streak}</b><span>{t("серия", "streak")}</span></div>
            <div><b>{bestStreak}</b><span>{t("рекорд", "best")}</span></div>
            <div><b>{totalDays}</b><span>{t("дней", "days")}</span></div>
            <div><b>{mins}</b><span>{t("минут", "minutes")}</span></div>
          </div>
        </div>
        <div className="ritual-ring-wrap">
          <div className={running ? "ritual-ring live" : "ritual-ring"} style={{ transform: `scale(${scale})` }} />
          <div className="ritual-center">
            {running ? (
              <>
                <span className="rr-phase">{phaseLabel}</span>
                <span className="rr-left">{left}s</span>
              </>
            ) : done ? (
              <span className="rr-check">✓</span>
            ) : (
              <button className="btn rr-start" onClick={start}>{t("Начать минуту", "Start a minute")}</button>
            )}
          </div>
          {running && <button className="btn-ghost rr-stop" onClick={stop}>{t("Остановить", "Stop")}</button>}
        </div>
      </div>
    </section>
  );
}
