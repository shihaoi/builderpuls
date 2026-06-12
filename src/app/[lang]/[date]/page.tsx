import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { ArchiveSidebar } from "@/components/ArchiveSidebar";
import { FadeIn } from "@/components/FadeIn";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarkdownContent } from "@/components/MarkdownContent";
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
      <Header lang={lang} alternateDate={date} />

      <main className="flex-1">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)_220px] lg:gap-10">
          <ArchiveSidebar
            groups={groupReportsByMonth(reports, lang)}
            lang={lang}
            activeDate={date}
            title={t.archive}
            totalCount={reports.length}
          />

          <FadeIn className="min-w-0">
            <article>
              <header className="mb-8 border-b border-border pb-6">
                <Link
                  href={`/${lang}`}
                  className="inline-flex items-center gap-1 text-sm text-text-muted transition hover:text-accent lg:hidden"
                >
                  <ArrowLeft size={14} weight="bold" />
                  {t.backHome}
                </Link>
                <time className="mt-3 block font-mono text-xs text-accent lg:mt-0">
                  {formatDisplayDate(date, lang)}
                </time>
                {report.buildIdea && (
                  <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                    {report.buildIdea}
                  </h1>
                )}
                {report.summary && (
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
                    {report.summary}
                  </p>
                )}
              </header>

              <MarkdownContent content={content} />

              <nav className="mt-12 flex items-stretch gap-3 border-t border-border pt-8 lg:hidden">
                {prev ? (
                  <Link
                    href={`/${lang}/${prev.date}`}
                    className="flex-1 rounded-lg border border-border bg-surface p-4 transition hover:border-accent/30 active:scale-[0.98]"
                  >
                    <span className="font-mono text-[11px] text-text-muted">
                      {t.prevDay}
                    </span>
                    <p className="mt-1 text-sm font-medium text-foreground line-clamp-2">
                      {prev.buildIdea || formatDisplayDate(prev.date, lang)}
                    </p>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
                {next ? (
                  <Link
                    href={`/${lang}/${next.date}`}
                    className="flex-1 rounded-lg border border-border bg-surface p-4 text-right transition hover:border-accent/30 active:scale-[0.98]"
                  >
                    <span className="font-mono text-[11px] text-text-muted">
                      {t.nextDay}
                    </span>
                    <p className="mt-1 text-sm font-medium text-foreground line-clamp-2">
                      {next.buildIdea || formatDisplayDate(next.date, lang)}
                    </p>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </nav>
            </article>
          </FadeIn>

          <aside className="hidden lg:block">
            <TableOfContents items={toc} title={t.tableOfContents} />
          </aside>
        </div>
      </main>

      <Footer lang={lang} syncedAt={manifest.syncedAt} />
    </>
  );
}