// Device-tier detection so the heavy 3D scene never janks weak phones,
// and so we fully respect prefers-reduced-motion (calm-tech must not induce
// motion sickness). All checks are client-side and defensively guarded.

export type Quality = { particles: number; dpr: [number, number]; enable3d: boolean };

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function detectQuality(): Quality {
  if (typeof window === "undefined") return { particles: 0, dpr: [1, 1], enable3d: false };
  const nav: any = navigator;
  const saveData = !!(nav.connection && nav.connection.saveData);
  if (prefersReducedMotion() || saveData) return { particles: 0, dpr: [1, 1], enable3d: false };
  const mem = nav.deviceMemory || 8;
  const cores = nav.hardwareConcurrency || 8;
  const coarse = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  const low = mem <= 4 || cores <= 4;
  if (coarse && low) return { particles: 180, dpr: [1, 1.5], enable3d: true };
  if (coarse) return { particles: 350, dpr: [1, 1.8], enable3d: true };
  if (low) return { particles: 450, dpr: [1, 1.8], enable3d: true };
  return { particles: 900, dpr: [1, 2], enable3d: true };
}
