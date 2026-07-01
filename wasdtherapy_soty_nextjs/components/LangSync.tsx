"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

// Reads ?lang=ru|en once and keeps <html lang> in sync. No useSearchParams,
// so no Suspense boundary is required and static export stays intact.
export default function LangSync() {
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("lang");
      if (q === "ru" || q === "en") setLang(q);
    } catch {
      /* ignore */
    }
  }, [setLang]);
  useEffect(() => {
    try {
      document.documentElement.lang = lang;
    } catch {
      /* ignore */
    }
  }, [lang]);
  return null;
}
