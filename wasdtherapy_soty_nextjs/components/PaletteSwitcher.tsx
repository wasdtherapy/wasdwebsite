"use client";
import { useStore, Palette } from "@/lib/store";

const PALS: { id: Palette; c: string }[] = [
  { id: "aurora", c: "#7cf6c8" },
  { id: "nebula", c: "#ff8bd0" },
  { id: "abyss", c: "#6fe3ff" },
  { id: "ember", c: "#ffd27a" },
  { id: "bio", c: "#b6ff7a" },
];

export default function PaletteSwitcher() {
  const palette = useStore((s) => s.palette);
  const autoTheme = useStore((s) => s.autoTheme);
  const setPalette = useStore((s) => s.setPalette);
  const setAutoTheme = useStore((s) => s.setAutoTheme);
  const lang = useStore((s) => s.lang);
  return (
    <div className="pals" role="group" aria-label="theme">
      {PALS.map((p) => {
        const dotStyle = { background: p.c };
        return (
          <button
            key={p.id}
            className={!autoTheme && p.id === palette ? "dot on" : "dot"}
            style={dotStyle}
            onClick={() => setPalette(p.id)}
            aria-label={p.id}
          />
        );
      })}
      <button
        className={autoTheme ? "dot auto on" : "dot auto"}
        onClick={() => setAutoTheme(!autoTheme)}
        aria-label="auto theme by time of day"
        title={lang === "ru" ? "Авто-палитра по времени суток" : "Auto palette by time of day"}
      >🌗</button>
    </div>
  );
}
