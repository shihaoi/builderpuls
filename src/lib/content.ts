import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type {
  Lang,
  Manifest,
  ReportMeta,
  ReportSection,
  ReportSectionKey,
  SearchEntry,
  TocItem,
} from "./types";
import { formatDisplayDate } from "./format";

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

function plainMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getSearchEntries(lang: Lang): SearchEntry[] {
  return getReports(lang).map((report) => {
    const content = getReportContent(lang, report.date);

    return {
      date: report.date,
      href: `/${lang}/${report.date}`,
      title: report.buildIdea || report.title || formatDisplayDate(report.date, lang),
      summary: report.summary,
      dateLabel: formatDisplayDate(report.date, lang),
      content: content ? plainMarkdown(content) : "",
    };
  });
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

const MAIN_SECTION_MARKERS: Record<
  Lang,
  Record<Exclude<ReportSectionKey, "signals">, string[]>
> = {
  zh: {
    discovery: ["发现机会"],
    tech: ["技术选型"],
    competitive: ["竞争情报"],
    trends: ["趋势判断"],
    action: ["行动触发"],
  },
  en: {
    discovery: ["Discovery"],
    tech: ["Tech Radar"],
    competitive: ["Competitive Intel"],
    trends: ["Trends"],
    action: ["Action"],
  },
};

const SECTION_ORDER: ReportSectionKey[] = [
  "signals",
  "discovery",
  "tech",
  "competitive",
  "trends",
  "action",
];

function normalizeHeading(text: string): string {
  return text.replace(/[🔗🔍📝🎯]/gu, "").trim();
}

function splitMarkdownByH2(content: string): { heading: string; body: string }[] {
  const chunks: { heading: string; body: string }[] = [];
  const lines = content.split("\n");
  let heading = "";
  let body: string[] = [];

  for (const line of lines) {
    if (/^# [^#]/.test(line)) continue;

    const h2 = line.match(/^## (.+)$/);
    if (h2) {
      if (heading || body.length > 0) {
        chunks.push({ heading, body: body.join("\n").trim() });
      }
      heading = h2[1];
      body = [];
      continue;
    }

    body.push(line);
  }

  if (heading || body.length > 0) {
    chunks.push({ heading, body: body.join("\n").trim() });
  }

  return chunks;
}

function classifyMainSection(
  heading: string,
  lang: Lang,
): Exclude<ReportSectionKey, "signals"> | null {
  const normalized = normalizeHeading(heading);
  for (const [key, names] of Object.entries(MAIN_SECTION_MARKERS[lang])) {
    if (names.includes(normalized)) {
      return key as Exclude<ReportSectionKey, "signals">;
    }
  }
  return null;
}

export function getSectionTitles(
  lang: Lang,
): Record<ReportSectionKey, string> {
  return lang === "zh"
    ? {
        signals: "今日信号",
        discovery: "发现机会",
        tech: "技术选型",
        competitive: "竞争情报",
        trends: "趋势判断",
        action: "行动触发",
      }
    : {
        signals: "Today's Signals",
        discovery: "Discovery",
        tech: "Tech Radar",
        competitive: "Competitive Intel",
        trends: "Trends",
        action: "Action",
      };
}

export function parseReportSections(
  content: string,
  lang: Lang,
): ReportSection[] {
  const chunks = splitMarkdownByH2(content);
  const titles = getSectionTitles(lang);
  const grouped: Partial<Record<ReportSectionKey, string[]>> = {};
  const signalsParts: string[] = [];
  let reachedMainSections = false;

  for (const chunk of chunks) {
    const sectionKey = classifyMainSection(chunk.heading, lang);

    if (sectionKey) {
      reachedMainSections = true;
      if (!grouped[sectionKey]) grouped[sectionKey] = [];
      if (chunk.body) grouped[sectionKey]!.push(chunk.body);
      continue;
    }

    if (!reachedMainSections) {
      const heading = normalizeHeading(chunk.heading);
      signalsParts.push(
        chunk.body
          ? `## ${heading}\n\n${chunk.body}`
          : `## ${heading}`,
      );
    }
  }

  const sections: ReportSection[] = [];

  if (signalsParts.length > 0) {
    sections.push({
      key: "signals",
      id: "signals",
      title: titles.signals,
      content: signalsParts.join("\n\n"),
    });
  }

  for (const key of SECTION_ORDER.slice(1)) {
    const body = grouped[key]?.join("\n\n").trim();
    if (body) {
      sections.push({
        key,
        id: key,
        title: titles[key],
        content: body,
      });
    }
  }

  return sections;
}

export function sectionsToToc(sections: ReportSection[]): TocItem[] {
  return sections.map((section) => ({
    id: section.id,
    text: section.title,
    level: 2 as const,
  }));
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
