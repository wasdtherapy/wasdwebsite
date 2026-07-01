import type { MetadataRoute } from "next";

const BASE = "https://wasdtherapy.art";
const ROUTES = [
  "", "/breathe", "/focus", "/meditate", "/sleep", "/sounds", "/affirmations",
  "/journal", "/mood", "/zen", "/asmr", "/garden", "/scenarios", "/play",
  "/guide", "/sense", "/about",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r === "" ? 1 : 0.7,
  }));
}
