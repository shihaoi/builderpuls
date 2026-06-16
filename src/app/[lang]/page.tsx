import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
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
  getBuildIdeas,
  getReportContent,
  getReports,
  getTopics,
  groupReportsByMonth,
  LANGS,
  parseReportSections,
  sectionsToToc,
} from "@/lib/content";
import { formatDisplayDate } from "@/lib/format";
import { UI } from "@/lib/i18n";
import { getPersonaPages } from "@/lib/programmatic";
import { jsonLd, pageMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as Lang)) return {};
  const lang = langParam as Lang;
  const t = UI[lang];

  return pageMetadata({
    lang,
    title: t.siteName,
    description: t.tagline,
  });
}

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
  const topics = getTopics(lang);
  const personas = getPersonaPages(lang);
  const ideas = getBuildIdeas(lang).slice(0, 6);
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "BuilderPulse",
                description: t.tagline,
                inLanguage: lang === "zh" ? "zh-CN" : "en",
              }),
            }}
          />

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

          <section className="mt-14 border-t border-gray-100 pt-8 dark:border-white/[0.07]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                {lang === "zh" ? "主题入口" : "Topic Hubs"}
              </h2>
              <Link
                href={`/${lang}/topics`}
                className="text-sm font-semibold text-gray-900 underline decoration-primary/35 decoration-2 underline-offset-4 hover:decoration-primary dark:text-gray-100 dark:decoration-primary-light/40 dark:hover:decoration-primary-light"
              >
                {lang === "zh" ? "全部主题" : "All topics"}
              </Link>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/${lang}/topics/${topic.slug}`}
                  className="rounded-lg bg-gray-50 px-3 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {topic.label[lang]}
                  <span className="ml-2 font-mono text-xs text-gray-400">
                    {topic.reports.length}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-10 border-t border-gray-100 pt-8 dark:border-white/[0.07]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                {lang === "zh" ? "按人群浏览" : "Browse by Audience"}
              </h2>
              <Link
                href={`/${lang}/for`}
                className="text-sm font-semibold text-gray-900 underline decoration-primary/35 decoration-2 underline-offset-4 hover:decoration-primary dark:text-gray-100 dark:decoration-primary-light/40 dark:hover:decoration-primary-light"
              >
                {lang === "zh" ? "全部人群" : "All audiences"}
              </Link>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {personas.map((persona) => (
                <Link
                  key={persona.slug}
                  href={`/${lang}/for/${persona.slug}`}
                  className="rounded-lg bg-gray-50 px-3 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {persona.label[lang]}
                  <span className="ml-2 font-mono text-xs text-gray-400">
                    {persona.ideas.length}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-10 border-t border-gray-100 pt-8 dark:border-white/[0.07]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                {lang === "zh" ? "最新 Build Ideas" : "Latest Build Ideas"}
              </h2>
              <Link
                href={`/${lang}/build-ideas`}
                className="text-sm font-semibold text-gray-900 underline decoration-primary/35 decoration-2 underline-offset-4 hover:decoration-primary dark:text-gray-100 dark:decoration-primary-light/40 dark:hover:decoration-primary-light"
              >
                {lang === "zh" ? "全部点子" : "All ideas"}
              </Link>
            </div>
            <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800/60">
              {ideas.map((idea) => (
                <Link
                  key={idea.slug}
                  href={`/${lang}/build-ideas/${idea.slug}`}
                  className="block py-3 text-sm font-medium text-gray-800 transition hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
                >
                  {idea.title}
                </Link>
              ))}
            </div>
          </section>
        </DocsShell>
      </div>

      <Footer lang={lang} syncedAt={manifest.syncedAt} />
    </>
  );
}
