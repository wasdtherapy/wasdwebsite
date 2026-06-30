"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import OrbField from "./OrbField";

const CAM = { position: [0, 0, 4] as [number, number, number], fov: 45 };
const GL = { antialias: true, alpha: true };
const STYLE = { position: "absolute" as const, inset: 0 };

export default function Scene() {
  return (
    <Canvas camera={CAM} dpr={[1, 2]} gl={GL} style={STYLE}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={2} />
      <Suspense fallback={null}>
        <OrbField />
      </Suspense>
    </Canvas>
  );
}
