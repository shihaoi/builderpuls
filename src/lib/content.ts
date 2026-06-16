import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type {
  BuildIdeaSummary,
  Lang,
  Manifest,
  ReportMeta,
  ReportSection,
  ReportSectionKey,
  SearchEntry,
  TopicDefinition,
  TopicSummary,
  TocItem,
} from "./types";
import { formatDisplayDate } from "./format";

const CONTENT_DIR = path.join(process.cwd(), "content");
const MANIFEST_PATH = path.join(CONTENT_DIR, "manifest.json");

export const LANGS: Lang[] = ["en", "zh"];

export const TOPICS: TopicDefinition[] = [
  {
    slug: "ai-agents",
    label: { en: "AI Agents", zh: "AI Agent" },
    description: {
      en: "Execution, payments, proofs, workflow automation, and risk signals around agentic software.",
      zh: "围绕 AI agent 执行动作、支付、证明、工作流自动化和风险控制的机会信号。",
    },
    keywords: [
      "agent",
      "agents",
      "ai agent",
      "execution proof",
      "代理",
      "工作流",
      "审批",
    ],
  },
  {
    slug: "developer-tools",
    label: { en: "Developer Tools", zh: "开发者工具" },
    description: {
      en: "Signals for tools that help builders ship, debug, secure, measure, and operate software.",
      zh: "帮助构建者发布、调试、安全审查、计量和运营软件的工具机会。",
    },
    keywords: [
      "devtool",
      "coding",
      "cli",
      "developer tool",
      "dev machine",
      "开发者工具",
      "命令行",
    ],
  },
  {
    slug: "microsaas-ideas",
    label: { en: "MicroSaaS Ideas", zh: "MicroSaaS 点子" },
    description: {
      en: "Small, sellable software ideas with a clear buyer, urgency, and first-package shape.",
      zh: "有清晰买家、紧迫性和第一份交付形态的小型可销售软件机会。",
    },
    keywords: [
      "microsaas",
      "micro saas",
      "solo founder",
      "indie hacker",
      "build idea",
      "sellable",
      "独立开发",
      "小型 saas",
      "独立创业",
    ],
  },
  {
    slug: "open-source",
    label: { en: "Open Source Signals", zh: "开源信号" },
    description: {
      en: "Commercial opportunities created by fast-growing repositories, maintainer limits, and adoption gaps.",
      zh: "由快速增长仓库、维护者边界和团队采用缺口带来的商业机会。",
    },
    keywords: [
      "open source",
      "repo",
      "repository",
      "maintainer",
      "stars",
      "license",
      "开源",
      "维护者",
      "仓库",
      "stars",
      "商业版本",
    ],
  },
  {
    slug: "local-ai",
    label: { en: "Local AI", zh: "本地 AI" },
    description: {
      en: "Local models, private workflows, on-device tools, and cloud replacement signals.",
      zh: "本地模型、私有工作流、端侧工具和替代云模型的机会信号。",
    },
    keywords: [
      "local model",
      "local ai",
      "on-device",
      "offline",
      "privacy",
      "qwen",
      "gemma",
      "本地模型",
      "本地 ai",
      "离线",
      "隐私",
      "端侧",
    ],
  },
  {
    slug: "ai-cost-risk",
    label: { en: "AI Cost & Risk", zh: "AI 成本与风险" },
    description: {
      en: "Budget shocks, vendor lock-in, model exits, security receipts, and operational risk checklists.",
      zh: "预算冲击、供应商锁定、模型退出、安全凭证和运营风险清单。",
    },
    keywords: [
      "cost",
      "bill",
      "invoice",
      "pricing",
      "security",
      "risk",
      "vendor",
      "dependency",
      "账单",
      "成本",
      "价格",
      "风险",
      "依赖",
      "供应商",
    ],
  },
];

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

export function plainMarkdown(markdown: string): string {
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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function reportTopicHaystack(report: ReportMeta): string {
  return plainMarkdown(
    `${report.title}\n${report.buildIdea}\n${report.summary}`,
  ).toLowerCase();
}

export function getTopic(slug: string): TopicDefinition | null {
  return TOPICS.find((topic) => topic.slug === slug) ?? null;
}

export function getReportsForTopic(lang: Lang, slug: string): ReportMeta[] {
  const topic = getTopic(slug);
  if (!topic) return [];
  const keywords = topic.keywords.map((keyword) => keyword.toLowerCase());

  return getReports(lang).filter((report) => {
    const haystack = reportTopicHaystack(report);
    return keywords.some((keyword) => haystack.includes(keyword));
  });
}

export function getTopics(lang: Lang): TopicSummary[] {
  return TOPICS.map((topic) => ({
    ...topic,
    reports: getReportsForTopic(lang, topic.slug),
  }));
}

export function getReportTopics(report: ReportMeta): TopicDefinition[] {
  const haystack = reportTopicHaystack(report);
  return TOPICS.filter((topic) =>
    topic.keywords.some((keyword) => haystack.includes(keyword.toLowerCase())),
  );
}

export function getBuildIdeaSlug(report: ReportMeta): string {
  return slugify(report.buildIdea || report.title || report.date);
}

export function getBuildIdeas(lang: Lang): BuildIdeaSummary[] {
  const grouped = new Map<string, ReportMeta[]>();

  for (const report of getReports(lang)) {
    const slug = getBuildIdeaSlug(report);
    if (!grouped.has(slug)) grouped.set(slug, []);
    grouped.get(slug)!.push(report);
  }

  return Array.from(grouped.entries()).map(([slug, reports]) => {
    const primaryReport = reports[0];
    return {
      slug,
      title: primaryReport.buildIdea || primaryReport.title,
      summary: primaryReport.summary,
      reports,
      primaryReport,
    };
  });
}

export function getBuildIdea(lang: Lang, slug: string): BuildIdeaSummary | null {
  return getBuildIdeas(lang).find((idea) => idea.slug === slug) ?? null;
}

export function getArchivePeriods(lang: Lang): {
  key: string;
  label: string;
  reports: ReportMeta[];
}[] {
  return groupReportsByMonth(getReports(lang), lang).map((group) => {
    const first = group.reports[0];
    const key = first.date.slice(0, 7);
    return { key, label: group.label, reports: group.reports };
  });
}

export function getReportsByArchivePeriod(
  lang: Lang,
  period: string,
): ReportMeta[] {
  if (/^\d{4}$/.test(period)) {
    return getReports(lang).filter((report) => report.date.startsWith(period));
  }

  if (/^\d{4}-\d{2}$/.test(period)) {
    return getReports(lang).filter((report) => report.date.startsWith(period));
  }

  return [];
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
