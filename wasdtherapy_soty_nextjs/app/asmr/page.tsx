"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { tap } from "@/lib/play";

const PADS = [
  { kind: "bell", icon: "🔔", ru: "Колокол", en: "Bell" },
  { kind: "pluck", icon: "🎸", ru: "Струна", en: "Pluck" },
  { kind: "wood", icon: "🪵", ru: "Дерево", en: "Wood" },
  { kind: "glass", icon: "🥃", ru: "Стекло", en: "Glass" },
  { kind: "bowl", icon: "🎐", ru: "Чаша", en: "Bowl" },
  { kind: "harp", icon: "🎵", ru: "Арфа", en: "Harp" },
  { kind: "chord", icon: "🌼", ru: "Аккорд", en: "Chord" },
  { kind: "drip", icon: "💧", ru: "Капля", en: "Drip" },
  { kind: "pluck", icon: "✨", ru: "Перелив", en: "Shimmer" },
];

function Pad({ kind, icon, label, i }: { kind: string; icon: string; label: string; i: number }) {
  const [hit, setHit] = useState(0);
  const press = () => { tap(kind, i * 2 + hit); setHit((h) => h + 1); };
  return (
    <button className="pad" onPointerDown={press} aria-label={label}>
      {hit > 0 && <span className="pad-glow" key={hit} />}
      <span className="pad-ic">{icon}</span>
      <span className="pad-name">{label}</span>
    </button>
  );
}

export default function Asmr() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  return (
    <section className="tool">
      <h1>{t("АСМР-панель", "ASMR pads")}</h1>
      <p className="sub">{t("Тыкай по плашкам — каждая отвечает мягким приятным звуком и переливом света. Залипай сколько хочешь.", "Tap the pads — each answers with a soft pleasant sound and a ripple of light. Linger as long as you like.")}</p>
      <div className="pads">
        {PADS.map((p, i) => (
          <Pad key={i} kind={p.kind} icon={p.icon} label={t(p.ru, p.en)} i={i} />
        ))}
      </div>
      <div className="note">{t("Надень наушники для эффекта мурашек. Звук генерируется вживую — двух одинаковых касаний не бывает.", "Put on headphones for the tingles. Sound is generated live — no two taps are ever the same.")}</div>
    </section>
  );
}
