import * as Tone from "tone";
import { useStore } from "./store";

let initialized = false;
let raf = 0;

export async function startAudio() {
  if (initialized) return;
  await Tone.start();
  initialized = true;

  const master = new Tone.Gain(0).toDestination();
  master.gain.rampTo(0.6, 3);

  const reverb = new Tone.Reverb({ decay: 9, wet: 0.7 }).connect(master);
  const meter = new Tone.Meter({ smoothing: 0.9 });
  master.connect(meter);

  const pad = new Tone.PolySynth(Tone.FMSynth).connect(reverb);
  pad.set({
    harmonicity: 1.2,
    modulationIndex: 2,
    envelope: { attack: 4, decay: 2, sustain: 0.8, release: 8 },
    modulationEnvelope: { attack: 6, decay: 2, sustain: 0.5, release: 8 },
    volume: -16,
  });

  const chords: string[][] = [
    ["C3", "E3", "G3", "B3"],
    ["A2", "C3", "E3", "G3"],
    ["F2", "A2", "C3", "E3"],
    ["G2", "B2", "D3", "F3"],
  ];
  let i = 0;
  new Tone.Loop((time) => {
    pad.triggerAttackRelease(chords[i % chords.length], "2m", time);
    i++;
  }, "2m").start(0);

  const bell = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 1.4, release: 0.2 },
    volume: -32,
  }).connect(reverb);
  new Tone.Loop((time) => {
    if (Math.random() < 0.4) bell.triggerAttackRelease("16n", time);
  }, "1m").start("1m");

  Tone.Transport.bpm.value = 50;
  Tone.Transport.start();

  const tick = () => {
    const v = meter.getValue();
    const db = Array.isArray(v) ? v[0] : v;
    const lvl = Math.max(0, Math.min(1, (db + 50) / 50));
    useStore.getState().setAudioLevel(lvl);
    raf = requestAnimationFrame(tick);
  };
  tick();
}

export function stopAudio() {
  Tone.Transport.stop();
  cancelAnimationFrame(raf);
}
