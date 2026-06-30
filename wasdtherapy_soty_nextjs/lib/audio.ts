import * as Tone from "tone";
import { useStore } from "./store";

let started = false;
let master: any = null;
let reverb: any = null;
let meter: any = null;
let raf = 0;
let pad: any = null;
let padLoop: any = null;

export async function ensureAudio() {
  if (started) return;
  await Tone.start();
  started = true;
  master = new Tone.Gain(0.7).toDestination();
  reverb = new Tone.Reverb({ decay: 8, wet: 0.5 }).connect(master);
  meter = new Tone.Meter({ smoothing: 0.92 });
  master.connect(meter);
  if (Tone.Transport.state !== "started") {
    Tone.Transport.bpm.value = 48;
    Tone.Transport.start();
  }
  const tick = () => {
    const v = meter.getValue();
    const db = Array.isArray(v) ? v[0] : (v as number);
    const lvl = Math.max(0, Math.min(1, (db + 48) / 48));
    useStore.getState().setAudioLevel(lvl);
    raf = requestAnimationFrame(tick);
  };
  tick();
  applyVolume();
}

export function getReverb() { return reverb; }
export function getMaster() { return master; }

export function applyVolume() {
  if (!master) return;
  const { volume, muted } = useStore.getState();
  master.gain.rampTo(muted ? 0 : volume, 0.4);
}

export async function startPad() {
  await ensureAudio();
  if (pad) { useStore.getState().setAmbient(true); return; }
  pad = new Tone.PolySynth(Tone.FMSynth).connect(reverb);
  pad.set({
    harmonicity: 1.4,
    modulationIndex: 2,
    envelope: { attack: 5, decay: 3, sustain: 0.85, release: 9 },
    volume: -18,
  });
  const chords = [
    ["C3", "E3", "G3", "B3"],
    ["A2", "C3", "E3", "G3"],
    ["F2", "A2", "C3", "E3"],
    ["G2", "B2", "D3", "F3"],
  ];
  let i = 0;
  padLoop = new Tone.Loop((time) => {
    pad.triggerAttackRelease(chords[i % chords.length], "2m", time);
    i++;
  }, "2m").start(0);
  useStore.getState().setAmbient(true);
}

export function stopPad() {
  if (padLoop) { padLoop.stop(); padLoop.dispose(); padLoop = null; }
  if (pad) { try { pad.releaseAll(); } catch {} pad.dispose(); pad = null; }
  useStore.getState().setAmbient(false);
}
