"use client";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import Icon from "@/components/Icon";
import { useStore } from "@/lib/store";

const TOOLS = [
  { href: "/breathe", icon: "breathe", ru: "Дыхание", en: "Breathe", rd: "6 научных техник, своя методика и мини-гайды.", ed: "6 science techniques, your own method and mini-guides." },
  { href: "/scenarios", icon: "scenarios", ru: "Сценарии", en: "Scenarios", rd: "Готовые связки дыхание + звук + таймер.", ed: "Ready breath + sound + timer flows." },
  { href: "/sounds", icon: "sounds", ru: "Звуки", en: "Sounds", rd: "Генеративный микшер на 12 слоёв природы.", ed: "A generative mixer of 12 nature layers." },
  { href: "/focus", icon: "focus", ru: "Фокус", en: "Focus", rd: "Pomodoro с эмбиентом и паузами на дыхание.", ed: "Pomodoro with ambient and breathing breaks." },
  { href: "/meditate", icon: "meditate", ru: "Медитация", en: "Meditate", rd: "Гайдовые сессии 3 / 5 / 10 / 15 / 20 мин.", ed: "Guided 3 / 5 / 10 / 15 / 20 minute sessions." },
  { href: "/sleep", icon: "sleep", ru: "Сон", en: "Sleep", rd: "Таймер сна, который сам плавно затихает.", ed: "A sleep timer that fades itself out." },
  { href: "/mood", icon: "mood", ru: "Настроение", en: "Mood", rd: "Отмечай состояние и смотри график динамики.", ed: "Track how you feel and see a trend chart." },
  { href: "/garden", icon: "garden", ru: "Сад", en: "Garden", rd: "Твой сад растёт за каждую минуту тишины.", ed: "Your garden grows with every calm minute." },
  { href: "/journal", icon: "journal", ru: "Дневник", en: "Journal", rd: "Дневник благодарности — приватно в браузере.", ed: "A gratitude journal — private in your browser." },
  { href: "/zen", icon: "zen", ru: "Дзен-сад", en: "Zen garden", rd: "Рисуй узоры на песке и расставляй камни.", ed: "Rake patterns in sand and place stones." },
  { href: "/asmr", icon: "asmr", ru: "АСМР", en: "ASMR", rd: "Тыкай по мягким звукам — тихий отклик.", ed: "Tap soft sounds — a quiet response." },
  { href: "/play", icon: "play", ru: "Игры", en: "Play", rd: "Лопай пузырьки под пентатонику.", ed: "Pop bubbles to a pentatonic scale." },
  { href: "/affirmations", icon: "affirmations", ru: "Аффирмации", en: "Affirmations", rd: "Тёплые слова, которые хочется сохранить.", ed: "Warm words worth keeping." },
  { href: "/about", icon: "about", ru: "О проекте", en: "About", rd: "Философия спокойствия и как пользоваться.", ed: "The calm philosophy and how to use it." },
];

const STEPS = [
  { ru: "Выбери практику", en: "Pick a practice", rd: "Дыхание, звуки, фокус или медитация — смотря по настроению.", ed: "Breath, sound, focus or meditation — follow your mood." },
  { ru: "Надень наушники", en: "Put on headphones", rd: "Звук генерируется в реальном времени и никогда не повторяется.", ed: "Audio is generated live and never loops the same." },
  { ru: "Отпусти", en: "Let go", rd: "Никаких регистраций, рекламы и уведомлений. Только ты и покой.", ed: "No signup, ads or notifications. Just you and calm." },
];

const SCIENCE = [
  { n: "01", tn: "дыхание", te: "breathing", ru: "Длинный выдох успокаивает", en: "The long exhale calms", rd: "Удлинённый выдох смещает баланс к парасимпатической нервной системе — пульс и давление мягко снижаются. На этом построены 4-7-8 и 4-2-6.", ed: "A longer exhale shifts you toward the parasympathetic system — heart rate and pressure ease down. This is the basis of 4-7-8 and 4-2-6." },
  { n: "02", tn: "сердце", te: "heart", ru: "Когерентность ≈6 вдохов/мин", en: "Coherence at ≈6 breaths/min", rd: "Дыхание около шести циклов в минуту повышает вариабельность сердечного ритма — маркер устойчивости к стрессу.", ed: "Breathing around six cycles a minute raises heart-rate variability — a marker of stress resilience." },
  { n: "03", tn: "звук", te: "sound", ru: "Эмбиент снижает напряжение", en: "Ambient lowers tension", rd: "Спокойные звуковые ландшафты без резких пиков помогают вниманию расфокусироваться и снижают ощущение тревоги.", ed: "Calm soundscapes without sharp peaks let attention soften and reduce the feeling of anxiety." },
];

