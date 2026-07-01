"use client";
import { useEffect } from "react";
import { useStore, Palette } from "@/lib/store";

export function timePalette(h = new Date().getHours()): Palette {
  if (h >= 5 && h < 10) return "ember";   // рассвет — тёплый
  if (h >= 10 && h < 17) return "aurora";  // день — свежий
  if (h >= 17 && h < 21) return "nebula";  // закат — мягкий
  return "abyss";                          // ночь — глубокий
}

export default function ThemeVars() {
  const palette = useStore((s) => s.palette);
  const autoTheme = useStore((s) => s.autoTheme);
  useEffect(() => {
    const root = document.documentElement;
    if (!autoTheme) { root.dataset.pal = palette; return; }
    const apply = () => { root.dataset.pal = timePalette(); };
    apply();
    const id = setInterval(apply, 60000);
    return () => clearInterval(id);
  }, [palette, autoTheme]);
  return null;
}
