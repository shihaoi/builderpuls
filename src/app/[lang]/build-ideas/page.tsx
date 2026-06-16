import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPage, TextLinkCard } from "@/components/SeoPage";
import { getBuildIdeas, getManifest, LANGS } from "@/lib/content";
import { formatDisplayDate } from "@/lib/format";
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
    path: "/build-ideas",
    title:
      lang === "zh"
        ? "MicroSaaS 与 AI Build Ideas"
        : "MicroSaaS and AI Build Ideas",
    description:
      lang === "zh"
        ? "从 BuilderPulse 每日简报中整理出的 AI、开发者工具和 MicroSaaS 产品点子。"
        : "AI, developer tool, and MicroSaaS product ideas distilled from BuilderPulse daily briefs.",
  });
}

export default async function BuildIdeasPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const manifest = getManifest();
  const ideas = getBuildIdeas(lang);

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      activeTab="buildIdeas"
      eyebrow={lang === "zh" ? "Build Ideas" : "Build Ideas"}
      title={lang === "zh" ? "可构建产品点子库" : "Build Idea Library"}
      description={
        lang === "zh"
          ? "每个条目都来自一份每日机会简报，并保留原始日期页作为证据入口。"
          : "Each entry comes from a daily opportunity brief and keeps the original dated report as evidence."
      }
    >
      <div>
        {ideas.map((idea) => (
          <TextLinkCard
            key={idea.slug}
            href={`/${lang}/build-ideas/${idea.slug}`}
            title={idea.title}
            description={idea.summary}
            meta={formatDisplayDate(idea.primaryReport.date, lang)}
          />
        ))}
      </div>
    </SeoPage>
  );
}
