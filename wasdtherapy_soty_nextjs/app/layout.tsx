import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Scene from "@/components/Scene";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import AudioBar from "@/components/AudioBar";
import Persistence from "@/components/Persistence";
import ThemeVars from "@/components/ThemeVars";
import PageTransition from "@/components/PageTransition";

const sans = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "wasd/therapy — пространство спокойствия",
  description: "Дыхание, генеративные звуки, фокус и медитация. Бесплатно, без рекламы и регистрации.",
};

export const viewport: Viewport = { themeColor: "#06070d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Persistence />
        <ThemeVars />
        <div className="bg-scene"><Scene /></div>
        <div className="grain" aria-hidden />
        <div className="vignette" aria-hidden />
        <Cursor />
        <Nav />
        <PageTransition>
          <main className="main">{children}</main>
        </PageTransition>
        <AudioBar />
      </body>
    </html>
  );
}
