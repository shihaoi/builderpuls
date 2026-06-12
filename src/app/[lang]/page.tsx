import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { ArchiveSidebar } from "@/components/ArchiveSidebar";
import { DocsShell } from "@/components/DocsShell";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { ReportCard } from "@/components/ReportCard";
import {
  getManifest,
  getReports,
  groupReportsByMonth,
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
  const rest = reports.slice(1);
  const grouped = groupReportsByMonth(rest, lang);

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

  return (
    <>
      <Header
        lang={lang}
        activeTab="read"
        alternateDate={latest.date}
      />

      <div className="pt-[var(--nav-height)]">
        <DocsShell
          sidebar={
            <ArchiveSidebar
              groups={groupReportsByMonth(reports, lang)}
              lang={lang}
              activeDate={latest.date}
              title={t.archive}
              totalCount={reports.length}
            />
          }
        >
          <PageHeader
            eyebrow={t.tabRead}
            title={t.latest}
            copyLabel={t.copyPage}
            showCopy={false}
          />

          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
            {t.tagline}
          </p>

          <section className="mt-10 rounded-xl border border-gray-200 bg-background p-5 dark:border-white/[0.07]">
            <p className="font-mono text-xs text-primary dark:text-primary-light">
              {formatDisplayDate(latest.date, lang)}
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-200">
              {latest.buildIdea || latest.title}
            </h2>
            {latest.summary && (
              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {latest.summary}
              </p>
            )}
            <Link
              href={`/${lang}/${latest.date}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 dark:bg-gray-100 dark:text-gray-900"
            >
              {t.readReport}
              <ArrowRight size={16} weight="bold" />
            </Link>
          </section>

          <section id="archive" className="mt-14">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-200">
              {t.allReports}
            </h2>
            <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
              {reports.length} {t.reports}
            </p>

            <div className="mt-6 space-y-8">
              {grouped.map((group) => (
                <div key={group.label}>
                  <p className="mb-3 pl-1 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {group.label}
                  </p>
                  <div className="rounded-xl border border-gray-200 bg-background px-4 dark:border-white/[0.07]">
                    {group.reports.map((report) => (
                      <ReportCard
                        key={report.date}
                        report={report}
                        lang={lang}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </DocsShell>
      </div>

      <Footer lang={lang} syncedAt={manifest.syncedAt} />
    </>
  );
}