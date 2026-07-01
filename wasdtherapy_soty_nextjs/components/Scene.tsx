"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useStore, Palette } from "@/lib/store";
import type { Quality } from "@/lib/perf";

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
varying float vNoise; varying vec3 vNormal; varying vec3 vView; varying vec3 vPos;
${NOISE}
float fbm(vec3 p){
  float s = 0.0; float a = 0.5; float f = 1.0;
  for(int i = 0; i < 4; i++){ s += a * snoise(p * f); f *= 2.0; a *= 0.5; }
  return s;
}
void main(){
  float n = fbm(position * 1.3 + vec3(0.0, uTime * 0.16, 0.0));
  float disp = n * (0.18 + uLevel * 0.6);
  vec3 pos = position + normal * disp;
  vNoise = n;
  vPos = pos;
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const fragmentShader = `
precision highp float;
uniform vec3 uColorA; uniform vec3 uColorB; uniform float uLevel; uniform float uTime;
varying float vNoise; varying vec3 vNormal; varying vec3 vView; varying vec3 vPos;
void main(){
  vec3 V = normalize(vView);
  vec3 N = normalize(vNormal);
  float fres = pow(1.0 - max(dot(V, N), 0.0), 2.2);
  float t = smoothstep(-0.6, 0.7, vNoise + sin(uTime * 0.4 + vPos.y * 2.0) * 0.15);
  vec3 col = mix(uColorA, uColorB, t);
  col += fres * (0.45 + 0.3 * sin(uTime * 0.6));
  col += uLevel * 0.1;
  float band = smoothstep(0.85, 1.0, abs(sin(vPos.y * 8.0 + uTime)));
  col += band * 0.06;
  float alpha = clamp(0.34 + fres * 0.6 + uLevel * 0.15, 0.0, 0.9);
  col = min(col, vec3(0.92));
  gl_FragColor = vec4(col, alpha);
}`;

const glowVertex = `
varying vec3 vN; varying vec3 vV;
void main(){
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;
const glowFragment = `
precision highp float;
uniform vec3 uColor;
varying vec3 vN; varying vec3 vV;
void main(){
  float f = pow(1.0 - max(dot(normalize(vV), normalize(vN)), 0.0), 3.0);
  gl_FragColor = vec4(uColor, f * 0.5);
}`;

const PALETTES: Record<Palette, [string, string]> = {
  aurora: ["#84c9b4", "#8aa0d8"],
  nebula: ["#d49ac0", "#9f93cf"],
  abyss: ["#8ec3d8", "#8198c9"],
  ember: ["#e3c293", "#d59f7e"],
  bio: ["#a9c891", "#8cc2a3"],
};

const particleVertex = `
uniform float uTime; uniform float uLevel; uniform vec2 uPointer;
attribute float aSeed;
varying float vA;
void main(){
  vec3 p = position;
  float t = uTime * (0.15 + aSeed * 0.25);
  p.x += sin(t + aSeed * 6.2831) * 0.25;
  p.y += cos(t * 1.1 + aSeed * 6.2831) * 0.25;
  p.z += sin(t * 0.7 + aSeed * 3.1415) * 0.25;
  p.xy += uPointer * (0.3 + uLevel * 0.8);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (2.0 + aSeed * 3.0 + uLevel * 3.5) * (300.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
  vA = 0.22 + aSeed * 0.4 + uLevel * 0.18;
}`;
const particleFragment = `
precision highp float;
uniform vec3 uColor;
varying float vA;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d) * vA;
  gl_FragColor = vec4(uColor, a);
}`;

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = count;
  const geo = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const rr = 1.7 + Math.random() * 1.9;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = rr * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = rr * Math.sin(ph) * Math.sin(th);
      positions[i * 3 + 2] = rr * Math.cos(ph);
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLevel: { value: 0 },
      uColor: { value: new THREE.Color(PALETTES.aurora[0]) },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );
  useFrame((state, dt) => {
    const { audioLevel, palette } = useStore.getState();
    uniforms.uTime.value += dt;
    uniforms.uLevel.value += (audioLevel - uniforms.uLevel.value) * 0.08;
    uniforms.uPointer.value.set(state.pointer.x, state.pointer.y);
    const pair = PALETTES[palette] ?? PALETTES.aurora;
    uniforms.uColor.value.lerp(new THREE.Color(pair[0]), 0.05);
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geo.positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[geo.seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial vertexShader={particleVertex} fragmentShader={particleFragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function OrbField() {
  const group = useRef<THREE.Group>(null!);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLevel: { value: 0 },
      uColorA: { value: new THREE.Color(PALETTES.aurora[0]) },
      uColorB: { value: new THREE.Color(PALETTES.aurora[1]) },
    }),
    []
  );
  const glowU = useMemo(() => ({ uColor: { value: new THREE.Color(PALETTES.aurora[1]) } }), []);
  useFrame((state, dt) => {
    const { audioLevel, palette } = useStore.getState();
    uniforms.uTime.value += dt;
    uniforms.uLevel.value += (audioLevel - uniforms.uLevel.value) * 0.08;
    const pair = PALETTES[palette] ?? PALETTES.aurora;
    uniforms.uColorA.value.lerp(new THREE.Color(pair[0]), 0.05);
    uniforms.uColorB.value.lerp(new THREE.Color(pair[1]), 0.05);
    glowU.uColor.value.lerp(new THREE.Color(pair[1]), 0.05);
    if (group.current) {
      group.current.rotation.y += dt * 0.05;
      const tx = state.pointer.x * 0.45;
      const ty = state.pointer.y * 0.32;
      group.current.rotation.x += (Math.sin(uniforms.uTime.value * 0.2) * 0.18 - ty - group.current.rotation.x) * 0.05;
      group.current.rotation.z += (state.pointer.x * 0.12 - group.current.rotation.z) * 0.04;
      group.current.position.x += (tx - group.current.position.x) * 0.05;
      group.current.position.y += (ty - group.current.position.y) * 0.05;
    }
  });
  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.4, 48]} />
        <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh scale={1.32}>
        <icosahedronGeometry args={[1.4, 16]} />
        <shaderMaterial vertexShader={glowVertex} fragmentShader={glowFragment} uniforms={glowU} transparent depthWrite={false} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

const CAM = { position: [0, 0, 4] as [number, number, number], fov: 45 };
const GL = { antialias: true, alpha: true };
const STYLE = { position: "absolute" as const, inset: 0 };

export default function Scene({ quality }: { quality?: Quality }) {
  const dpr = quality?.dpr ?? [1, 2];
  const count = quality?.particles ?? 600;
  return (
    <Canvas camera={CAM} dpr={dpr} gl={GL} style={STYLE}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={2} />
      <Suspense fallback={null}>
        <OrbField />
        {count > 0 && <Particles count={count} />}
      </Suspense>
    </Canvas>
  );
}
