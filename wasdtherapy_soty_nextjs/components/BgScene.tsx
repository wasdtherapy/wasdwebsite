"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { detectQuality, type Quality } from "@/lib/perf";

// Lazy-load the heavy three.js scene on the client only. Keeps three.js out of
// the initial bundle for a faster first paint, and skips it entirely for users
// who prefer reduced motion or are on data-saver / very weak devices.
const Scene = dynamic(() => import("./Scene"), { ssr: false, loading: () => null });

export default function BgScene() {
  const [q, setQ] = useState<Quality | null>(null);
  useEffect(() => { setQ(detectQuality()); }, []);
  if (!q || !q.enable3d) return null;
  return <Scene quality={q} />;
}
