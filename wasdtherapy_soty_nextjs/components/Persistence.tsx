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
          autoTheme: !!d.autoTheme,
          volume: typeof d.volume === "number" ? d.volume : 0.7,
          muted: !!d.muted,
          mindfulSeconds: typeof d.mindfulSeconds === "number" ? d.mindfulSeconds : 0,
          mixer: d.mixer ?? {},
          favorites: Array.isArray(d.favorites) ? d.favorites : [],
          streak: typeof d.streak === "number" ? d.streak : 0,
          bestStreak: typeof d.bestStreak === "number" ? d.bestStreak : 0,
          totalDays: typeof d.totalDays === "number" ? d.totalDays : 0,
          ritualDoneDay: typeof d.ritualDoneDay === "string" ? d.ritualDoneDay : "",
        });
      } else {
        useStore.getState().hydrate({});
      }
    } catch {
      useStore.getState().hydrate({});
    }
    const unsub = useStore.subscribe((s) => {
      const data = { lang: s.lang, palette: s.palette, autoTheme: s.autoTheme, volume: s.volume, muted: s.muted, mindfulSeconds: s.mindfulSeconds, mixer: s.mixer, favorites: s.favorites, streak: s.streak, bestStreak: s.bestStreak, totalDays: s.totalDays, ritualDoneDay: s.ritualDoneDay };
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
    });
    return () => unsub();
  }, []);
  return null;
}
