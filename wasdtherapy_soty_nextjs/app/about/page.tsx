"use client";
import Reveal from "@/components/Reveal";
import { useStore } from "@/lib/store";

export default function About() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  return (
    <section className="section" style={undefined}>
      <div className="tool" style={undefined}>
        <h1>{t("О проекте", "About")}</h1>
        <p className="manifesto">{t("wasd/therapy — это тихая комната в шумном интернете. ", "wasd/therapy is a quiet room in a noisy internet. ")}<span>{t("Место, куда можно зайти на три минуты и выйти чуть спокойнее.", "A place you can enter for three minutes and leave a little calmer.")}</span></p>
      </div>
      <div className="steps">
        <Reveal><div className="step"><h4>{t("Без шума", "No noise")}</h4><p>{t("Никакой рекламы, трекеров и бесконечных лент. Только то, что помогает.", "No ads, trackers or endless feeds. Only what helps.")}</p></div></Reveal>
        <Reveal delay={0.08}><div className="step"><h4>{t("Живой звук", "Living sound")}</h4><p>{t("Всё аудио синтезируется в браузере в реальном времени — никаких файлов и повторов.", "All audio is synthesized live in your browser — no files, no loops.")}</p></div></Reveal>
        <Reveal delay={0.16}><div className="step"><h4>{t("Твоё и только твоё", "Yours only")}</h4><p>{t("Настройки хранятся в твоём браузере. Мы не собираем данные.", "Settings live in your browser. We collect no data.")}</p></div></Reveal>
      </div>
      <div className="tool" style={undefined}>
        <div className="note">{t("Как пользоваться: начни с раздела «Дыхание» на 3 минуты, потом добавь фоновые звуки. Для работы — «Фокус», перед сном — «Медитация». Лучше всего в наушниках.", "How to use: start with Breathe for 3 minutes, then add background sounds. Use Focus for work, Meditate before sleep. Best with headphones.")}</div>
      </div>
    </section>
  );
}
