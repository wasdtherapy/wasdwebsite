"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

const KEY = "wt_state_v1";

export default function Persistence() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        useStore.getState().hydrate({
          lang: d.lang === "en" ? "en" : "ru",
          palette: d.palette ?? "aurora",
          volume: typeof d.volume === "number" ? d.volume : 0.7,
          muted: !!d.muted,
          mixer: d.mixer ?? {},
          favorites: Array.isArray(d.favorites) ? d.favorites : [],
        });
      } else {
        useStore.getState().hydrate({});
      }
    } catch {
      useStore.getState().hydrate({});
    }
    const unsub = useStore.subscribe((s) => {
      const data = { lang: s.lang, palette: s.palette, volume: s.volume, muted: s.muted, mixer: s.mixer, favorites: s.favorites };
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
    });
    return () => unsub();
  }, []);
  return null;
}
