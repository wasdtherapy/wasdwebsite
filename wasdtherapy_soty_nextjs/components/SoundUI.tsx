"use client";
import { useEffect } from "react";

let ctx: AudioContext | null = null;

function blip(freq: number, dur: number, gain: number) {
  try {
    if (typeof window === "undefined") return;
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(gain, now + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + dur + 0.03);
  } catch {
    /* ignore */
  }
}

const SEL = "a,button,summary,[role=button],.card,.dot,.chip";

export default function SoundUI() {
  useEffect(() => {
    const enabled = () => {
      try {
        return localStorage.getItem("wt_uisound") === "1";
      } catch {
        return false;
      }
    };
    let last: Element | null = null;
    const onOver = (e: PointerEvent) => {
      if (!enabled()) return;
      const el = (e.target as Element)?.closest?.(SEL);
      if (el && el !== last) {
        last = el;
        blip(620, 0.06, 0.022);
      }
    };
    const onOut = () => {
      last = null;
    };
    const onClick = (e: MouseEvent) => {
      if (!enabled()) return;
      const el = (e.target as Element)?.closest?.(SEL);
      if (el) blip(880, 0.09, 0.038);
    };
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("click", onClick, true);
    };
  }, []);
  return null;
}
