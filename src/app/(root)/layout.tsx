import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeBootstrap } from "@/components/BrowserEffects";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BuilderPulse",
  description: "Fresh builder and startup signals, translated into usable ideas.",
  alternates: {
    canonical: "/en",
  },
};

export default function RootLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full light`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-background font-sans text-base antialiased"
        suppressHydrationWarning
      >
        <ThemeBootstrap />
        {children}
      </body>
    </html>
  );
}
