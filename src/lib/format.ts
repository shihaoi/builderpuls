import type { Lang } from "./types";

const LOCALE_MAP: Record<Lang, string> = {
  en: "en-US",
  zh: "zh-CN",
  es: "es-ES",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ar: "ar-SA",
  ru: "ru-RU",
  it: "it-IT",
  ja: "ja-JP",
  ko: "ko-KR",
};

export function formatShortDate(date: string, lang: Lang): string {
  const [y, m, d] = date.split("-").map(Number);
  const locale = LOCALE_MAP[lang];
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

export function formatDisplayDate(date: string, lang: Lang): string {
  const [y, m, d] = date.split("-").map(Number);
  const locale = LOCALE_MAP[lang];
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatSyncedAt(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const locale = LOCALE_MAP[lang];
  return d.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: false,
  });
}
