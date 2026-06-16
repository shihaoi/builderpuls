import type { Metadata } from "next";
import type { Lang } from "./types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://builderpulse.ai";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localizedPath(lang: Lang, path = ""): string {
  const cleanPath = path === "/" ? "" : path;
  if (!cleanPath) return `/${lang}`;
  return `/${lang}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
}

export function languageAlternates(path = ""): Record<string, string> {
  return {
    en: absoluteUrl(localizedPath("en", path)),
    zh: absoluteUrl(localizedPath("zh", path)),
    "x-default": absoluteUrl(localizedPath("zh", path)),
  };
}

export function pageMetadata({
  lang,
  path = "",
  title,
  description,
  type = "website",
}: {
  lang: Lang;
  path?: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const canonical = absoluteUrl(localizedPath(lang, path));

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      siteName: "BuilderPulse",
      locale: lang === "zh" ? "zh_CN" : "en_US",
      alternateLocale: lang === "zh" ? ["en_US"] : ["zh_CN"],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
