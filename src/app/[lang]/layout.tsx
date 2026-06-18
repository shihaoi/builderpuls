import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { ClarityAnalytics, ThemeBootstrap } from "@/components/BrowserEffects";
import type { Lang } from "@/lib/types";
import { UI } from "@/lib/i18n";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import "../globals.css";

const LANGS: Lang[] = ["en", "zh"];

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

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) return {};

  const t = UI[lang as Lang];
  return {
    metadataBase: new URL(SITE_URL),
    ...pageMetadata({
      lang: lang as Lang,
      title: t.siteName,
      description: t.tagline,
    }),
    title: {
      default: t.siteName,
      template: `%s · ${t.siteName}`,
    },
    icons: {
      icon: [
        { url: "/logo.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: "/apple-icon.png",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${jetbrainsMono.variable} h-full light`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background font-sans text-base antialiased"
        suppressHydrationWarning
      >
        <ThemeBootstrap />
        {children}
        <ClarityAnalytics />
      </body>
    </html>
  );
}
