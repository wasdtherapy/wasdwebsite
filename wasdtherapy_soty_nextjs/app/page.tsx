"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { useStore } from "@/lib/store";
import { startAudio } from "@/lib/audio";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

const HUB = [
  { href: "/breathe", i: "01", ru: "Дыхание", en: "Breathe" },
  { href: "/sounds", i: "02", ru: "Звуки", en: "Sounds" },
  { href: "/focus", i: "03", ru: "Фокус", en: "Focus" },
];

export default function Home() {
  const lang = useStore((s) => s.lang);
  return (
    <main>
      <section className="hero">
        <div className="hero-scene"><Scene /></div>
        <div className="hero-inner">
          <Reveal><p className="kicker">{lang === "ru" ? "спокойное пространство" : "a calm space"}</p></Reveal>
          <Reveal delay={0.1}><h1 className="display">wasd<span className="thin">/</span>therapy</h1></Reveal>
          <Reveal delay={0.2}><p className="lead">{lang === "ru" ? "Зашёл — и выдохнул." : "Came in — and exhaled."}</p></Reveal>
          <Reveal delay={0.3}>
            <div className="row">
              <button className="btn primary" onClick={() => startAudio()}>{lang === "ru" ? "включить звук" : "start sound"}</button>
              <Link className="btn" href="/breathe">{lang === "ru" ? "начать с дыхания" : "start breathing"}</Link>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="hub">
        {HUB.map((c, idx) => (
          <Reveal key={c.href} delay={idx * 0.08}>
            <Link href={c.href} className="card">
              <span className="idx">{c.i}</span>
              <h3>{lang === "ru" ? c.ru : c.en}</h3>
            </Link>
          </Reveal>
        ))}
      </section>
    </main>
  );
}
