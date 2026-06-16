import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoPage, TextLinkCard } from "@/components/SeoPage";
import {
  getBuildIdea,
  getBuildIdeas,
  getManifest,
  getReportTopics,
  LANGS,
} from "@/lib/content";
import { formatDisplayDate } from "@/lib/format";
import { jsonLd, pageMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/types";

export function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    getBuildIdeas(lang).map((idea) => ({ lang, slug: idea.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  if (!LANGS.includes(langParam as Lang)) return {};
  const lang = langParam as Lang;
  const idea = getBuildIdea(lang, slug);
  if (!idea) return {};

  return pageMetadata({
    lang,
    path: `/build-ideas/${slug}`,
    title: `${idea.title} · BuilderPulse Build Idea`,
    description: idea.summary,
    type: "article",
  });
}

export default async function BuildIdeaPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: langParam, slug } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const idea = getBuildIdea(lang, slug);
  if (!idea) notFound();

  const manifest = getManifest();
  const topics = getReportTopics(idea.primaryReport);
  const json = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: idea.title,
    description: idea.summary,
    datePublished: idea.primaryReport.date,
    inLanguage: lang === "zh" ? "zh-CN" : "en",
    isPartOf: {
      "@type": "WebSite",
      name: "BuilderPulse",
    },
  };

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      activeTab="buildIdeas"
      eyebrow={lang === "zh" ? "Build Idea" : "Build Idea"}
      title={idea.title}
      description={idea.summary}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(json) }}
      />

      <section className="border-b border-gray-100 pb-8 dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
          {lang === "zh" ? "证据入口" : "Evidence Entry"}
        </h2>
        <Link
          href={`/${lang}/${idea.primaryReport.date}`}
          className="mt-3 inline-flex rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-600/5 dark:border-white/[0.07] dark:text-gray-200 dark:hover:bg-gray-200/5"
        >
          {lang === "zh" ? "阅读原始简报" : "Read the original brief"} ·{" "}
          {formatDisplayDate(idea.primaryReport.date, lang)}
        </Link>
      </section>

      {topics.length > 0 ? (
        <section className="mt-8 border-b border-gray-100 pb-8 dark:border-white/[0.07]">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
            {lang === "zh" ? "相关主题" : "Related Topics"}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
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
      ) : null}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
            {lang === "zh" ? "相关日期页" : "Related Dated Briefs"}
          </h2>
          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {idea.reports.length}
          </span>
        </div>
        {idea.reports.map((report) => (
          <TextLinkCard
            key={report.date}
            href={`/${lang}/${report.date}`}
            title={report.buildIdea || report.title}
            description={report.summary}
            meta={formatDisplayDate(report.date, lang)}
          />
        ))}
      </section>
    </SeoPage>
  );
}
