import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoPage, TextLinkCard } from "@/components/SeoPage";
import {
  getArchivePeriods,
  getManifest,
  getReports,
  LANGS,
} from "@/lib/content";
import { formatDisplayDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as Lang)) return {};
  const lang = langParam as Lang;

  return pageMetadata({
    lang,
    path: "/archive",
    title: lang === "zh" ? "BuilderPulse 归档" : "BuilderPulse Archive",
    description:
      lang === "zh"
        ? "按月份浏览 BuilderPulse 每日机会简报，回看 AI、开发者工具和 MicroSaaS 构建信号。"
        : "Browse BuilderPulse daily opportunity briefs by month across AI, developer tools, and MicroSaaS signals.",
  });
}

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const manifest = getManifest();
  const periods = getArchivePeriods(lang);
  const reports = getReports(lang);

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      activeTab="archive"
      eyebrow={lang === "zh" ? "Archive" : "Archive"}
      title={lang === "zh" ? "每日机会简报归档" : "Daily Opportunity Archive"}
      description={
        lang === "zh"
          ? "从日期流进入历史机会库。每份简报都围绕一个 build idea、一个为什么是现在，以及背后的公共信号。"
          : "Enter the historical opportunity library by date. Each brief centers one build idea, why it matters now, and the public signals behind it."
      }
    >
      <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
        <aside className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)] lg:self-start">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
            {lang === "zh" ? "月份" : "Months"}
          </h2>
          <div className="mt-3 space-y-1">
            {periods.map((period) => (
              <Link
                key={period.key}
                href={`/${lang}/archive/${period.key}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-600/5 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-200/5 dark:hover:text-gray-200"
              >
                <span>{period.label}</span>
                <span className="font-mono text-xs text-gray-400">
                  {period.reports.length}
                </span>
              </Link>
            ))}
          </div>
        </aside>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
              {lang === "zh" ? "最新简报" : "Latest Briefs"}
            </h2>
            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
              {reports.length}
            </span>
          </div>
          <div>
            {reports.map((report) => (
              <TextLinkCard
                key={report.date}
                href={`/${lang}/${report.date}`}
                title={report.buildIdea || report.title}
                description={report.summary}
                meta={formatDisplayDate(report.date, lang)}
              />
            ))}
          </div>
        </section>
      </div>
    </SeoPage>
  );
}
