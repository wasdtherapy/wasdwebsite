"use client";
import { useEffect, useRef, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition({ children }: { children: ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const el = curtain.current!;
    gsap.fromTo(el, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.6, ease: "power2.out" });
    if (content.current) {
      gsap.fromTo(
        content.current,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.04 }
      );
    }
  }, [pathname]);
  return (
    <>
      <div ref={content} className="pt">{children}</div>
      <div ref={curtain} className="curtain" aria-hidden />
    </>
  );
}
