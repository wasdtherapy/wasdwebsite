"use client";
import { useStore } from "@/lib/store";
import { startAudio } from "@/lib/audio";

export default function Sounds() {
  const lang = useStore((s) => s.lang);
  return (
    <main className="page">
      <h1 className="sec">{lang === "ru" ? "Звуки" : "Sounds"}</h1>
      <p className="lead">{lang === "ru" ? "Генеративный эмбиент на Tone.js. Порт микшера из vanilla-версии — следующий шаг." : "Generative ambient via Tone.js. Porting the mixer next."}</p>
      <button className="btn primary" onClick={() => startAudio()}>{lang === "ru" ? "включить эмбиент" : "start ambient"}</button>
    </main>
  );
}
