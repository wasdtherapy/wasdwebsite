import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope, Spectral, JetBrains_Mono } from "next/font/google";
import BgScene from "@/components/BgScene";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import Fx from "@/components/Fx";
import AudioBar from "@/components/AudioBar";
import Persistence from "@/components/Persistence";
import ThemeVars from "@/components/ThemeVars";
import PageTransition from "@/components/PageTransition";
import Onboarding from "@/components/Onboarding";
import CommandPalette from "@/components/CommandPalette";
import TimeKeeper from "@/components/TimeKeeper";
import PWA from "@/components/PWA";
import QuickCalm from "@/components/QuickCalm";
import Preloader from "@/components/Preloader";
import SoundUI from "@/components/SoundUI";
import ScrollProgress from "@/components/ScrollProgress";
import LangSync from "@/components/LangSync";
import Screensaver from "@/components/Screensaver";

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
  metadataBase: new URL("https://wasdtherapy.art"),
  alternates: {
    canonical: "/",
    languages: { "ru-RU": "/?lang=ru", "en-US": "/?lang=en" },
  },
  openGraph: {
    title: "wasd/therapy — пространство спокойствия",
    description: "Дыхание, живые звуки, фокус и медитация. Бесплатно, без рекламы и слежки.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "wasd/therapy",
    description: "Пространство, чтобы замедлиться и подышать.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = { themeColor: "#06070d" };

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "wasd/therapy",
  url: "https://wasdtherapy.art",
  description: "Дыхание, живые звуки, фокус и медитация. Бесплатно, без рекламы и слежки.",
  inLanguage: ["ru", "en"],
};
const LD_PROPS = { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(JSONLD) } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">Перейти к содержимому</a>
        <script {...LD_PROPS} />
        <ScrollProgress />
        <LangSync />
        <Preloader />
        <Persistence />
        <ThemeVars />
        <PWA />
        <TimeKeeper />
        <div className="bg-scene"><BgScene /></div>
        <div className="aurora" aria-hidden><i /><i /><i /></div>
        <div className="grain" aria-hidden />
        <div className="vignette" aria-hidden />
        <Cursor />
        <Fx />
        <Nav />
        <PageTransition>
          <main id="main" className="main">{children}</main>
        </PageTransition>
        <AudioBar />
        <Onboarding />
        <CommandPalette />
        <QuickCalm />
        <SoundUI />
        <Screensaver />
      </body>
    </html>
  );
}
