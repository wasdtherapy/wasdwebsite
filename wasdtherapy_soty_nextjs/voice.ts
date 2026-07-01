import * as Tone from "tone";
import { ensureAudio, getReverb } from "./audio";

let ready = false;
let pluck: any, bell: any, wood: any, glass: any, bowl: any, poly: any;

export async function initPlay() {
  await ensureAudio();
  if (ready) return;
  const rev = getReverb();
  pluck = new Tone.PluckSynth({ dampening: 3500, resonance: 0.92 }).connect(rev);
  pluck.volume.value = -4;
  bell = new Tone.FMSynth({ harmonicity: 3.01, modulationIndex: 12, envelope: { attack: 0.001, decay: 1.6, sustain: 0, release: 1.8 }, modulationEnvelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.4 } }).connect(rev);
  bell.volume.value = -14;
  wood = new Tone.MembraneSynth({ pitchDecay: 0.008, octaves: 2, envelope: { attack: 0.001, decay: 0.18, sustain: 0 } }).connect(rev);
  wood.volume.value = -8;
  glass = new Tone.AMSynth({ harmonicity: 2.5, envelope: { attack: 0.002, decay: 0.6, sustain: 0, release: 0.5 } }).connect(rev);
  glass.volume.value = -12;
  bowl = new Tone.FMSynth({ harmonicity: 1.5, modulationIndex: 4, envelope: { attack: 0.02, decay: 3, sustain: 0, release: 3 } }).connect(rev);
  bowl.volume.value = -10;
  poly = new Tone.PolySynth(Tone.Synth).connect(rev);
  poly.set({ oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.6 } });
  poly.volume.value = -15;
  ready = true;
}

const PENTA = ["C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"];
export function pent(i: number) { return PENTA[((i % PENTA.length) + PENTA.length) % PENTA.length]; }

export async function tap(kind: string, i = 0) {
  await initPlay();
  const n = pent(i);
  const time = Tone.now();
  if (kind === "bell") bell.triggerAttackRelease(n, 1.2, time);
  else if (kind === "wood") wood.triggerAttackRelease(pent(i), 0.2, time);
  else if (kind === "glass") glass.triggerAttackRelease(pent(i + 5), 0.5, time);
  else if (kind === "bowl") bowl.triggerAttackRelease(["C3", "E3", "G3", "A3"][i % 4], 2, time);
  else if (kind === "harp") { for (let k = 0; k < 4; k++) pluck.triggerAttackRelease(pent(i + k * 2), 0.4, time + k * 0.06); }
  else if (kind === "chord") poly.triggerAttackRelease([pent(i), pent(i + 2), pent(i + 4)], 0.9, time);
  else if (kind === "drip") glass.triggerAttackRelease(pent(9), 0.18, time);
  else pluck.triggerAttackRelease(n, 0.5, time);
}
