import type { Metadata } from "next";
import { Tektur, Jura, JetBrains_Mono } from "next/font/google";
import { SkinProvider } from "@/components/skins/skin-provider";
import "./globals.css";

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jura = Jura({
  variable: "--font-jura",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cosmic Sudoku - Stellar Calculus",
  description: "Space is not emptiness — it is a system of invisible forces made visible through their effects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${tektur.variable} ${jura.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0E1A]">
        <SkinProvider>{children}</SkinProvider>
      </body>
    </html>
  );
}
