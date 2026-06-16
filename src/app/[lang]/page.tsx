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
  getManifest,
  getReportContent,
  getReports,
  groupReportsByMonth,
  parseReportSections,
  sectionsToToc,
} from "@/lib/content";
import { formatDisplayDate } from "@/lib/format";
import { UI } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

const LANGS: Lang[] = ["en", "zh"];

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;

  const t = UI[lang];
  const manifest = getManifest();
  const reports = getReports(lang);
  const latest = reports[0];

  if (reports.length === 0) {
    return (
      <>
        <Header lang={lang} />
        <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
            {t.noContent}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t.runSync}</p>
        </main>
        <Footer lang={lang} syncedAt={manifest.syncedAt} />
      </>
    );
  }

  const content = getReportContent(lang, latest.date);
  const sections = content ? parseReportSections(content, lang) : [];
  const sectionLinks: HeaderSectionLink[] = sections
    .filter((section) => section.key !== "signals")
    .map((section) => ({ id: section.id, label: section.title }));
  const toc = sectionsToToc(sections);

  return (
    <>
      <Header
        lang={lang}
        activeTab="read"
        alternateDate={latest.date}
        sectionLinks={sectionLinks}
      />

      <div className="pt-[var(--nav-height)] lg:pt-0">
        <DocsShell
          sidebar={
            <ArchiveSidebar
              groups={groupReportsByMonth(reports, lang)}
              lang={lang}
              activeDate={latest.date}
              title={t.archive}
            />
          }
          toc={<TableOfContents items={toc} title={t.onThisPage} />}
        >
          <PageHeader
            eyebrow={t.tabRead}
            title={latest.buildIdea || t.latest}
            copyLabel={t.copyPage}
            showCopy={false}
          />

          <p className="mt-2 font-mono text-xs text-primary dark:text-primary-light">
            {formatDisplayDate(latest.date, lang)}
          </p>

          {latest.summary && (
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
              {latest.summary}
            </p>
          )}

          {sections.length > 0 ? (
            <HomeBrief
              sections={sections}
              lang={lang}
              date={latest.date}
              dateLabel={formatDisplayDate(latest.date, lang)}
              readReportLabel={t.readReport}
            />
          ) : (
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              {t.noContent}
            </p>
          )}

        </DocsShell>
      </div>

      <Footer lang={lang} syncedAt={manifest.syncedAt} />
    </>
  );
}
