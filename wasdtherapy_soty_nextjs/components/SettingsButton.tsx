"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";

export default function SettingsButton() {
  const [open, setOpen] = useState(false);
  const lang = useStore((s) => s.lang);
  const voiceOn = useStore((s) => s.voiceOn);
  const setVoiceOn = useStore((s) => s.setVoiceOn);
  const hapticsOn = useStore((s) => s.hapticsOn);
  const setHaptics = useStore((s) => s.setHaptics);
  const spatialOn = useStore((s) => s.spatialOn);
  const setSpatial = useStore((s) => s.setSpatial);
  const setScreensaver = useStore((s) => s.setScreensaver);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  return (
    <div className="setwrap">
      <button className="lang-btn" onClick={() => setOpen((o) => !o)} aria-label={t("Настройки", "Settings")} aria-expanded={open}>⚙</button>
      {open && (
        <div className="setpop" role="menu">
          <label className="setrow"><span>{t("Голосовой гид", "Voice guide")}</span><input type="checkbox" checked={voiceOn} onChange={(e) => setVoiceOn(e.target.checked)} /></label>
          <label className="setrow"><span>{t("Вибрация", "Haptics")}</span><input type="checkbox" checked={hapticsOn} onChange={(e) => setHaptics(e.target.checked)} /></label>
          <label className="setrow"><span>{t("Объёмный звук", "Spatial audio")}</span><input type="checkbox" checked={spatialOn} onChange={(e) => setSpatial(e.target.checked)} /></label>
          <button className="setgo" onClick={() => { setScreensaver(true); setOpen(false); }}>{t("Режим покоя", "Ambient mode")}</button>
        </div>
      )}
    </div>
  );
}
