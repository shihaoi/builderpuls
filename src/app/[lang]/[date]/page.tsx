import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { ArchiveSidebar } from "@/components/ArchiveSidebar";
import { DocsShell } from "@/components/DocsShell";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MarkdownContent } from "@/components/MarkdownContent";
import { PageHeader } from "@/components/PageHeader";
import { TableOfContents } from "@/components/TableOfContents";
import {
  extractToc,
  getAllReportDates,
  getManifest,
  getReport,
  getReportContent,
  getReports,
  groupReportsByMonth,
} from "@/lib/content";
import { formatDisplayDate } from "@/lib/format";
import { UI } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

const LANGS: Lang[] = ["en", "zh"];

export async function generateStaticParams() {
  const params: { lang: string; date: string }[] = [];
  for (const lang of LANGS) {
    for (const date of getAllReportDates(lang)) {
      params.push({ lang, date });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; date: string }>;
}) {
  const { lang: langParam, date } = await params;
  if (!LANGS.includes(langParam as Lang)) return {};
  const lang = langParam as Lang;
  const report = getReport(lang, date);
  if (!report) return {};

  return {
    title: report.buildIdea || report.title,
    description: report.summary,
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ lang: string; date: string }>;
}) {
  const { lang: langParam, date } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;

  const report = getReport(lang, date);
  const content = getReportContent(lang, date);
  if (!report || !content) notFound();

  const t = UI[lang];
  const manifest = getManifest();
  const reports = getReports(lang);
  const idx = reports.findIndex((r) => r.date === date);
  const prev = idx < reports.length - 1 ? reports[idx + 1] : null;
  const next = idx > 0 ? reports[idx - 1] : null;
  const toc = extractToc(content);

  return (
    <>
      <Header lang={lang} activeTab="read" alternateDate={date} />

      <div className="pt-[var(--nav-height)] lg:pt-0">
        <DocsShell
          sidebar={
            <ArchiveSidebar
              groups={groupReportsByMonth(reports, lang)}
              lang={lang}
              activeDate={date}
              title={t.archive}
            />
          }
          toc={<TableOfContents items={toc} title={t.onThisPage} />}
        >
          <PageHeader
            eyebrow={t.tabRead}
            title={report.buildIdea || formatDisplayDate(date, lang)}
            copyLabel={t.copyPage}
          />

          {report.summary && (
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
              {report.summary}
            </p>
          )}

          <MarkdownContent id="content" content={content} />

          <nav className="mt-12 flex items-stretch gap-3 border-t border-gray-100 pt-8 dark:border-gray-800/60 lg:hidden">
            {prev ? (
              <Link
                href={`/${lang}/${prev.date}`}
                className="flex-1 rounded-xl border border-gray-200 bg-background p-4 transition hover:bg-gray-600/5 dark:border-white/[0.07] dark:hover:bg-gray-200/5"
              >
                <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                  {t.prevDay}
                </span>
                <p className="mt-1 line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  {prev.buildIdea || formatDisplayDate(prev.date, lang)}
                </p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                href={`/${lang}/${next.date}`}
                className="flex-1 rounded-xl border border-gray-200 bg-background p-4 text-right transition hover:bg-gray-600/5 dark:border-white/[0.07] dark:hover:bg-gray-200/5"
              >
                <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                  {t.nextDay}
                </span>
                <p className="mt-1 line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  {next.buildIdea || formatDisplayDate(next.date, lang)}
                </p>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        </DocsShell>
      </div>

      <Footer lang={lang} syncedAt={manifest.syncedAt} />
    </>
  );
}