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