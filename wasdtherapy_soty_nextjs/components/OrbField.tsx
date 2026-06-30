"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore, Palette } from "@/lib/store";
import { vertexShader, fragmentShader } from "@/components/shaders/orb";

const PALETTES: Record<Palette, [string, string]> = {
  aurora: ["#7cf6c8", "#7aa2ff"],
  nebula: ["#ff8bd0", "#a06bff"],
  abyss: ["#6fe3ff", "#5b8cff"],
  ember: ["#ffd27a", "#ff8f5b"],
  bio: ["#b6ff7a", "#5bff9f"],
};

export default function OrbField() {
  const mesh = useRef<THREE.Mesh>(null!);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLevel: { value: 0 },
      uColorA: { value: new THREE.Color(PALETTES.aurora[0]) },
      uColorB: { value: new THREE.Color(PALETTES.aurora[1]) },
    }),
    []
  );
  useFrame((_, dt) => {
    const { audioLevel, palette } = useStore.getState();
    uniforms.uTime.value += dt;
    uniforms.uLevel.value += (audioLevel - uniforms.uLevel.value) * 0.08;
    const [a, b] = PALETTES[palette] ?? PALETTES.aurora;
    uniforms.uColorA.value.lerp(new THREE.Color(a), 0.05);
    uniforms.uColorB.value.lerp(new THREE.Color(b), 0.05);
    if (mesh.current) {
      mesh.current.rotation.y += dt * 0.06;
      mesh.current.rotation.x += dt * 0.02;
    }
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.4, 48]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
