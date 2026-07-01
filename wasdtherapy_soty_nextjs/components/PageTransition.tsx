"use client";
import { useEffect, useRef, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition({ children }: { children: ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (curtain.current) gsap.fromTo(curtain.current, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.55, ease: "power2.out" });
    if (content.current)
      gsap.fromTo(
        content.current,
        { autoAlpha: 0, y: 26, filter: "blur(8px)", scale: 0.985 },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 0.7, ease: "power3.out", delay: 0.05 }
      );
  }, [pathname]);
  return (
    <>
      <div ref={content} className="pt">{children}</div>
      <div ref={curtain} className="curtain" aria-hidden />
    </>
  );
}
