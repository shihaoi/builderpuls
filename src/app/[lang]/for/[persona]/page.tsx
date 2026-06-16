import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoPage, TextLinkCard } from "@/components/SeoPage";
import { getManifest, LANGS } from "@/lib/content";
import {
  getPersonaPage,
  getPersonaPages,
  PERSONAS,
} from "@/lib/programmatic";
import { absoluteUrl, jsonLd, localizedPath, pageMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/types";

export function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    PERSONAS.map((persona) => ({ lang, persona: persona.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; persona: string }>;
}): Promise<Metadata> {
  const { lang: langParam, persona: personaSlug } = await params;
  if (!LANGS.includes(langParam as Lang)) return {};
  const lang = langParam as Lang;
  const page = getPersonaPage(lang, personaSlug);
  if (!page) return {};

  return pageMetadata({
    lang,
    path: `/for/${personaSlug}`,
    title: `${page.targetKeyword[lang]} · BuilderPulse`,
    description: page.description[lang],
  });
}

export default async function PersonaPage({
  params,
}: {
  params: Promise<{ lang: string; persona: string }>;
}) {
  const { lang: langParam, persona: personaSlug } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const persona = getPersonaPage(lang, personaSlug);
  if (!persona) notFound();

  const manifest = getManifest();
  const relatedPersonas = getPersonaPages(lang).filter(
    (item) => item.slug !== persona.slug,
  );
  const path = `/for/${persona.slug}`;
  const faq =
    lang === "zh"
      ? [
          {
            question: `${persona.targetKeyword.zh} 应该怎么筛选？`,
            answer:
              "优先看三个条件：是否有明确买家、是否有当前触发因素、是否能先做成报告、清单、监控或小型工作流。",
          },
          {
            question: "这些页面为什么不是普通点子列表？",
            answer:
              "每个页面都由 BuilderPulse 已有日报、主题和 build ideas 自动聚合，并保留原始日期页作为证据入口。",
          },
        ]
      : [
          {
            question: `How should ${persona.targetKeyword.en} be evaluated?`,
            answer:
              "Start with buyer clarity, current urgency, and whether the first version can be packaged as a report, checklist, monitor, or small workflow.",
          },
          {
            question: "Why are these pages not generic idea lists?",
            answer:
              "Each page is assembled from BuilderPulse daily briefs, topic clusters, and build ideas, with dated source pages kept as evidence.",
          },
        ];
  const json = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: persona.targetKeyword[lang],
      description: persona.description[lang],
      url: absoluteUrl(localizedPath(lang, path)),
      isPartOf: {
        "@type": "WebSite",
        name: "BuilderPulse",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: persona.targetKeyword[lang],
      itemListElement: persona.ideas.slice(0, 12).map((idea, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: idea.title,
        url: absoluteUrl(localizedPath(lang, `/build-ideas/${idea.slug}`)),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      activeTab="for"
      eyebrow={lang === "zh" ? "Audience Page" : "Audience Page"}
      title={persona.targetKeyword[lang]}
      description={persona.description[lang]}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(json) }}
      />

      <section className="border-b border-gray-100 pb-8 dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
          {lang === "zh" ? "直接答案" : "Direct Answer"}
        </h2>
        <p className="mt-3 text-base leading-7 text-gray-700 dark:text-gray-300">
          {persona.directAnswer[lang]}
        </p>
      </section>

      <section className="mt-8 grid gap-6 border-b border-gray-100 pb-8 dark:border-white/[0.07] md:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
            {lang === "zh" ? "搜索意图" : "Search Intent"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
            {persona.searchIntent[lang]}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
            {lang === "zh" ? "适用场景" : "Use Cases"}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
            {persona.useCases[lang].map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 border-b border-gray-100 pb-8 dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
          {lang === "zh" ? "相关主题" : "Related Topics"}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {persona.topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/${lang}/topics/${topic.slug}`}
              className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {topic.label[lang]}
              <span className="ml-2 font-mono text-xs text-gray-400">
                {topic.reports.length}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
            {lang === "zh" ? "相关 Build Ideas" : "Related Build Ideas"}
          </h2>
          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {persona.ideas.length}
          </span>
        </div>
        {persona.ideas.map((idea) => (
          <TextLinkCard
            key={idea.slug}
            href={`/${lang}/build-ideas/${idea.slug}`}
            title={idea.title}
            description={idea.summary}
            meta={idea.primaryReport.date}
          />
        ))}
      </section>

      <section className="mt-8 border-t border-gray-100 pt-6 dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
          FAQ
        </h2>
        <div className="mt-4 space-y-5">
          {faq.map((item) => (
            <div key={item.question}>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200">
                {item.question}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 border-t border-gray-100 pt-6 dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
          {lang === "zh" ? "其他人群" : "Other Audiences"}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {relatedPersonas.map((item) => (
            <Link
              key={item.slug}
              href={`/${lang}/for/${item.slug}`}
              className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {item.label[lang]}
            </Link>
          ))}
        </div>
      </section>
    </SeoPage>
  );
}
