import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope, Spectral, JetBrains_Mono } from "next/font/google";
import Scene from "@/components/Scene";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import Fx from "@/components/Fx";
import AudioBar from "@/components/AudioBar";
import Persistence from "@/components/Persistence";
import ThemeVars from "@/components/ThemeVars";
import PageTransition from "@/components/PageTransition";
import PWA from "@/components/PWA";
import TimeKeeper from "@/components/TimeKeeper";
import Onboarding from "@/components/Onboarding";
import CommandPalette from "@/components/CommandPalette";

const sans = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });
const display = Spectral({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "wasd/therapy — пространство спокойствия",
  description: "Дыхание, генеративные звуки, фокус и медитация. Бесплатно, без рекламы и регистрации.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "wasd/therapy" },
};

export const viewport: Viewport = { themeColor: "#06070d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <Persistence />
        <PWA />
        <TimeKeeper />
        <ThemeVars />
        <div className="bg-scene"><Scene /></div>
        <div className="aurora" aria-hidden><i /><i /><i /></div>
        <div className="grain" aria-hidden />
        <div className="vignette" aria-hidden />
        <Cursor />
        <Fx />
        <Nav />
        <PageTransition>
          <main className="main">{children}</main>
        </PageTransition>
        <AudioBar />
        <Onboarding />
        <CommandPalette />
      </body>
    </html>
  );
}
