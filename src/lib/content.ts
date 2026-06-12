import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { Lang, Manifest, ReportMeta, TocItem } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const MANIFEST_PATH = path.join(CONTENT_DIR, "manifest.json");

function readManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {
      syncedAt: null,
      source: "https://github.com/BuilderPulse/BuilderPulse",
      latest: { en: null, zh: null },
      reports: [],
      files: {},
    };
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

export function getManifest(): Manifest {
  return readManifest();
}

export function getReports(lang: Lang): ReportMeta[] {
  const manifest = readManifest();
  return manifest.reports
    .filter((r) => r.lang === lang)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getLatestDate(lang: Lang): string | null {
  const manifest = readManifest();
  return manifest.latest[lang];
}

export function getReport(lang: Lang, date: string): ReportMeta | null {
  const reports = getReports(lang);
  return reports.find((r) => r.date === date) ?? null;
}

export function getReportContent(lang: Lang, date: string): string | null {
  const filePath = path.join(CONTENT_DIR, lang, "2026", `${date}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

export function getAllReportDates(lang: Lang): string[] {
  return getReports(lang).map((r) => r.date);
}

export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const slugger = new GithubSlugger();
  const lines = markdown.split("\n");

  for (const line of lines) {
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);

    if (h2) {
      const text = h2[1].replace(/[🔗🔍📝🎯]/gu, "").trim();
      items.push({ id: slugger.slug(text), text, level: 2 });
    } else if (h3) {
      const text = h3[1].trim();
      items.push({ id: slugger.slug(text), text, level: 3 });
    }
  }

  return items;
}

export function groupReportsByMonth(
  reports: ReportMeta[],
  lang: Lang,
): { label: string; reports: ReportMeta[] }[] {
  const groups = new Map<string, ReportMeta[]>();

  for (const report of reports) {
    const [year, month] = report.date.split("-");
    const key = `${year}-${month}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(report);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, items]) => {
      const [, month] = key.split("-").map(Number);
      const label =
        lang === "zh"
          ? `${key.split("-")[0]} 年 ${month} 月`
          : new Date(2026, month - 1, 1).toLocaleString("en", {
              month: "long",
              year: "numeric",
            });
      return { label, reports: items };
    });
}