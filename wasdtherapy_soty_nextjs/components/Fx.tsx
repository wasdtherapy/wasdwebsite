"use client";
import { useEffect, useRef } from "react";

export default function Fx() {
  const bar = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      if (bar.current) bar.current.style.transform = `scaleX(${Math.max(0, Math.min(1, p))})`;
    };
    const onMove = (e: PointerEvent) => {
      if (spot.current) {
        spot.current.style.setProperty("--mx", e.clientX + "px");
        spot.current.style.setProperty("--my", e.clientY + "px");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return (
    <>
      <div className="scroll-prog" ref={bar} aria-hidden />
      <div className="spotlight" ref={spot} aria-hidden />
    </>
  );
}
