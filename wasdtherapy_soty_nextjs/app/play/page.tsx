"use client";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { tap } from "@/lib/play";

type Bubble = { x: number; y: number; r: number; vy: number; vx: number; hue: number; note: number; life: number };
type Burst = { x: number; y: number; r: number; max: number; hue: number };

export default function Play() {
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;
    let last = performance.now();
    let spawnT = 0;
    const bubbles: Bubble[] = [];
    const bursts: Burst[] = [];
    const css = getComputedStyle(document.documentElement);
    const c1 = css.getPropertyValue("--c1").trim() || "#7cf6c8";
    const c2 = css.getPropertyValue("--c2").trim() || "#7aa2ff";
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const spawn = () => {
      const r = 22 + Math.random() * 30;
      bubbles.push({ x: r + Math.random() * (w - 2 * r), y: h + r, r, vy: -(16 + Math.random() * 24), vx: (Math.random() - 0.5) * 10, hue: Math.random(), note: Math.floor(Math.random() * 10), life: 0 });
    };
    const pop = (b: Bubble) => { bursts.push({ x: b.x, y: b.y, r: b.r * 0.6, max: b.r * 2.6, hue: b.hue }); tap(Math.random() < 0.5 ? "pluck" : "bell", b.note); };
    const hitTest = (mx: number, my: number) => {
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (Math.hypot(b.x - mx, b.y - my) <= b.r + 6) { pop(b); bubbles.splice(i, 1); return; }
      }
    };
    const down = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); hitTest(e.clientX - r.left, e.clientY - r.top); };
    canvas.addEventListener("pointerdown", down);
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; spawnT += dt;
      if (spawnT > 0.7 && bubbles.length < 18) { spawnT = 0; spawn(); }
      ctx.clearRect(0, 0, w, h);
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.life += dt; b.y += b.vy * dt; b.x += b.vx * dt + Math.sin(b.life * 1.5) * 0.4;
        if (b.y < -b.r - 10) { bubbles.splice(i, 1); continue; }
        const grad = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.2, b.x, b.y, b.r);
        grad.addColorStop(0, "rgba(255,255,255,0.55)");
        grad.addColorStop(0.45, b.hue < 0.5 ? c1 : c2);
        grad.addColorStop(1, "rgba(255,255,255,0.02)");
        ctx.globalAlpha = 0.85; ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1; ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.stroke();
      }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const p = bursts[i];
        p.r += (p.max - p.r) * Math.min(1, dt * 8);
        const a = 1 - p.r / p.max;
        if (a <= 0.04) { bursts.splice(i, 1); continue; }
        ctx.globalAlpha = a; ctx.lineWidth = 2; ctx.strokeStyle = p.hue < 0.5 ? c1 : c2;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); canvas.removeEventListener("pointerdown", down); };
  }, []);

  return (
    <section className="tool">
      <h1>{t("Игры", "Play")}</h1>
      <p className="sub">{t("Лопай пузырьки — каждый звучит нотой из пентатоники. Нет очков и проигрыша — только приятный отклик.", "Pop the bubbles — each sings a pentatonic note. No score, no losing — just a pleasant response.")}</p>
      <canvas ref={canvasRef} className="play-canvas" />
      <div className="note">{t("Тапай медленно или быстро — мелодия всегда складывается гармонично. Идеально, чтобы разгрузить голову.", "Tap slow or fast — the melody always stays in harmony. Perfect to unload your head.")}</div>
    </section>
  );
}
