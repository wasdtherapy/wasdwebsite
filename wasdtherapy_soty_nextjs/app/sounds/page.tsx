"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { LAYERS, setLayer as audioSetLayer, setLayerVolume as audioSetVolume } from "@/lib/soundscape";
import Illustration from "@/components/Illustration";

const UKEY = "wt_presets_v1";
type Preset = { id: string; ru: string; en: string; layers: Record<string, number> };
type UserPreset = { id: string; name: string; layers: Record<string, number> };
const PRESETS: Preset[] = [
  { id: "rainynight", ru: "Дождливая ночь", en: "Rainy night", layers: { rain: 0.7, night: 0.4, bowls: 0.3 } },
  { id: "forest", ru: "Утро в лесу", en: "Forest morning", layers: { forest: 0.6, wind: 0.3, birds: 0.4 } },
  { id: "ocean", ru: "Спокойный океан", en: "Calm ocean", layers: { ocean: 0.7, wind: 0.3 } },
  { id: "cozy", ru: "Уют у огня", en: "Cozy fire", layers: { fire: 0.6, rain: 0.3, cafe: 0.2 } },
  { id: "work", ru: "Глубокая работа", en: "Deep work", layers: { white: 0.4, cafe: 0.4 } },
  { id: "temple", ru: "Храм", en: "Temple", layers: { om: 0.5, bowls: 0.4, stream: 0.3 } },
];

export default function Sounds() {
  const lang = useStore((s) => s.lang);
  const mixer = useStore((s) => s.mixer);
  const setLayerS = useStore((s) => s.setLayer);
  const setVolumeS = useStore((s) => s.setLayerVolume);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const [mine, setMine] = useState<UserPreset[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    try { const r = localStorage.getItem(UKEY); if (r) setMine(JSON.parse(r)); } catch {}
  }, []);
  const persistMine = (n: UserPreset[]) => { setMine(n); try { localStorage.setItem(UKEY, JSON.stringify(n)); } catch {} };

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
  const saveMine = () => {
    const layers: Record<string, number> = {};
    LAYERS.forEach((l) => { if (mixer[l.id]?.on) layers[l.id] = mixer[l.id]?.volume ?? 0.6; });
    if (Object.keys(layers).length === 0) return;
    const nm = name.trim() || t("Мой микс", "My mix");
    const p: UserPreset = { id: String(Date.now()), name: nm, layers };
    persistMine([p, ...mine].slice(0, 12));
    setName("");
  };
  const delMine = (id: string) => persistMine(mine.filter((p) => p.id !== id));

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
      <div className="preset-save">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("Назови свой микс…", "Name your mix…")} maxLength={28} />
        <button className="chip" onClick={saveMine}>{t("Сохранить микс", "Save mix")}</button>
      </div>
      {mine.length > 0 && (
        <div className="umix">
          {mine.map((p) => (
            <span key={p.id} className="upreset">
              <button className="upreset-go" onClick={() => applyLayers(p.layers)}>{p.name}</button>
              <button className="x" onClick={() => delMine(p.id)} aria-label="delete">×</button>
            </span>
          ))}
        </div>
      )}
      <div className="note">{t("Совет: собери любимое сочетание и сохрани его — оно останется здесь для быстрого запуска. Общая громкость — в плеере внизу.", "Tip: build a favourite blend and save it — it stays here for quick recall. Master volume is in the player below.")}</div>
    </section>
  );
}
