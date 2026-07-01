import type { Metadata } from "next";
import { sectionMeta } from "@/lib/seo";

export const metadata: Metadata = sectionMeta("breathe");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
