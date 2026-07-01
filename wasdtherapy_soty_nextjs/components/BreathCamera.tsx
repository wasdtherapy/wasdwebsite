"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

const HIDDEN = { display: "none" as const };

export default function BreathCamera() {
  const setBreath = useStore((s) => s.setBreathValue);
  const breath = useStore((s) => s.breathValue);
  const lang = useStore((s) => s.lang);
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<"idle" | "asking" | "live" | "error">("idle");

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    setBreath(0);
    setStatus("idle");
  };

  const start = async () => {
    try {
      setStatus("asking");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      const v = videoRef.current;
      const cv = canvasRef.current;
      if (!v || !cv) { setStatus("error"); return; }
      v.srcObject = stream;
      await v.play();
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      if (!ctx) { setStatus("error"); return; }
      setStatus("live");
      let prev: Uint8ClampedArray | null = null;
      const buf: number[] = [];
      const loop = () => {
        try {
          ctx.drawImage(v, 0, 0, 64, 48);
          const data = ctx.getImageData(0, 0, 64, 48).data;
          let diff = 0;
          if (prev) {
            for (let i = 0; i < data.length; i += 16) diff += Math.abs(data[i] - prev[i]);
          }
          prev = data.slice(0);
          buf.push(diff);
          if (buf.length > 40) buf.shift();
          const mn = Math.min(...buf);
          const mx = Math.max(...buf);
          const norm = mx > mn ? (diff - mn) / (mx - mn) : 0;
          setBreath(norm);
        } catch {
          /* ignore frame error */
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => () => stop(), []);

  return (
    <div className="sense">
      <video ref={videoRef} className="sense-cam" muted playsInline aria-hidden />
      <canvas ref={canvasRef} width={64} height={48} style={HIDDEN} aria-hidden />
      <div className="sense-ring-wrap">
        <div className="sense-ring" style={{ transform: `scale(${(0.75 + breath * 0.7).toFixed(3)})` }} />
      </div>
      {status === "idle" && (
        <button className="v10-btn" onClick={start}>{t("Разрешить камеру", "Enable camera")}</button>
      )}
      {status === "asking" && <p className="dim">{t("Запрашиваю доступ…", "Requesting access…")}</p>}
      {status === "live" && (
        <>
          <p className="dim">{t("Дыши спокойно — кольцо следует за движением груди и плеч.", "Breathe calmly — the ring follows your chest and shoulders.")}</p>
          <button className="v10-btn ghost" onClick={stop}>{t("Остановить", "Stop")}</button>
        </>
      )}
      {status === "error" && (
        <p className="dim">{t("Камера недоступна — это опциональная функция, всё остальное работает.", "Camera unavailable — this is optional, everything else works.")}</p>
      )}
    </div>
  );
}
