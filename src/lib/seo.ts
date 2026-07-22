import type { Metadata } from "next";
import type { Lang } from "./types";
import { ALL_LANGS } from "./i18n";

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
  const alternates: Record<string, string> = {};
  for (const lang of ALL_LANGS) {
    alternates[lang] = absoluteUrl(localizedPath(lang, path));
  }
  alternates["x-default"] = absoluteUrl(localizedPath("en", path));
  return alternates;
}

const DEFAULT_OG_IMAGE = absoluteUrl("/og-image.png");

const DESCRIPTION_LIMIT: Record<Lang, number> = {
  en: 145,
  zh: 90,
  es: 155,
  pt: 155,
  fr: 155,
  de: 155,
  ar: 120,
  ru: 140,
  it: 155,
  ja: 100,
  ko: 100,
};

const DESCRIPTION_FALLBACK: Record<Lang, string> = {
  en: "BuilderPulse is a daily opportunity brief for indie hackers and MicroSaaS founders, tracking AI, developer tools, open-source, and builder market signals.",
  zh: "BuilderPulse 是给独立开发者和 MicroSaaS 创始人的每日机会简报，追踪 AI、开发者工具、开源和构建者市场信号。",
  es: "BuilderPulse es un informe diario de oportunidades para indie hackers y fundadores de MicroSaaS, rastreando IA, herramientas de desarrollo, código abierto y señales del mercado.",
  pt: "BuilderPulse é um briefing diário de oportunidades para indie hackers e fundadores de MicroSaaS, rastreando IA, ferramentas de desenvolvimento, código aberto e sinais do mercado.",
  fr: "BuilderPulse est un brief quotidien d'opportunités pour les indie hackers et les fondateurs de MicroSaaS, suivant l'IA, les outils de développement, l'open source et les signaux du marché.",
  de: "BuilderPulse ist ein tägliches Chancen-Briefing für Indie-Hacker und MicroSaaS-Gründer, das KI, Entwickler-Tools, Open Source und Marktsignale verfolgt.",
  ar: "BuilderPulse هو موجز يومي للفرص للمطورين المستقلين ومؤسسي MicroSaaS، يتتبع الذكاء الاصطناعي وأدوات التطوير والمصادر المفتوحة وإشارات السوق.",
  ru: "BuilderPulse — ежедневный брифинг возможностей для инди-хакеров и основателей MicroSaaS, отслеживающий ИИ, инструменты разработки, открытый код и рыночные сигналы.",
  it: "BuilderPulse è un briefing giornaliero di opportunità per indie hacker e fondatori di MicroSaaS, che traccia IA, strumenti di sviluppo, open source e segnali di mercato.",
  ja: "BuilderPulseはインディーハッカーとMicroSaaS創業者のための毎日の機会ブリーフィングで、AI、開発ツール、オープンソース、市場シグナルを追跡します。",
  ko: "BuilderPulse는 인디 해커와 MicroSaaS 창업자를 위한 매일의 기회 브리핑으로, AI, 개발 도구, 오픈소스, 시장 신호를 추적합니다.",
};

const OG_LOCALE: Record<Lang, string> = {
  en: "en_US",
  zh: "zh_CN",
  es: "es_ES",
  pt: "pt_BR",
  fr: "fr_FR",
  de: "de_DE",
  ar: "ar_SA",
  ru: "ru_RU",
  it: "it_IT",
  ja: "ja_JP",
  ko: "ko_KR",
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
  const locale = OG_LOCALE[lang];
  const alternateLocales = ALL_LANGS.filter((l) => l !== lang).map(
    (l) => OG_LOCALE[l],
  );

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
      locale,
      alternateLocale: alternateLocales,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "BuilderPulse daily opportunity brief",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
