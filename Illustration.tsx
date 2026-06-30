"use client";
import { useEffect, useRef, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition({ children }: { children: ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const el = curtain.current!;
    gsap.fromTo(el, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.6, ease: "power2.out" });
  }, [pathname]);
  return (
    <>
      {children}
      <div ref={curtain} className="curtain" aria-hidden />
    </>
  );
}
