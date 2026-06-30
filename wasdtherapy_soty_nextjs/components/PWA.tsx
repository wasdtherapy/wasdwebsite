"use client";
import { useEffect } from "react";

export default function PWA() {
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      const reg = () => { navigator.serviceWorker.register("/sw.js").catch(() => {}); };
      if (document.readyState === "complete") reg();
      else window.addEventListener("load", reg);
    }
  }, []);
  return null;
}
