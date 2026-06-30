"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [hide, setHide] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("wt_preloaded")) {
      setDone(true);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 600 : 2200;
    const start = performance.now();
    let raf = 0;
    document.body.style.overflow = "hidden";
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("wt_preloaded", "1");
        setHide(true);
        document.body.style.overflow = "";
        setTimeout(() => setDone(true), 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;
  return (
    <div className={`pre ${hide ? "pre-out" : ""}`} aria-hidden="true">
      <div className="pre-orb"><i /><i /><i /></div>
      <div className="pre-word">wasd<span>/</span>therapy</div>
      <div className="pre-n">{String(n).padStart(3, "0")}</div>
      <div className="pre-bar"><b style={{ width: `${n}%` }} /></div>
    </div>
  );
}
