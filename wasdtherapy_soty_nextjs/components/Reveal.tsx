"use client";
import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";

export default function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }
    gsap.set(el, { autoAlpha: 0, y: 24 });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", delay });
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <div ref={ref}>{children}</div>;
}
