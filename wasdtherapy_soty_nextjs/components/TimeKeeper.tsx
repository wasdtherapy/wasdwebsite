"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const CALM = ["/breathe", "/meditate", "/focus", "/sleep", "/sounds", "/zen", "/asmr", "/play"];

export default function TimeKeeper() {
  const pathname = usePathname();
  useEffect(() => {
    if (!CALM.includes(pathname)) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        useStore.getState().addMindful(5);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [pathname]);
  return null;
}
