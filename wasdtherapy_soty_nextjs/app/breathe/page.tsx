"use client";
import { useEffect, useMemo, useState } from "react";
import BreathRing, { Phase } from "@/components/BreathRing";
import Illustration from "@/components/Illustration";
import { useStore } from "@/lib/store";

const KEY = "wt_breath_v1";

type Tech = {
  id: string;
  ru: string; en: string;
  dr: string; de: string; // good for
  wy: string; we: string; // how it works
  wn: string; wne: string; // when
  custom?: boolean;
  phases: Phase[];
};

const BUILTIN: Tech[] = [
  { id: "478", ru: "4-7-8", en: "4-7-8",
    dr: "Сон и тревога", de: "Sleep & anxiety",
    wy: "Длинный выдох включает парасимпатику — пульс замедляется, тело переходит в режим отдыха.",
    we: "The long exhale activates the parasympathetic system — heart rate slows and the body shifts into rest mode.",
    wn: "Перед сном или в момент сильного волнения. Лёжа — 6–8 циклов.",
    wne: "Before sleep or during strong anxiety. Lying down — 6–8 cycles.",
    phases: [ { ru: "вдох", en: "inhale", dur: 4, scale: 1 }, { ru: "задержка", en: "hold", dur: 7, scale: 1 }, { ru: "выдох", en: "exhale", dur: 8, scale: 0.7 } ] },
  { id: "box", ru: "Бокс 4-4-4-4", en: "Box 4-4-4-4",
    dr: "Фокус и контроль", de: "Focus & control",
    wy: "Равные фазы выравнивают дыхание и возвращают ощущение контроля — приём спортсменов и пилотов.",
    we: "Equal phases even out the breath and restore a sense of control — used by athletes and pilots.",
    wn: "Перед задачей, экзаменом или сложным разговором.",
    wne: "Before a task, an exam or a hard conversation.",
    phases: [ { ru: "вдох", en: "inhale", dur: 4, scale: 1 }, { ru: "задержка", en: "hold", dur: 4, scale: 1 }, { ru: "выдох", en: "exhale", dur: 4, scale: 0.7 }, { ru: "пауза", en: "hold", dur: 4, scale: 0.7 } ] },
  { id: "coherent", ru: "Когерентное 5-5", en: "Coherent 5-5",
    dr: "Баланс нервной системы", de: "Nervous system balance",
    wy: "≈6 дыханий в минуту синхронизируют сердце и дыхание — состояние сердечной когерентности.",
    we: "≈6 breaths per minute sync heart and breath — a state of heart coherence.",
    wn: "Каждый день по 5 минут как базовая практика.",
    wne: "Daily, 5 minutes, as a baseline practice.",
    phases: [ { ru: "вдох", en: "inhale", dur: 5, scale: 1 }, { ru: "выдох", en: "exhale", dur: 5, scale: 0.7 } ] },
  { id: "calm", ru: "Успокоение 4-2-6", en: "Calming 4-2-6",
    dr: "Снять стресс", de: "Relieve stress",
    wy: "Короткая задержка и удлинённый выдох быстро гасят волну стресса.",
    we: "A short hold and a longer exhale quickly defuse a spike of stress.",
    wn: "Когда накрывает прямо сейчас и надо успокоиться за минуту.",
    wne: "When it hits right now and you need to settle within a minute.",
    phases: [ { ru: "вдох", en: "inhale", dur: 4, scale: 1 }, { ru: "задержка", en: "hold", dur: 2, scale: 1 }, { ru: "выдох", en: "exhale", dur: 6, scale: 0.7 } ] },
  { id: "relax", ru: "Релакс 4-4-8", en: "Relax 4-4-8",
    dr: "Глубокое расслабление", de: "Deep relaxation",
    wy: "Удвоенный выдох максимально активирует расслабление — мышцы отпускает.",
    we: "A doubled exhale maximizes relaxation — your muscles let go.",
    wn: "Вечером, после нагрузки, чтобы разгрузить тело.",
    wne: "In the evening, after strain, to unload the body.",
    phases: [ { ru: "вдох", en: "inhale", dur: 4, scale: 1 }, { ru: "задержка", en: "hold", dur: 4, scale: 1 }, { ru: "выдох", en: "exhale", dur: 8, scale: 0.7 } ] },
  { id: "energy", ru: "Энергия 6-2", en: "Energy 6-2",
    dr: "Бодрость утром", de: "Morning energy",
    wy: "Длинный вдох и короткий выдох мягко тонизируют без кофеина.",
    we: "A long inhale and a short exhale gently energize without caffeine.",
    wn: "Утром или в дневной спад, вместо лишней чашки кофе.",
    wne: "In the morning or an afternoon dip, instead of another coffee.",
    phases: [ { ru: "вдох", en: "inhale", dur: 6, scale: 1 }, { ru: "выдох", en: "exhale", dur: 2, scale: 0.7 } ] },
];

