"use client";
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

export default function Sounds() {
  const lang = useStore((s) => s.lang);
  const mixer = useStore((s) => s.mixer);
  const setLayerS = useStore((s) => s.setLayer);
  const setVolumeS = useStore((s) => s.setLayerVolume);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);

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
  const applyPreset = (pr: Preset) => {
    LAYERS.forEach((l) => {
      const v = pr.layers[l.id];
      if (v) { audioSetLayer(l.id, true, v); setLayerS(l.id, true); setVolumeS(l.id, v); }
      else { audioSetLayer(l.id, false); setLayerS(l.id, false); }
    });
  };

  return (
    <section className="tool">
      <h1>{t("Звуки", "Sounds")}</h1>
      <p className="sub">{t("Собери свою атмосферу. Каждый слой синтезируется в реальном времени и никогда не повторяется.", "Build your own atmosphere. Every layer is synthesized live and never repeats.")}</p>
      <Illustration variant="rain" />
      <div className="presets">
        {PRESETS.map((p) => (
          <button key={p.id} className="chip" onClick={() => applyPreset(p)}>{t(p.ru, p.en)}</button>
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
      <div className="note">{t("Совет: начни с одного пресета, потом подстрой громкость слоёв под себя. Сочетай со вкладкой «Дыхание» или «Фокус». Общая громкость — в плеере внизу.", "Tip: start from a preset, then fine-tune each layer's volume. Pair it with Breathe or Focus. Master volume is in the player below.")}</div>
    </section>
  );
}
