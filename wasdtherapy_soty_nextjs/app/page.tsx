"use client";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import { useStore } from "@/lib/store";

const TOOLS = [
  { href: "/breathe", icon: "🫧", ru: "Дыхание", en: "Breathe", rd: "6 научных техник с живым кольцом-проводником.", ed: "6 science-backed techniques with a living guide ring." },
  { href: "/sounds", icon: "🌊", ru: "Звуки", en: "Sounds", rd: "Генеративный микшер на 12 слоёв природы.", ed: "A generative mixer of 12 nature layers." },
  { href: "/focus", icon: "🌑", ru: "Фокус", en: "Focus", rd: "Pomodoro с эмбиентом и паузами на дыхание.", ed: "Pomodoro with ambient and breathing breaks." },
  { href: "/meditate", icon: "🧘", ru: "Медитация", en: "Meditate", rd: "Гайдовые сессии 3 / 5 / 10 / 15 / 20 минут.", ed: "Guided 3 / 5 / 10 / 15 / 20 minute sessions." },
  { href: "/sleep", icon: "🌙", ru: "Сон", en: "Sleep", rd: "Таймер сна, который сам плавно затихнет.", ed: "A sleep timer that fades itself out." },
  { href: "/journal", icon: "📖", ru: "Дневник", en: "Journal", rd: "Дневник благодарности — приватно в браузере.", ed: "A gratitude journal — private in your browser." },
  { href: "/zen", icon: "🪨", ru: "Дзен-сад", en: "Zen garden", rd: "Рисуй узоры на песке и расставляй камни.", ed: "Rake patterns in sand and place stones." },
  { href: "/affirmations", icon: "✨", ru: "Аффирмации", en: "Affirmations", rd: "Тёплые слова, которые хочется сохранить.", ed: "Warm words worth keeping." },
  { href: "/about", icon: "○", ru: "О проекте", en: "About", rd: "Философия спокойствия и как пользоваться.", ed: "The calm philosophy and how to use it." },
];

const STEPS = [
  { ru: "Выбери практику", en: "Pick a practice", rd: "Дыхание, звуки, фокус или медитация — смотря по настроению.", ed: "Breath, sound, focus or meditation — follow your mood." },
  { ru: "Надень наушники", en: "Put on headphones", rd: "Звук генерируется в реальном времени и никогда не повторяется.", ed: "Audio is generated live and never loops the same." },
  { ru: "Отпусти", en: "Let go", rd: "Никаких регистраций, рекламы и уведомлений. Только ты и покой.", ed: "No signup, ads or notifications. Just you and calm." },
];

export default function Home() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  return (
    <>
      <section className="hero">
        <div className="eyebrow">{t("спокойствие по требованию", "calm on demand")}</div>
        <h1>wasd/therapy</h1>
        <p className="lead">{t("Бесплатное пространство, чтобы замедлиться, подышать и вернуть себе тишину. Без рекламы, без регистрации, без спешки.", "A free space to slow down, breathe and reclaim your quiet. No ads, no signup, no rush.")}</p>
        <div className="cta">
          <Magnetic><Link href="/breathe" className="btn">{t("Начать дышать", "Start breathing")}</Link></Magnetic>
          <Magnetic><Link href="/sounds" className="btn-ghost">{t("Включить звуки", "Open sounds")}</Link></Magnetic>
        </div>
        <div className="scroll-hint">{t("ЛИСТАЙ ВНИЗ", "SCROLL")}</div>
      </section>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <div className="eyebrow">{t("инструменты", "toolkit")}</div>
            <h2>{t("Девять способов выдохнуть", "Nine ways to exhale")}</h2>
            <p>{t("Каждый раздел — законченная практика, а не картинка.", "Each section is a finished practice, not a placeholder.")}</p>
          </div>
        </Reveal>
        <div className="grid">
          {TOOLS.map((it, i) => (
            <Reveal key={it.href} delay={i * 0.05}>
              <Link href={it.href} className="card">
                <div className="ic">{it.icon}</div>
                <h3>{t(it.ru, it.en)}</h3>
                <p>{t(it.rd, it.ed)}</p>
                <span className="go">{t("открыть →", "open →")}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <div className="eyebrow">{t("как это работает", "how it works")}</div>
            <h2>{t("Три шага к тишине", "Three steps to quiet")}</h2>
          </div>
        </Reveal>
        <div className="steps">
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="step">
                <h4>{t(s.ru, s.en)}</h4>
                <p>{t(s.rd, s.ed)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal>
          <p className="manifesto">{t("Мы верим, что технологии могут успокаивать, а не красть внимание. ", "We believe technology can calm you, not steal your attention. ")}<span>{t("wasd/therapy — это маленькое начало большого спокойствия.", "wasd/therapy is a small beginning of something calmer.")}</span></p>
        </Reveal>
        <footer className="foot">
          <p>{t("Сделано с заботой. Бесплатно навсегда.", "Made with care. Free forever.")}</p>
          <p>wasd/therapy · 2026</p>
        </footer>
      </section>
    </>
  );
}
