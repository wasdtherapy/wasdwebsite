"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { startPad, stopPad, applyVolume, ensureAudio } from "@/lib/audio";

export default function AudioBar() {
  const ambientOn = useStore((s) => s.ambientOn);
  const muted = useStore((s) => s.muted);
  const volume = useStore((s) => s.volume);
  const level = useStore((s) => s.audioLevel);
  const lang = useStore((s) => s.lang);
  const setVolume = useStore((s) => s.setVolume);
  const toggleMute = useStore((s) => s.toggleMute);
  useEffect(() => { applyVolume(); }, [muted, volume]);
  const barStyle = { transform: `scaleX(${0.06 + level * 0.94})` };
  return (
    <div className="audiobar">
      <button className="ab-btn" onClick={() => (ambientOn ? stopPad() : startPad())} aria-label="ambient">
        {ambientOn ? "❚❚" : "▶"}
      </button>
      <span className="ab-name">{lang === "ru" ? "эмбиент" : "ambient"}</span>
      <div className="ab-meter"><i style={barStyle} /></div>
      <button className="ab-btn" onClick={() => { ensureAudio(); toggleMute(); }} aria-label="mute">
        {muted ? "🔇" : "🔊"}
      </button>
      <input className="ab-vol" type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} aria-label="volume" />
    </div>
  );
}
