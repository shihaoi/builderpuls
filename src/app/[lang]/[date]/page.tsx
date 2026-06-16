import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveSidebar } from "@/components/ArchiveSidebar";
import { DocsShell } from "@/components/DocsShell";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { HeaderSectionLink } from "@/components/Header";
import { HomeBrief } from "@/components/HomeBrief";
import { PageHeader } from "@/components/PageHeader";
import { TableOfContents } from "@/components/TableOfContents";
import {
  getAllReportDates,
  getBuildIdeaSlug,
  getManifest,
  getReport,
  getReportContent,
  getReportTopics,
  getReports,
  groupReportsByMonth,
  LANGS,
  parseReportSections,
  sectionsToToc,
} from "@/lib/content";
import { formatDisplayDate } from "@/lib/format";
import { UI } from "@/lib/i18n";
import { jsonLd, pageMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/types";

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

  return pageMetadata({
    lang,
    path: `/${date}`,
    title: report.buildIdea || report.title,
    description: report.summary,
    type: "article",
  });
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
  const sections = parseReportSections(content, lang);
  const topics = getReportTopics(report);
  const buildIdeaSlug = getBuildIdeaSlug(report);
  const sectionLinks: HeaderSectionLink[] = sections
    .filter((section) => section.key !== "signals")
    .map((section) => ({ id: section.id, label: section.title }));
  const toc = sectionsToToc(sections);

  return (
    <>
      <Header
        lang={lang}
        activeTab="read"
        alternateDate={date}
        sectionLinks={sectionLinks}
      />

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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: report.buildIdea || report.title,
                description: report.summary,
                datePublished: report.date,
                dateModified: manifest.syncedAt ?? report.date,
                inLanguage: lang === "zh" ? "zh-CN" : "en",
                isPartOf: {
                  "@type": "WebSite",
                  name: "BuilderPulse",
                },
              }),
            }}
          />

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

          {sections.length > 0 ? (
            <HomeBrief sections={sections} lang={lang} />
          ) : (
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              {t.noContent}
            </p>
          )}

          <section className="mt-12 border-t border-gray-100 pt-8 dark:border-white/[0.07]">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
              {lang === "zh" ? "继续探索" : "Keep Exploring"}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/${lang}/build-ideas/${buildIdeaSlug}`}
                className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {lang === "zh" ? "Build idea 页面" : "Build idea page"}
              </Link>
              {topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/${lang}/topics/${topic.slug}`}
                  className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {topic.label[lang]}
                </Link>
              ))}
            </div>
          </section>

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
