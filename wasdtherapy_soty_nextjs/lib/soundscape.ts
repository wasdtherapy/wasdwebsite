import * as Tone from "tone";
import { ensureAudio, getMaster, getReverb } from "./audio";

export type LayerDef = { id: string; ru: string; en: string; icon: string };
export const LAYERS: LayerDef[] = [
  { id: "rain", ru: "Дождь", en: "Rain", icon: "🌧" },
  { id: "ocean", ru: "Океан", en: "Ocean", icon: "🌊" },
  { id: "forest", ru: "Лес", en: "Forest", icon: "🌲" },
  { id: "fire", ru: "Костёр", en: "Fire", icon: "🔥" },
  { id: "wind", ru: "Ветер", en: "Wind", icon: "🍃" },
  { id: "night", ru: "Ночь", en: "Night", icon: "🌙" },
  { id: "bowls", ru: "Поющие чаши", en: "Singing bowls", icon: "🎐" },
  { id: "white", ru: "Белый шум", en: "White noise", icon: "⚪" },
  { id: "cafe", ru: "Кафе", en: "Cafe", icon: "☕" },
  { id: "stream", ru: "Ручей", en: "Stream", icon: "💧" },
  { id: "birds", ru: "Птицы", en: "Birds", icon: "🐦" },
  { id: "om", ru: "Ом", en: "Om", icon: "🕉" },
];

const TONAL = new Set(["bowls", "night", "forest", "birds", "om"]);
type LNode = { gain: any; nodes: any[] };
const active: Record<string, LNode> = {};

