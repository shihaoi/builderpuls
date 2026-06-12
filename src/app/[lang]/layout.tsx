import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Lang } from "@/lib/types";
import { UI } from "@/lib/i18n";

const LANGS: Lang[] = ["en", "zh"];

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
    title: {
      default: t.siteName,
      template: `%s · ${t.siteName}`,
    },
    description: t.tagline,
    openGraph: {
      title: t.siteName,
      description: t.tagline,
      type: "website",
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

  return <div lang={lang}>{children}</div>;
}