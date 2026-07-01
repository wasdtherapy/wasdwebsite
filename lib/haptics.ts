// Haptic feedback via the Vibration API. No-op when unsupported (e.g. iOS Safari).
export function hapticsSupported() {
  try {
    return typeof navigator !== "undefined" && "vibrate" in navigator;
  } catch {
    return false;
  }
}

export function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}

// Distinct cues for breathing phases.
export function breathHaptic(phase: "in" | "hold" | "out") {
  if (phase === "in") vibrate([0, 18, 40, 12]);
  else if (phase === "hold") vibrate(8);
  else vibrate([0, 40]);
}

export function tapHaptic() {
  vibrate(10);
}
