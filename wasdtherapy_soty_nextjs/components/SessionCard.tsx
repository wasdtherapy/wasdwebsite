"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

const COLORS: Record<string, [string, string]> = {
  aurora: ["#84c9b4", "#8aa0d8"],
  nebula: ["#d49ac0", "#9f93cf"],
  abyss: ["#8ec3d8", "#8198c9"],
  ember: ["#e3c293", "#d59f7e"],
  bio: ["#a9c891", "#8cc2a3"],
};

export default function SessionCard() {
  const share = useStore((s) => s.share);
  const setShare = useStore((s) => s.setShare);
  const palette = useStore((s) => s.palette);
  const lang = useStore((s) => s.lang);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [busy, setBusy] = useState(false);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);

  useEffect(() => {
    if (!share) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const W = 1080;
    const H = 1350;
    cv.width = W;
    cv.height = H;
    const pair = COLORS[palette] || COLORS.aurora;
    const c1 = pair[0];
    const c2 = pair[1];

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#06070d");
    bg.addColorStop(1, "#0b0e1a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const cy = 470;
    const glow = ctx.createRadialGradient(cx, cy, 20, cx, cy, 380);
    glow.addColorStop(0, c1);
    glow.addColorStop(0.5, c2);
    glow.addColorStop(1, "rgba(11,14,26,0)");
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 380, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    const core = ctx.createRadialGradient(cx - 40, cy - 50, 20, cx, cy, 190);
    core.addColorStop(0, "#ffffff");
    core.addColorStop(0.3, c1);
    core.addColorStop(1, c2);
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, 190, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.fillStyle = "#eef2ff";
    ctx.font = "700 300px Georgia, serif";
    ctx.fillText(String(share.minutes), cx, 940);

    ctx.fillStyle = "#b9c2da";
    ctx.font = "400 46px Georgia, serif";
    ctx.fillText(share.label, cx, 1010);

    ctx.fillStyle = "#eef2ff";
    ctx.font = "600 54px Arial, sans-serif";
    ctx.fillText("wasd / therapy", cx, 1170);

    ctx.fillStyle = "#8b94ad";
    ctx.font = "400 33px Arial, sans-serif";
    ctx.fillText(t("пространство спокойствия · wasdtherapy.art", "a space to breathe · wasdtherapy.art"), cx, 1232);
    const d = new Date();
    ctx.fillText(d.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" }), cx, 1288);
  }, [share, palette, lang]);

  if (!share) return null;

  const getBlob = (): Promise<Blob | null> =>
    new Promise((res) => {
      const cv = canvasRef.current;
      if (!cv) return res(null);
      cv.toBlob((b) => res(b), "image/png");
    });

  const download = async () => {
    const blob = await getBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wasdtherapy-session.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const shareImg = async () => {
    setBusy(true);
    try {
      const blob = await getBlob();
      if (!blob) return;
      const file = new File([blob], "wasdtherapy-session.png", { type: "image/png" });
      const nav: any = navigator;
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], title: "wasd/therapy", text: t("Моя минутка тишины", "My moment of calm") });
      } else {
        await download();
      }
    } catch {
      /* share cancelled */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sharecard" role="dialog" aria-modal="true">
      <button className="sc-close" onClick={() => setShare(null)} aria-label="close">×</button>
      <div className="sc-title">{t("Твоя минутка тишины ✦", "Your moment of calm ✦")}</div>
      <canvas ref={canvasRef} className="sc-canvas" />
      <div className="sc-actions">
        <button className="v10-btn" onClick={shareImg} disabled={busy}>{t("Поделиться", "Share")}</button>
        <button className="v10-btn ghost" onClick={download}>{t("Скачать", "Download")}</button>
      </div>
    </div>
  );
}
