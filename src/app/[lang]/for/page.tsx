import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPage, TextLinkCard } from "@/components/SeoPage";
import { getManifest, LANGS } from "@/lib/content";
import { getPersonaPages } from "@/lib/programmatic";
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
    path: "/for",
    title:
      lang === "zh"
        ? "BuilderPulse 人群机会页"
        : "BuilderPulse Opportunity Pages by Audience",
    description:
      lang === "zh"
        ? "按独立开发者、MicroSaaS 创始人、开发者工具创始人、AI agent 构建者等人群浏览 BuilderPulse build ideas。"
        : "Browse BuilderPulse build ideas by audience: indie hackers, MicroSaaS founders, developer tool founders, AI agent builders, and more.",
  });
}

export default async function ForHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const manifest = getManifest();
  const personas = getPersonaPages(lang);

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      activeTab="for"
      eyebrow={lang === "zh" ? "Programmatic SEO" : "Programmatic SEO"}
      title={lang === "zh" ? "按人群浏览产品机会" : "Product Opportunities by Audience"}
      description={
        lang === "zh"
          ? "这些页面把 BuilderPulse 的每日 build ideas 按搜索意图和目标人群重组，帮助读者从自己的角色出发找到相关机会。"
          : "These pages reorganize BuilderPulse daily build ideas by search intent and audience, helping readers find opportunities from their own role."
      }
    >
      <div className="grid gap-x-8 md:grid-cols-2">
        {personas.map((persona) => (
          <TextLinkCard
            key={persona.slug}
            href={`/${lang}/for/${persona.slug}`}
            title={persona.targetKeyword[lang]}
            description={persona.description[lang]}
            meta={`${persona.ideas.length} ${
              lang === "zh" ? "个相关点子" : "related ideas"
            }`}
          />
        ))}
      </div>
    </SeoPage>
  );
}
