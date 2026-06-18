import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
        <Script id="root-theme-init" strategy="beforeInteractive">
          {`(function(){try{Array.prototype.slice.call(document.documentElement.attributes).forEach(function(a){if(a.name.indexOf('trancy-')===0)document.documentElement.removeAttribute(a.name)});var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.classList.toggle('light',!d)}catch(e){}})()`}
        </Script>
        {children}
      </body>
    </html>
  );
}