function instr(ru: string): [string, string] {
  const m: Record<string, [string, string]> = {
    "вдох": ["Медленно вдыхай через нос", "Slowly inhale through the nose"],
    "задержка": ["Задержи дыхание", "Hold your breath"],
    "выдох": ["Плавно выдыхай через рот", "Gently exhale through the mouth"],
    "пауза": ["Пауза — задержи пустоту", "Pause — stay empty"],
  };
  return m[ru] || ["Дыши", "Breathe"];
}

function buildPhases(f: { inhale: number; hold: number; exhale: number; pause: number }): Phase[] {
  const ph: Phase[] = [{ ru: "вдох", en: "inhale", dur: f.inhale, scale: 1 }];
  if (f.hold > 0) ph.push({ ru: "задержка", en: "hold", dur: f.hold, scale: 1 });
  ph.push({ ru: "выдох", en: "exhale", dur: f.exhale, scale: 0.7 });
  if (f.pause > 0) ph.push({ ru: "пауза", en: "hold", dur: f.pause, scale: 0.7 });
  return ph;
}

export default function Breathe() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [custom, setCustom] = useState<Tech[]>([]);
  const [ti, setTi] = useState(0);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [gi, setGi] = useState(0);
  const [form, setForm] = useState({ name: "", inhale: 4, hold: 4, exhale: 6, pause: 0 });

  const techs = useMemo(() => [...BUILTIN, ...custom], [custom]);
  const tech = techs[Math.min(ti, techs.length - 1)];
  const setShare = useStore((s) => s.setShare);
  const shareSession = () => {
    const secPerCycle = tech.phases.reduce((a, p) => a + p.dur, 0);
    const mins = Math.max(1, Math.round((secPerCycle * cycles) / 60));
    setShare({ minutes: mins, label: t("минут осознанного дыхания", "minutes of mindful breathing") });
  };

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setCustom(JSON.parse(raw)); } catch {}
  }, []);
  useEffect(() => { setRunning(false); setCycles(0); }, [ti]);

  const steps = useMemo(() => {
    const intro = { ru: "Сядь удобно, расслабь плечи и челюсть.", en: "Sit comfortably, relax your shoulders and jaw.", dur: 4 };
    const ps = tech.phases.map((p) => { const [r, e] = instr(p.ru); return { ru: `${r} — ${p.dur} сек`, en: `${e} — ${p.dur}s`, dur: p.dur }; });
    const outro = { ru: "Это один полный цикл. Повтори 4–8 раз и наблюдай за телом.", en: "That's one full cycle. Repeat 4–8 times and watch your body.", dur: 5 };
    return [intro, ...ps, outro];
  }, [tech]);

  useEffect(() => {
    if (!showGuide) return;
    if (gi >= steps.length - 1) return;
    const id = setTimeout(() => setGi((g) => g + 1), steps[gi].dur * 1000);
    return () => clearTimeout(id);
  }, [showGuide, gi, steps]);

  const openGuide = () => { setGi(0); setShowGuide(true); };
  const persist = (next: Tech[]) => { setCustom(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {} };
  const saveCustom = () => {
    const f = { inhale: Math.max(1, form.inhale), hold: Math.max(0, form.hold), exhale: Math.max(1, form.exhale), pause: Math.max(0, form.pause) };
    const name = form.name.trim() || t("Моя методика", "My method");
    const techNew: Tech = {
      id: "c" + Date.now(), ru: name, en: name, custom: true,
      dr: "Своя методика", de: "Custom method",
      wy: `Ритм ${f.inhale}-${f.hold}-${f.exhale}${f.pause ? "-" + f.pause : ""}, настроенный под тебя.`,
      we: `A ${f.inhale}-${f.hold}-${f.exhale}${f.pause ? "-" + f.pause : ""} rhythm, tuned by you.`,
      wn: "Когда привычные техники не подходят и хочется своего ритма.",
      wne: "When the presets don't fit and you want your own rhythm.",
      phases: buildPhases(f),
    };
    const next = [...custom, techNew];
    persist(next);
    setTi(BUILTIN.length + next.length - 1);
    setShowBuilder(false);
    setForm({ name: "", inhale: 4, hold: 4, exhale: 6, pause: 0 });
  };
  const delCustom = () => {
    if (!tech.custom) return;
    persist(custom.filter((c) => c.id !== tech.id));
    setTi(0);
  };

  const Slider = ({ k, min, max, label }: { k: "inhale" | "hold" | "exhale" | "pause"; min: number; max: number; label: string }) => (
    <label className="bb-row">
      <span>{label}</span>
      <input type="range" min={min} max={max} value={form[k]} onChange={(e) => setForm((s) => ({ ...s, [k]: Number(e.target.value) }))} />
      <b>{form[k]}</b>
    </label>
  );

  const gs = steps[Math.min(gi, steps.length - 1)];
  return (
    <section className="tool">
      <h1>{t("Дыхание", "Breathe")}</h1>
      <p className="sub">{t("Выбери технику и следуй за кольцом: расширяется — вдох, сжимается — выдох.", "Pick a technique and follow the ring: it grows on the inhale, shrinks on the exhale.")}</p>
      <Illustration variant="waves" />
      <div className="seg">
        {techs.map((x, i) => (
          <button key={x.id} className={i === ti ? "chip on" : "chip"} onClick={() => setTi(i)}>{x.custom ? "✦ " : ""}{t(x.ru, x.en)}</button>
        ))}
        <button className="chip chip-add" onClick={() => setShowBuilder((v) => !v)}>{t("+ Своя", "+ Custom")}</button>
      </div>

      {showBuilder && (
        <div className="bb-card">
          <input className="j-input" placeholder={t("Название методики", "Method name")} value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <Slider k="inhale" min={1} max={10} label={t("Вдох", "Inhale")} />
          <Slider k="hold" min={0} max={10} label={t("Задержка", "Hold")} />
          <Slider k="exhale" min={1} max={12} label={t("Выдох", "Exhale")} />
          <Slider k="pause" min={0} max={10} label={t("Пауза", "Pause")} />
          <button className="btn" onClick={saveCustom}>{t("Сохранить методику", "Save method")}</button>
        </div>
      )}

      <BreathRing phases={tech.phases} running={running} onCycle={() => setCycles((c) => c + 1)} />
      <div className="controls">
        <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? t("Пауза", "Pause") : t("Начать", "Start")}</button>
        <button className="btn-ghost" onClick={() => { setRunning(false); setCycles(0); }}>{t("Сброс", "Reset")}</button>
        <button className="btn-ghost" onClick={openGuide}>{t("Как дышать?", "How to breathe?")}</button>
        {tech.custom && <button className="btn-ghost" onClick={delCustom}>{t("Удалить", "Delete")}</button>}
        {cycles > 0 && <button className="btn-ghost" onClick={shareSession}>{t("Поделиться ✦", "Share ✦")}</button>}
      </div>
      <p className="sub">{t("Циклов пройдено", "Cycles done")}: <b>{cycles}</b></p>

      <div className="note">
        <b>{t(tech.ru, tech.en)}</b><br />
        {t("Польза: ", "Good for: ")}{t(tech.dr, tech.de)}.<br />
        {t("Как работает: ", "How it works: ")}{t(tech.wy, tech.we)}<br />
        {t("Когда: ", "When: ")}{t(tech.wn, tech.wne)}
      </div>

      {showGuide && (
        <div className="qc-overlay">
          <button className="qc-close" onClick={() => setShowGuide(false)} aria-label="close">×</button>
          <div className="qc-hint">{t(tech.ru, tech.en)} · {t("следи за кольцом и текстом", "follow the ring and the text")}</div>
          <BreathRing phases={tech.phases} running={true} />
          <div className="guide-step">{t(gs.ru, gs.en)}</div>
          <div className="guide-dots">{steps.map((_, i) => <span key={i} className={i === gi ? "on" : ""} />)}</div>
          <button className="btn qc-done" onClick={() => { setShowGuide(false); setRunning(true); }}>{t("Начать дышать", "Start breathing")}</button>
        </div>
      )}
    </section>
  );
}
