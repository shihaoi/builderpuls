import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPage } from "@/components/SeoPage";
import { getManifest, LANGS } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/types";

const SOURCES = [
  "Hacker News",
  "GitHub Trending",
  "Product Hunt",
  "HuggingFace",
  "Google Trends",
  "Reddit",
  "Indie Hackers",
  "Lobsters",
  "DEV Community",
];

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
    path: "/sources",
    title: lang === "zh" ? "BuilderPulse 信号来源" : "BuilderPulse Sources",
    description:
      lang === "zh"
        ? "BuilderPulse 每日机会简报使用的公共信号来源和内容来源说明。"
        : "Public signal sources and content provenance for BuilderPulse daily opportunity briefs.",
  });
}

export default async function SourcesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const manifest = getManifest();

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      activeTab="source"
      eyebrow={lang === "zh" ? "Sources" : "Sources"}
      title={lang === "zh" ? "信号来源与内容来源" : "Signals and Provenance"}
      description={
        lang === "zh"
          ? "本站是 BuilderPulse 内容的阅读器和 SEO 结构层。报告内容来自上游仓库，页面结构用于帮助读者按日期、主题和 build idea 浏览。"
          : "This site is a reader and SEO structure layer for BuilderPulse content. Reports come from the upstream repository and are organized by date, topic, and build idea."
      }
    >
      <section className="border-b border-gray-100 pb-8 dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
          {lang === "zh" ? "公共信号源" : "Public Signal Sources"}
        </h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {SOURCES.map((source) => (
            <div
              key={source}
              className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800/60 dark:text-gray-300"
            >
              {source}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
          {lang === "zh" ? "内容来源" : "Content Source"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {lang === "zh"
            ? "所有日报内容同步自 BuilderPulse/BuilderPulse 上游仓库，并遵循其许可说明。"
            : "All daily report content is synced from the BuilderPulse/BuilderPulse upstream repository and follows its license terms."}
        </p>
        <a
          href="https://github.com/BuilderPulse/BuilderPulse"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-600/5 dark:border-white/[0.07] dark:text-gray-200 dark:hover:bg-gray-200/5"
        >
          BuilderPulse/BuilderPulse
        </a>
      </section>
    </SeoPage>
  );
}
