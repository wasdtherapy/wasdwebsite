import { create } from "zustand";

export type Palette = "aurora" | "nebula" | "abyss" | "ember" | "bio";
export type Lang = "ru" | "en";

export interface MixerLayer { on: boolean; volume: number }
export type Mixer = Record<string, MixerLayer>;

interface State {
  lang: Lang;
  palette: Palette;
  autoTheme: boolean;
  audioLevel: number;
  muted: boolean;
  volume: number;
  ambientOn: boolean;
  mindfulSeconds: number;
  mixer: Mixer;
  favorites: string[];
  hydrated: boolean;
  screensaver: boolean;
  voiceOn: boolean;
  hapticsOn: boolean;
  spatialOn: boolean;
  breathValue: number;
  share: { minutes: number; label: string } | null;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  setPalette: (p: Palette) => void;
  setAutoTheme: (b: boolean) => void;
  setAudioLevel: (n: number) => void;
  setVolume: (n: number) => void;
  toggleMute: () => void;
  setAmbient: (on: boolean) => void;
  addMindful: (n: number) => void;
  setLayer: (id: string, on: boolean) => void;
  setLayerVolume: (id: string, v: number) => void;
  toggleFavorite: (id: string) => void;
  setScreensaver: (b: boolean) => void;
  toggleScreensaver: () => void;
  setVoiceOn: (b: boolean) => void;
  setHaptics: (b: boolean) => void;
  setSpatial: (b: boolean) => void;
  setBreathValue: (n: number) => void;
  setShare: (v: { minutes: number; label: string } | null) => void;
  hydrate: (partial: Partial<State>) => void;
}

export const useStore = create<State>((set) => ({
  lang: "ru",
  palette: "aurora",
  autoTheme: false,
  audioLevel: 0,
  muted: false,
  volume: 0.7,
  ambientOn: false,
  mindfulSeconds: 0,
  mixer: {},
  favorites: [],
  hydrated: false,
  screensaver: false,
  voiceOn: false,
  hapticsOn: false,
  spatialOn: false,
  breathValue: 0,
  share: null,
  setLang: (lang) => set({ lang }),
  toggleLang: () => set((s) => ({ lang: s.lang === "ru" ? "en" : "ru" })),
  setPalette: (palette) => set({ palette, autoTheme: false }),
  setAutoTheme: (autoTheme) => set({ autoTheme }),
  setAudioLevel: (audioLevel) => set({ audioLevel }),
  setVolume: (volume) => set({ volume }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  setAmbient: (ambientOn) => set({ ambientOn }),
  addMindful: (n) => set((s) => ({ mindfulSeconds: s.mindfulSeconds + n })),
  setLayer: (id, on) =>
    set((s) => ({ mixer: { ...s.mixer, [id]: { on, volume: s.mixer[id]?.volume ?? 0.6 } } })),
  setLayerVolume: (id, v) =>
    set((s) => ({ mixer: { ...s.mixer, [id]: { on: s.mixer[id]?.on ?? true, volume: v } } })),
  toggleFavorite: (id) =>
    set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] })),
  setScreensaver: (screensaver) => set({ screensaver }),
  toggleScreensaver: () => set((s) => ({ screensaver: !s.screensaver })),
  setVoiceOn: (voiceOn) => set({ voiceOn }),
  setHaptics: (hapticsOn) => set({ hapticsOn }),
  setSpatial: (spatialOn) => set({ spatialOn }),
  setBreathValue: (breathValue) => set({ breathValue }),
  setShare: (share) => set({ share }),
  hydrate: (partial) => set({ ...partial, hydrated: true }),
}));