function build(id: string, out: any): any[] {
  const nodes: any[] = [];
  const inner = new Tone.Gain(1).connect(out);
  nodes.push(inner);
  if (id === "rain") {
    const n = new Tone.Noise("pink").start();
    const hp = new Tone.Filter(900, "highpass");
    const lp = new Tone.Filter(8000, "lowpass");
    n.chain(hp, lp, inner);
    const lfo = new Tone.LFO({ frequency: 0.3, min: 0.7, max: 1 }).start();
    lfo.connect(inner.gain);
    nodes.push(n, hp, lp, lfo);
  } else if (id === "ocean") {
    const n = new Tone.Noise("brown").start();
    const lp = new Tone.Filter(500, "lowpass");
    n.chain(lp, inner);
    const amp = new Tone.LFO({ frequency: 0.1, min: 0.25, max: 1 }).start();
    amp.connect(inner.gain);
    const sweep = new Tone.LFO({ frequency: 0.08, min: 280, max: 700 }).start();
    sweep.connect(lp.frequency);
    nodes.push(n, lp, amp, sweep);
  } else if (id === "wind") {
    const n = new Tone.Noise("pink").start();
    const bp = new Tone.Filter({ type: "bandpass", frequency: 600, Q: 1.2 });
    n.chain(bp, inner);
    const sweep = new Tone.LFO({ frequency: 0.12, min: 300, max: 1200 }).start();
    sweep.connect(bp.frequency);
    const amp = new Tone.LFO({ frequency: 0.15, min: 0.3, max: 0.9 }).start();
    amp.connect(inner.gain);
    nodes.push(n, bp, sweep, amp);
  } else if (id === "white") {
    const n = new Tone.Noise("white").start();
    const lp = new Tone.Filter(12000, "lowpass");
    n.chain(lp, inner);
    nodes.push(n, lp);
  } else if (id === "cafe") {
    const n = new Tone.Noise("brown").start();
    const lp = new Tone.Filter(900, "lowpass");
    n.chain(lp, inner);
    const amp = new Tone.LFO({ frequency: 0.5, min: 0.4, max: 0.8 }).start();
    amp.connect(inner.gain);
    nodes.push(n, lp, amp);
  } else if (id === "fire") {
    const n = new Tone.Noise("brown").start();
    const lp = new Tone.Filter(700, "lowpass");
    n.chain(lp, inner);
    const crackle = new Tone.Noise("white").start();
    const chp = new Tone.Filter(2000, "highpass");
    const cenv = new Tone.AmplitudeEnvelope({ attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 });
    crackle.chain(chp, cenv, inner);
    const loop = new Tone.Loop((time) => { if (Math.random() < 0.7) cenv.triggerAttackRelease(0.03, time); }, "16n").start(0);
    nodes.push(n, lp, crackle, chp, cenv, loop);
  } else if (id === "forest") {
    const n = new Tone.Noise("pink").start();
    const lp = new Tone.Filter(2500, "lowpass");
    n.chain(lp, inner);
    const bird = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.12, sustain: 0, release: 0.1 }, volume: -18 }).connect(out);
    const notes = ["C6", "E6", "G6", "A6", "D6"];
    const loop = new Tone.Loop((time) => { if (Math.random() < 0.3) bird.triggerAttackRelease(notes[Math.floor(Math.random() * notes.length)], 0.08, time); }, "4n").start(0);
    nodes.push(n, lp, bird, loop);
  } else if (id === "night") {
    const drone = new Tone.Oscillator({ frequency: 70, type: "sine", volume: -22 }).start();
    drone.connect(inner);
    const cricket = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.05 }, volume: -26 }).connect(out);
    const loop = new Tone.Loop((time) => { if (Math.random() < 0.5) cricket.triggerAttackRelease("A7", 0.03, time); }, "8n").start(0);
    nodes.push(drone, cricket, loop);
  } else if (id === "bowls") {
    const bowl = new Tone.FMSynth({ harmonicity: 3.2, modulationIndex: 6, envelope: { attack: 0.02, decay: 4, sustain: 0, release: 4 }, volume: -12 }).connect(out);
    const notes = ["C4", "D4", "F4", "G4", "A4"];
    const loop = new Tone.Loop((time) => { bowl.triggerAttackRelease(notes[Math.floor(Math.random() * notes.length)], 4, time); }, "4m").start(0);
    nodes.push(bowl, loop);
  } else if (id === "stream") {
    const n = new Tone.Noise("white").start();
    const bp = new Tone.Filter({ type: "bandpass", frequency: 1800, Q: 0.8 });
    const lp = new Tone.Filter(5000, "lowpass");
    n.chain(bp, lp, inner);
    const flutter = new Tone.LFO({ frequency: 6, min: 0.5, max: 1 }).start();
    flutter.connect(inner.gain);
    const sweep = new Tone.LFO({ frequency: 0.5, min: 1200, max: 2400 }).start();
    sweep.connect(bp.frequency);
    nodes.push(n, bp, lp, flutter, sweep);
  } else if (id === "birds") {
    const bird = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.08 }, volume: -16 }).connect(out);
    const notes = ["E6", "G6", "A6", "C7", "D7", "B6"];
    const loop = new Tone.Loop((time) => { if (Math.random() < 0.4) { const nt = notes[Math.floor(Math.random() * notes.length)]; bird.triggerAttackRelease(nt, 0.06, time); if (Math.random() < 0.5) bird.triggerAttackRelease(nt, 0.05, time + 0.09); } }, "4n").start(0);
    nodes.push(bird, loop);
  } else if (id === "om") {
    [110, 165, 220].forEach((f) => { const o = new Tone.Oscillator({ frequency: f, type: "sine", volume: -20 }).start(); o.connect(inner); nodes.push(o); });
    const trem = new Tone.LFO({ frequency: 0.15, min: 0.6, max: 1 }).start();
    trem.connect(inner.gain);
    nodes.push(trem);
  }
  return nodes;
}

export async function setLayer(id: string, on: boolean, volume = 0.6) {
  await ensureAudio();
  if (on) {
    if (!active[id]) {
      const out = new Tone.Gain(0).connect(TONAL.has(id) ? getReverb() : getMaster());
      const nodes = build(id, out);
      active[id] = { gain: out, nodes };
    }
    active[id].gain.gain.rampTo(volume, 1.5);
  } else if (active[id]) {
    active[id].gain.gain.rampTo(0, 0.8);
  }
}

export function setLayerVolume(id: string, v: number) {
  const a = active[id];
  if (a) a.gain.gain.rampTo(v, 0.25);
}

export function stopAllLayers() {
  Object.values(active).forEach((a) => a.gain.gain.rampTo(0, 0.6));
}
