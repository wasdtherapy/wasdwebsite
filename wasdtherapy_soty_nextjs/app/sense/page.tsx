"use client";
import BreathCamera from "@/components/BreathCamera";
import { useStore } from "@/lib/store";

export default function Sense() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  return (
    <section className="section">
      <div className="eyebrow">{t("эксперимент", "experimental")}</div>
      <h1>{t("Сенсор дыхания", "Breath sensor")}</h1>
      <p className="dim">{t("Опционально. Камера остаётся в твоём браузере — ничего не отправляется и не сохраняется. Кольцо реагирует на движение груди и плеч.", "Optional. The camera stays in your browser — nothing is sent or stored. The ring reacts to chest and shoulder movement.")}</p>
      <BreathCamera />
    </section>
  );
}