export default function Home() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  return (
    <>
      <section className="hero">
        <div className="hero-orb" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="eyebrow">{t("спокойствие по требованию", "calm on demand")}</div>
        <h1 className="hero-title" aria-label="wasd/therapy">
          {"wasd/therapy".split("").map((c, i) =>
            c === "/" ? (
              <em key={i} style={{ animationDelay: `${0.3 + i * 0.045}s` }}>/</em>
            ) : (
              <span key={i} style={{ animationDelay: `${0.3 + i * 0.045}s` }}>{c}</span>
            )
          )}
        </h1>
        <p className="lead">{t("Пространство, чтобы замедлиться, подышать и вернуть себе тишину. Без рекламы, без регистрации, без спешки.", "A space to slow down, breathe and reclaim your quiet. No ads, no signup, no rush.")}</p>
        <div className="cta">
          <Magnetic><Link href="/breathe" className="btn">{t("Начать дышать", "Start breathing")}</Link></Magnetic>
          <Magnetic><button className="btn-ghost" onClick={() => window.dispatchEvent(new Event("wt-quickcalm"))}>{t("Быстрое успокоение", "Quick calm")}</button></Magnetic>
        </div>
        <div className="scroll-hint">{t("ЛИСТАЙ ВНИЗ", "SCROLL")}</div>
      </section>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <div className="eyebrow">{t("инструменты", "toolkit")}</div>
            <h2>{t("Способы выдохнуть", "Ways to exhale")}</h2>
            <p>{t("Каждый раздел — законченная практика, а не картинка.", "Each section is a finished practice, not a placeholder.")}</p>
          </div>
        </Reveal>
        <div className="grid">
          {TOOLS.map((it, i) => (
            <Reveal key={it.href} delay={i * 0.05}>
              <Link href={it.href} className="card">
                <div className="ic"><Icon name={it.icon} /></div>
                <h3>{t(it.ru, it.en)}</h3>
                <p>{t(it.rd, it.ed)}</p>
                <span className="go">{t("открыть", "open")} →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <div className="eyebrow">{t("доказательная база", "evidence")}</div>
            <h2>{t("Почему это работает", "Why it works")}</h2>
            <p>{t("Простые механизмы, а не магия.", "Simple mechanisms, not magic.")}</p>
          </div>
        </Reveal>
        <div className="science">
          {SCIENCE.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="sci">
                <div className="sci-n">{s.n} / {t(s.tn, s.te)}</div>
                <h4>{t(s.ru, s.en)}</h4>
                <p>{t(s.rd, s.ed)}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="trust-line">{t("Без рекламы. Без слежки. Без аккаунтов. ", "No ads. No tracking. No accounts. ")}<b>{t("Всё, что ты вводишь, остаётся только в твоём браузере.", "Everything you enter stays only in your browser.")}</b></p>
        </Reveal>
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
                <div className="step-n">{String(i + 1).padStart(2, "0")}</div>
                <h4>{t(s.ru, s.en)}</h4>
                <p>{t(s.rd, s.ed)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="final">
        <div className="final-orb" aria-hidden="true"><i /><i /><i /></div>
        <div className="eyebrow">{t("одна минута", "one minute")}</div>
        <h2 className="final-h">{t("Сделай вдох.", "Take a breath.")}</h2>
        <p className="final-p">{t("Прямо сейчас. Одна минута только для себя.", "Right now. One minute just for you.")}</p>
        <Magnetic><Link href="/breathe" className="btn">{t("Начать", "Begin")}</Link></Magnetic>
      </section>

      <section className="section">
        <Reveal>
          <p className="manifesto">{t("Мы верим, что технологии могут успокаивать, а не красть внимание. ", "We believe technology can calm you, not steal your attention. ")}<span>{t("wasd/therapy — это маленькое начало большого спокойствия.", "wasd/therapy is a small beginning of something calmer.")}</span></p>
        </Reveal>
        <footer className="foot">
          <div className="fw">wasd<span>/</span>therapy</div>
          <p>{t("Сделано с заботой. Бесплатно навсегда.", "Made with care. Free forever.")}</p>
          <p className="foot-meta">{t("Без рекламы · Без слежки · 2026", "No ads · No tracking · 2026")}</p>
        </footer>
      </section>
    </>
  );
}
