export type Lang = "en" | "zh";

export interface ReportMeta {
  sha: string;
  lang: Lang;
  year: string;
  date: string;
  title: string;
  buildIdea: string;
  summary: string;
  size: number;
}

export interface Manifest {
  syncedAt: string | null;
  source: string;
  latest: Record<Lang, string | null>;
  reports: ReportMeta[];
  files: Record<string, ReportMeta & { sha: string }>;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export type ReportSectionKey =
  | "signals"
  | "discovery"
  | "tech"
  | "competitive"
  | "trends"
  | "action";

export interface ReportSection {
  key: ReportSectionKey;
  id: string;
  title: string;
  content: string;
}

export interface SearchEntry {
  date: string;
  href: string;
  title: string;
  summary: string;
  dateLabel: string;
  content: string;
}

export interface TopicDefinition {
  slug: string;
  label: Record<Lang, string>;
  description: Record<Lang, string>;
  keywords: string[];
}

export interface TopicSummary extends TopicDefinition {
  reports: ReportMeta[];
}

export interface BuildIdeaSummary {
  slug: string;
  title: string;
  summary: string;
  reports: ReportMeta[];
  primaryReport: ReportMeta;
}

export interface PersonaDefinition {
  slug: string;
  label: Record<Lang, string>;
  targetKeyword: Record<Lang, string>;
  description: Record<Lang, string>;
  directAnswer: Record<Lang, string>;
  searchIntent: Record<Lang, string>;
  useCases: Record<Lang, string[]>;
  topicSlugs: string[];
  keywords: string[];
}

export interface PersonaPage extends PersonaDefinition {
  ideas: BuildIdeaSummary[];
  topics: TopicSummary[];
}
