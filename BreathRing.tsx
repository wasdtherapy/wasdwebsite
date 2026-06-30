"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore, Palette } from "@/lib/store";

const NOISE = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const vertexShader = `
uniform float uTime; uniform float uLevel;
varying float vNoise; varying vec3 vNormal; varying vec3 vView;
${NOISE}
void main(){
  float n = snoise(position * 1.1 + vec3(0.0, uTime * 0.18, 0.0));
  float disp = n * (0.16 + uLevel * 0.55);
  vec3 pos = position + normal * disp;
  vNoise = n;
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const fragmentShader = `
precision highp float;
uniform vec3 uColorA; uniform vec3 uColorB; uniform float uLevel;
varying float vNoise; varying vec3 vNormal; varying vec3 vView;
void main(){
  vec3 V = normalize(vView);
  float fres = pow(1.0 - max(dot(V, normalize(vNormal)), 0.0), 2.5);
  vec3 col = mix(uColorA, uColorB, smoothstep(-0.5, 0.6, vNoise));
  col += fres * 0.8;
  col += uLevel * 0.25;
  float alpha = clamp(0.45 + fres + uLevel * 0.3, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}`;

const PALETTES: Record<Palette, [string, string]> = {
  aurora: ["#7cf6c8", "#7aa2ff"],
  nebula: ["#ff8bd0", "#a06bff"],
  abyss: ["#6fe3ff", "#5b8cff"],
  ember: ["#ffd27a", "#ff8f5b"],
  bio: ["#b6ff7a", "#5bff9f"],
};

function OrbField() {
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
    const pair = PALETTES[palette] ?? PALETTES.aurora;
    uniforms.uColorA.value.lerp(new THREE.Color(pair[0]), 0.05);
    uniforms.uColorB.value.lerp(new THREE.Color(pair[1]), 0.05);
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
