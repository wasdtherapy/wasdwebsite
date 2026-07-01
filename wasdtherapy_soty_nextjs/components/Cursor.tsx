"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover:none)").matches) return;
    const d = dot.current!;
    const r = ring.current!;
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });
    let hot: HTMLElement | null = null;
    const move = (e: PointerEvent) => {
      let x = e.clientX;
      let y = e.clientY;
      if (hot) {
        const b = hot.getBoundingClientRect();
        const cx = b.left + b.width / 2;
        const cy = b.top + b.height / 2;
        x += (cx - x) * 0.28;
        y += (cy - y) * 0.28;
      }
      dx(x); dy(y); rx(x); ry(y);
    };
    const pickHot = (t: EventTarget | null): HTMLElement | null =>
      t instanceof HTMLElement ? (t.closest("a,button,input,summary,[role=button],.card,.chip,.dot") as HTMLElement | null) : null;
    const over = (e: Event) => { const h = pickHot(e.target); if (h) { hot = h; r.classList.add("big"); } };
    const out = (e: Event) => { if (pickHot(e.target)) { hot = null; r.classList.remove("big"); } };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, []);
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden />
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}
