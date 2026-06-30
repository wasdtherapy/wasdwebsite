"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { LAYERS, setLayer as audioSetLayer, setLayerVolume as audioSetVolume } from "@/lib/soundscape";
import Illustration from "@/components/Illustration";

type Preset = { id: string; ru: string; en: string; layers: Record<string, number> };
const PRESETS: Preset[] = [
  { id: "rainynight", ru: "Дождливая ночь", en: "Rainy night", layers: { rain: 0.7, night: 0.4, bowls: 0.3 } },
  { id: "forest", ru: "Утро в лесу", en: "Forest morning", layers: { forest: 0.6, wind: 0.3, rain: 0.2 } },
  { id: "ocean", ru: "Спокойный океан", en: "Calm ocean", layers: { ocean: 0.7, wind: 0.3 } },
  { id: "cozy", ru: "Уют у огня", en: "Cozy fire", layers: { fire: 0.6, rain: 0.3, cafe: 0.2 } },
  { id: "work", ru: "Глубокая работа", en: "Deep work", layers: { white: 0.4, cafe: 0.4 } },
];

type Custom = { id: string; name: string; layers: Record<string, number> };
const CKEY = "wt_presets_v1";

export default function Sounds() {
  const lang = useStore((s) => s.lang);
  const mixer = useStore((s) => s.mixer);
  const setLayerS = useStore((s) => s.setLayer);
  const setVolumeS = useStore((s) => s.setLayerVolume);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);

  const [custom, setCustom] = useState<Custom[]>([]);
  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(CKEY); if (raw) setCustom(JSON.parse(raw)); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) { try { localStorage.setItem(CKEY, JSON.stringify(custom)); } catch {} }
  }, [custom, loaded]);

  const toggle = (id: string) => {
    const on = !(mixer[id]?.on);
    const vol = mixer[id]?.volume ?? 0.6;
    audioSetLayer(id, on, vol);
    setLayerS(id, on);
  };
  const changeVol = (id: string, v: number) => {
    audioSetVolume(id, v);
    setVolumeS(id, v);
    if (!(mixer[id]?.on)) { audioSetLayer(id, true, v); setLayerS(id, true); }
  };
  const applyLayers = (layers: Record<string, number>) => {
    LAYERS.forEach((l) => {
      const v = layers[l.id];
      if (v) { audioSetLayer(l.id, true, v); setLayerS(l.id, true); setVolumeS(l.id, v); }
      else { audioSetLayer(l.id, false); setLayerS(l.id, false); }
    });
  };

  const currentMix = (): Record<string, number> => {
    const out: Record<string, number> = {};
    LAYERS.forEach((l) => { const m = mixer[l.id]; if (m?.on) out[l.id] = m.volume ?? 0.6; });
    return out;
  };
  const saveCurrent = () => {
    const layers = currentMix();
    if (Object.keys(layers).length === 0) return;
    const nm = name.trim() || t("Мой микс", "My mix");
    setCustom((p) => [{ id: "c" + Date.now(), name: nm, layers }, ...p]);
    setName("");
  };
  const delCustom = (id: string) => setCustom((p) => p.filter((c) => c.id !== id));

  const activeCount = LAYERS.filter((l) => mixer[l.id]?.on).length;

  return (
    <section className="tool">
      <h1>{t("Звуки", "Sounds")}</h1>
      <p className="sub">{t("Собери свою атмосферу. Каждый слой синтезируется в реальном времени и никогда не повторяется.", "Build your own atmosphere. Every layer is synthesized live and never repeats.")}</p>
      <Illustration variant="rain" />
      <div className="presets">
        {PRESETS.map((p) => (
          <button key={p.id} className="chip" onClick={() => applyLayers(p.layers)}>{t(p.ru, p.en)}</button>
        ))}
      </div>

      <div className="umix">
        <input className="preset-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("Название микса…", "Mix name…")} />
        <button className="preset-save" onClick={saveCurrent} disabled={activeCount === 0}>{t("Сохранить текущий микс", "Save current mix")}</button>
      </div>
      {custom.length > 0 && (
        <div className="presets">
          {custom.map((c) => (
            <span key={c.id} className="upreset">
              <button className="chip" onClick={() => applyLayers(c.layers)}>{c.name}</button>
              <button className="x" onClick={() => delCustom(c.id)} aria-label="delete">×</button>
            </span>
          ))}
        </div>
      )}

      <div className="mixer">
        {LAYERS.map((l) => {
          const on = !!mixer[l.id]?.on;
          const vol = mixer[l.id]?.volume ?? 0.6;
          return (
            <div key={l.id} className={on ? "layer on" : "layer"}>
              <button className="ltoggle" onClick={() => toggle(l.id)}>
                <div className="lic">{l.icon}</div>
                <div className="lname">{t(l.ru, l.en)}</div>
              </button>
              <input type="range" min={0} max={1} step={0.01} value={vol} onChange={(e) => changeVol(l.id, parseFloat(e.target.value))} aria-label={l.en} />
            </div>
          );
        })}
      </div>
      <div className="note">{t("Совет: собери любимое сочетание слоёв и сохрани его как свой пресет — он останется в браузере. Общая громкость — в плеере внизу.", "Tip: build your favourite blend and save it as your own preset — it stays in your browser. Master volume is in the player below.")}</div>
    </section>
  );
}
