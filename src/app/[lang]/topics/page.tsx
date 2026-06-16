import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPage, TextLinkCard } from "@/components/SeoPage";
import { getManifest, getTopics, LANGS } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/types";

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
    path: "/topics",
    title: lang === "zh" ? "BuilderPulse 主题" : "BuilderPulse Topics",
    description:
      lang === "zh"
        ? "按 AI agent、开发者工具、MicroSaaS、本地 AI、开源和风险成本浏览 BuilderPulse 机会信号。"
        : "Browse BuilderPulse opportunity signals by AI agents, developer tools, MicroSaaS, local AI, open source, and cost risk.",
  });
}

export default async function TopicsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const manifest = getManifest();
  const topics = getTopics(lang);

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      activeTab="topics"
      eyebrow={lang === "zh" ? "Topics" : "Topics"}
      title={lang === "zh" ? "机会信号主题库" : "Opportunity Signal Topics"}
      description={
        lang === "zh"
          ? "把每日简报从日期流重新组织成主题集群，方便搜索和回看同一类 build signal。"
          : "The daily stream reorganized into topic clusters for search, discovery, and repeated review."
      }
    >
      <div className="grid gap-x-8 md:grid-cols-2">
        {topics.map((topic) => (
          <TextLinkCard
            key={topic.slug}
            href={`/${lang}/topics/${topic.slug}`}
            title={topic.label[lang]}
            description={topic.description[lang]}
            meta={`${topic.reports.length} ${
              lang === "zh" ? "篇简报" : "briefs"
            }`}
          />
        ))}
      </div>
    </SeoPage>
  );
}
