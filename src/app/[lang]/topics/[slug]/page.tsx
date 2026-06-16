import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPage, TextLinkCard } from "@/components/SeoPage";
import {
  getManifest,
  getReportsForTopic,
  getTopic,
  LANGS,
  TOPICS,
} from "@/lib/content";
import { formatDisplayDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/types";

export function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    TOPICS.map((topic) => ({ lang, slug: topic.slug })),
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
  const topic = getTopic(slug);
  if (!topic) return {};

  return pageMetadata({
    lang,
    path: `/topics/${slug}`,
    title: `${topic.label[lang]} · BuilderPulse`,
    description: topic.description[lang],
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: langParam, slug } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const manifest = getManifest();
  const reports = getReportsForTopic(lang, slug);

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      activeTab="topics"
      eyebrow={lang === "zh" ? "Topic" : "Topic"}
      title={topic.label[lang]}
      description={topic.description[lang]}
    >
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
          {lang === "zh" ? "相关简报" : "Related Briefs"}
        </h2>
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {reports.length}
        </span>
      </div>

      {reports.length > 0 ? (
        reports.map((report) => (
          <TextLinkCard
            key={report.date}
            href={`/${lang}/${report.date}`}
            title={report.buildIdea || report.title}
            description={report.summary}
            meta={formatDisplayDate(report.date, lang)}
          />
        ))
      ) : (
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
          {lang === "zh"
            ? "这个主题暂时还没有匹配到简报。"
            : "No briefs match this topic yet."}
        </p>
      )}
    </SeoPage>
  );
}
