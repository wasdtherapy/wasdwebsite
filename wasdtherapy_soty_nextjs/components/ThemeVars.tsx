"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function ThemeVars() {
  const palette = useStore((s) => s.palette);
  useEffect(() => { document.documentElement.dataset.pal = palette; }, [palette]);
  return null;
}
