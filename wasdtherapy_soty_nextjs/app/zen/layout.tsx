import type { Metadata } from "next";
import { sectionMeta } from "@/lib/seo";

export const metadata: Metadata = sectionMeta("zen");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
