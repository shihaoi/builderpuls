import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { ArchiveSidebar } from "@/components/ArchiveSidebar";
import { FadeIn } from "@/components/FadeIn";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
        <main className="mx-auto flex max-w-[1440px] flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
          <h1 className="text-2xl font-semibold text-foreground">
            {t.noContent}
          </h1>
          <p className="mt-2 text-text-secondary">{t.runSync}</p>
        </main>
        <Footer lang={lang} syncedAt={manifest.syncedAt} />
      </>
    );
  }

  return (
    <>
      <Header lang={lang} alternateDate={latest.date} />

      <main className="flex-1">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <ArchiveSidebar
            groups={groupReportsByMonth(reports, lang)}
            lang={lang}
            activeDate={latest.date}
            title={t.archive}
            totalCount={reports.length}
          />

          <div className="min-w-0">
            <FadeIn>
              <section className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div>
                  <p className="font-mono text-xs text-accent">
                    {formatDisplayDate(latest.date, lang)}
                  </p>
                  <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
                    {latest.buildIdea || latest.title}
                  </h1>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
                    {t.tagline}
                  </p>
                  <Link
                    href={`/${lang}/${latest.date}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]"
                  >
                    {t.readReport}
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>

                {latest.summary && (
                  <div className="rounded-xl border border-border bg-surface p-5 lg:mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {t.whyNow}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      {latest.summary}
                    </p>
                  </div>
                )}
              </section>
            </FadeIn>

            <section id="archive" className="pt-10">
              <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {t.allReports}
                </h2>
                <span className="font-mono text-xs text-text-muted">
                  {reports.length} {t.reports}
                </span>
              </div>

              <div className="space-y-8">
                {grouped.map((group) => (
                  <div key={group.label}>
                    <p className="mb-3 font-mono text-xs text-text-muted">
                      {group.label}
                    </p>
                    <div className="divide-y divide-border rounded-xl border border-border bg-surface px-4">
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
          </div>
        </div>
      </main>

      <Footer lang={lang} syncedAt={manifest.syncedAt} />
    </>
  );
}