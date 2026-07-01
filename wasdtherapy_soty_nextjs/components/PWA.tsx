"use client";
import { useEffect } from "react";

export default function PWA() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const reg = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
      if (document.readyState === "complete") reg();
      else window.addEventListener("load", reg, { once: true });
    }
  }, []);
  return null;
}
