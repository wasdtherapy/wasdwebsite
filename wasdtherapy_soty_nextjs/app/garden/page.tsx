"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const LEVELS = [
  { min: 0, ru: "Семечко", en: "A seed" },
  { min: 5, ru: "Росток", en: "A sprout" },
  { min: 15, ru: "Первые листья", en: "First leaves" },
  { min: 30, ru: "Бутоны", en: "Buds" },
  { min: 60, ru: "Цветение", en: "In bloom" },
  { min: 120, ru: "Сад оживает", en: "A living garden" },
  { min: 240, ru: "Цветущий оазис", en: "A blooming oasis" },
  { min: 480, ru: "Сад покоя", en: "A garden of peace" },
];

function levelFor(min: number) {
  let i = 0;
  for (let k = 0; k < LEVELS.length; k++) if (min >= LEVELS[k].min) i = k;
  return i;
}

// deterministic pseudo-random so the garden is stable per plant index
function rnd(seed: number) { const x = Math.sin(seed * 99.13) * 43758.5453; return x - Math.floor(x); }

export default function Garden() {
  const lang = useStore((s) => s.lang);
  const mindful = useStore((s) => s.mindfulSeconds);
  const hydrated = useStore((s) => s.hydrated);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const mins = Math.floor(mindful / 60);
  const li = levelFor(mins);
  const lvl = LEVELS[li];
  const next = LEVELS[li + 1];
  const plants = Math.min(14, 1 + Math.floor(mins / 6));
  const bloomFrom = 30; // минут до цветков

  const prog = next ? Math.round(((mins - lvl.min) / (next.min - lvl.min)) * 100) : 100;

  return (
    <section className="tool">
      <h1>{t("Сад спокойствия", "Calm garden")}</h1>
      <p className="sub">{t("Каждая минута тишины растит твой сад. Без очков и гонки — просто живой след твоего покоя.", "Every calm minute grows your garden. No scores, no race — just a living trace of your peace.")}</p>

      <div className="garden-wrap">
        <svg viewBox="0 0 480 220" className="garden-svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <radialGradient id="g-glow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
              <stop offset="75%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="240" cy="120" rx="220" ry="120" fill="url(#g-glow)" />
          <path className="g-hill" d="M-20 196 Q 240 168 500 196 L 500 230 L -20 230 Z" />
          {mounted && Array.from({ length: plants }).map((_, i) => {
            const x = 40 + (400 / Math.max(1, plants)) * i + rnd(i) * 18;
            const h = 36 + rnd(i + 7) * 46 + Math.min(40, mins);
            const baseY = 196;
            const topY = baseY - h;
            const sway = 2 + rnd(i + 3) * 3;
            const bloom = mins >= bloomFrom && rnd(i + 11) > 0.25;
            const delay = (rnd(i + 5) * 2).toFixed(2);
            return (
              <g key={i} className="g-plant" style={{ transformOrigin: `${x}px ${baseY}px`, animationDelay: `${delay}s`, ['--sway' as any]: `${sway}deg` }}>
                <path d={`M${x} ${baseY} C ${x - 6} ${baseY - h * 0.5} ${x + 6} ${baseY - h * 0.7} ${x} ${topY}`} className="g-stem" />
                <path d={`M${x} ${baseY - h * 0.55} q -16 -6 -22 -20 q 16 2 22 12 Z`} className="g-leaf" />
                <path d={`M${x} ${baseY - h * 0.4} q 16 -6 22 -20 q -16 2 -22 12 Z`} className="g-leaf" />
                {bloom ? (
                  <g className="g-bloom" style={{ transformOrigin: `${x}px ${topY}px` }}>
                    {[0, 60, 120, 180, 240, 300].map((a) => (
                      <ellipse key={a} cx={x} cy={topY - 6} rx="4" ry="8" transform={`rotate(${a} ${x} ${topY})`} className="g-petal" />
                    ))}
                    <circle cx={x} cy={topY} r="3.4" className="g-core" />
                  </g>
                ) : (
                  <circle cx={x} cy={topY} r={mins >= 5 ? 3.2 : 2.2} className="g-bud" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="garden-stat">
        <div className="gs-level">{t(lvl.ru, lvl.en)}</div>
        <div className="gs-min"><b>{mounted ? mins : 0}</b> {t("минут тишины", "calm minutes")}</div>
        {next ? (
          <>
            <div className="gs-bar"><i style={{ width: `${Math.max(4, prog)}%` }} /></div>
            <div className="gs-next">{t("До следующей стадии", "To next stage")}: {Math.max(0, next.min - mins)} {t("мин", "min")}</div>
          </>
        ) : (
          <div className="gs-next">{t("Ты вырастил целый сад. Спасибо, что бережёшь себя.", "You've grown a whole garden. Thank you for caring for yourself.")}</div>
        )}
      </div>
      {!hydrated && <p className="sub">…</p>}
    </section>
  );
}
