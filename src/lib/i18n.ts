import type { Lang } from "./types";

export const UI: Record<
  Lang,
  {
    siteName: string;
    tagline: string;
    todayBuild: string;
    readReport: string;
    archive: string;
    latest: string;
    allReports: string;
    tableOfContents: string;
    prevDay: string;
    nextDay: string;
    backHome: string;
    syncedAt: string;
    source: string;
    noContent: string;
    runSync: string;
    langSwitch: string;
    reports: string;
    whyNow: string;
    tabRead: string;
    tabArchive: string;
    tabTopics: string;
    tabBuildIdeas: string;
    tabFor: string;
    tabMethodology: string;
    tabSource: string;
    searchPlaceholder: string;
    upstreamRepo: string;
    askAssistant: string;
    copyPage: string;
    onThisPage: string;
    footerSource: string;
    footerReader: string;
    footerAuthor: string;
    footerMeta: string;
  }
> = {
  en: {
    siteName: "BuilderPulse",
    tagline:
      "Daily opportunity brief for indie hackers. One build idea. One reason it matters now.",
    todayBuild: "Today's Build",
    readReport: "Read full report",
    archive: "Archive",
    latest: "Latest",
    allReports: "All Reports",
    tableOfContents: "On this page",
    prevDay: "Previous",
    nextDay: "Next",
    backHome: "Home",
    syncedAt: "Last synced",
    source: "Source",
    noContent: "No content yet",
    runSync: "Run pnpm sync to fetch reports from GitHub.",
    langSwitch: "中文",
    reports: "reports",
    whyNow: "Why now",
    tabRead: "Daily Brief",
    tabArchive: "Archive",
    tabTopics: "Topics",
    tabBuildIdeas: "Build Ideas",
    tabFor: "For",
    tabMethodology: "Method",
    tabSource: "Source",
    searchPlaceholder: "Search...",
    upstreamRepo: "BuilderPulse Repo",
    askAssistant: "Ask assistant",
    copyPage: "Copy page",
    onThisPage: "On this page",
    footerSource: "Source",
    footerReader: "Reader",
    footerAuthor: "Author",
    footerMeta: "Meta",
  },
  zh: {
    siteName: "BuilderPulse",
    tagline:
      "独立开发者每日机会简报。一个 build 方向，一个为什么是现在。",
    todayBuild: "今日建议",
    readReport: "阅读完整报告",
    archive: "归档",
    latest: "最新",
    allReports: "全部报告",
    tableOfContents: "本页目录",
    prevDay: "上一篇",
    nextDay: "下一篇",
    backHome: "首页",
    syncedAt: "最近同步",
    source: "数据来源",
    noContent: "暂无内容",
    runSync: "运行 pnpm sync 从 GitHub 拉取报告。",
    langSwitch: "English",
    reports: "篇报告",
    whyNow: "为什么是现在",
    tabRead: "每日简报",
    tabArchive: "归档",
    tabTopics: "主题",
    tabBuildIdeas: "Build Ideas",
    tabFor: "人群",
    tabMethodology: "方法论",
    tabSource: "来源",
    searchPlaceholder: "搜索...",
    upstreamRepo: "上游仓库",
    askAssistant: "询问助手",
    copyPage: "复制页面",
    onThisPage: "在此页面",
    footerSource: "数据来源",
    footerReader: "阅读",
    footerAuthor: "作者",
    footerMeta: "信息",
  },
};

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "zh" : "en";
}
