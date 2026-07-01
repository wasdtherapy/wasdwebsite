"use client";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

export default function Zen() {
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
    const stones: { x: number; y: number; r: number }[] = [];
    const drawStone = (s: { x: number; y: number; r: number }) => {
      const grad = ctx.createRadialGradient(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.2, s.x, s.y, s.r);
      grad.addColorStop(0, "#aeb6c8");
      grad.addColorStop(1, "#3a4154");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    };
    const paintBase = () => {
      ctx.fillStyle = "#0b0e1a";
      ctx.fillRect(0, 0, w, h);
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(255,255,255,0.045)");
      g.addColorStop(1, "rgba(255,255,255,0.015)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      stones.forEach(drawStone);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintBase();
    };
    let drawing = false, lx = 0, ly = 0;
    const teeth = 7;
    const pos = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const down = (e: PointerEvent) => { drawing = true; const p = pos(e); lx = p.x; ly = p.y; };
    const move = (e: PointerEvent) => {
      if (!drawing) return;
      const p = pos(e);
      const dx = p.x - lx, dy = p.y - ly;
      const len = Math.hypot(dx, dy);
      if (len < 2) return;
      const nx = -dy / len, ny = dx / len;
      ctx.lineWidth = 1;
      for (let i = 0; i < teeth; i++) {
        const off = (i - (teeth - 1) / 2) * 4;
        ctx.strokeStyle = i % 2 === 0 ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.2)";
        ctx.beginPath();
        ctx.moveTo(lx + nx * off, ly + ny * off);
        ctx.lineTo(p.x + nx * off, p.y + ny * off);
        ctx.stroke();
      }
      lx = p.x; ly = p.y;
    };
    const up = () => { drawing = false; };
    const dbl = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); stones.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 14 + Math.random() * 16 }); paintBase(); };
    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    canvas.addEventListener("dblclick", dbl);
    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      canvas.removeEventListener("dblclick", dbl);
    };
  }, []);

  return (
    <section className="tool">
      <h1>{t("Дзен-сад", "Zen garden")}</h1>
      <p className="sub">{t("Проводи по песку, чтобы рисовать узоры граблями. Двойной клик — положить камень.", "Drag across the sand to rake patterns. Double-click to place a stone.")}</p>
      <canvas ref={canvasRef} className="zen-canvas" />
      <div className="note">{t("Нет цели и правил. Просто веди линии и смотри, как разум затихает.", "No goal, no rules. Just trace lines and watch the mind settle.")}</div>
    </section>
  );
}
