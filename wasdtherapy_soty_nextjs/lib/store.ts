import { create } from "zustand";

export type Palette = "aurora" | "nebula" | "abyss" | "ember" | "bio";

interface State {
  lang: "ru" | "en";
  palette: Palette;
  audioLevel: number;
  muted: boolean;
  setLang: (l: "ru" | "en") => void;
  setPalette: (p: Palette) => void;
  setAudioLevel: (n: number) => void;
  toggleMute: () => void;
}

export const useStore = create<State>((set) => ({
  lang: "ru",
  palette: "aurora",
  audioLevel: 0,
  muted: true,
  setLang: (lang) => set({ lang }),
  setPalette: (palette) => set({ palette }),
  setAudioLevel: (audioLevel) => set({ audioLevel }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
}));
