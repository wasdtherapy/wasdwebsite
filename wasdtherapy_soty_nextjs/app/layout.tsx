import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";

const sans = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "wasdtherapy.art — зашёл и выдохнул",
  description:
    "Генеративный калм-тех приют: дыхание, звуки, фокус, игры. Без регистрации и рекламы.",
  openGraph: { title: "wasdtherapy.art", description: "Зашёл — и выдохнул.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Cursor />
        <Nav />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
