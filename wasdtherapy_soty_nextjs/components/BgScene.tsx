"use client";
import dynamic from "next/dynamic";

// Lazy-load the heavy three.js scene on the client only.
// Keeps three.js out of the initial bundle for a faster first paint.
const Scene = dynamic(() => import("./Scene"), { ssr: false, loading: () => null });

export default function BgScene() {
  return <Scene />;
}
