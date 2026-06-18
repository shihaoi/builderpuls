import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { notFound } from "next/navigation";
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
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{Array.prototype.slice.call(document.documentElement.attributes).forEach(function(a){if(a.name.indexOf('trancy-')===0)document.documentElement.removeAttribute(a.name)});var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.classList.toggle('light',!d)}catch(e){}})()`}
        </Script>
        {children}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","x7tgtknj61");`}
        </Script>
      </body>
    </html>
  );
}
