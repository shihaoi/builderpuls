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

const DESCRIPTION_LIMIT: Record<Lang, number> = {
  en: 145,
  zh: 90,
};

const DESCRIPTION_FALLBACK: Record<Lang, string> = {
  en: "BuilderPulse is a daily opportunity brief for indie hackers and MicroSaaS founders, tracking AI, developer tools, open-source, and builder market signals.",
  zh: "BuilderPulse 是给独立开发者和 MicroSaaS 创始人的每日机会简报，追踪 AI、开发者工具、开源和构建者市场信号。",
};

function cleanDescription(description: string, lang: Lang): string {
  const clean = description
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const text = clean || DESCRIPTION_FALLBACK[lang];
  const limit = DESCRIPTION_LIMIT[lang];
  const chars = Array.from(text);

  if (chars.length <= limit) return text;

  return `${chars
    .slice(0, limit - 3)
    .join("")
    .replace(/[\s,.;:，。；：、-]+$/u, "")}...`;
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
  const metaDescription = cleanDescription(description, lang);

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description: metaDescription,
      url: canonical,
      type,
      siteName: "BuilderPulse",
      locale: lang === "zh" ? "zh_CN" : "en_US",
      alternateLocale: lang === "zh" ? ["en_US"] : ["zh_CN"],
    },
    twitter: {
      card: "summary",
      title,
      description: metaDescription,
    },
  };
}

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
