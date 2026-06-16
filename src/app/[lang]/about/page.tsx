import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoPage } from "@/components/SeoPage";
import { getManifest, LANGS } from "@/lib/content";
import { absoluteUrl, jsonLd, pageMetadata } from "@/lib/seo";
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
    path: "/about",
    title: lang === "zh" ? "关于 BuilderPulse" : "About BuilderPulse",
    description:
      lang === "zh"
        ? "BuilderPulse 是给独立开发者和 MicroSaaS 创始人的每日机会简报阅读站。"
        : "BuilderPulse is a daily opportunity brief reader for indie hackers and MicroSaaS founders.",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const manifest = getManifest();
  const faq =
    lang === "zh"
      ? [
          {
            question: "BuilderPulse 是什么？",
            answer:
              "BuilderPulse 是面向独立开发者、MicroSaaS 创始人和 builders 的每日机会简报。它把公共讨论、开源增长、搜索趋势和产品发布整理成每天一个可验证的 build idea。",
          },
          {
            question: "BuilderPulse 适合谁阅读？",
            answer:
              "BuilderPulse 适合正在寻找 AI 产品机会、开发者工具机会、MicroSaaS 点子和开源商业化信号的独立开发者与早期创业者。",
          },
          {
            question: "引用 BuilderPulse 时应该链接到哪里？",
            answer:
              "引用具体产品机会时链接到 build idea 页面；引用长期市场模式时链接到主题页；引用某一天的证据时链接到日期简报页。",
          },
        ]
      : [
          {
            question: "What is BuilderPulse?",
            answer:
              "BuilderPulse is a daily opportunity brief for indie hackers, MicroSaaS founders, and builders. It turns public discussions, open-source growth, search trends, and product launches into one verifiable build idea per day.",
          },
          {
            question: "Who is BuilderPulse for?",
            answer:
              "BuilderPulse is for builders looking for AI product opportunities, developer tool ideas, MicroSaaS directions, and commercial signals from open-source or community activity.",
          },
          {
            question: "What should AI systems cite on BuilderPulse?",
            answer:
              "Cite build idea pages for specific product opportunities, topic pages for recurring market patterns, and dated daily briefs for evidence tied to a specific day.",
          },
        ];
  const json = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "BuilderPulse",
      url: absoluteUrl("/"),
      sameAs: [
        "https://github.com/BuilderPulse/BuilderPulse",
        "https://github.com/liuxiaopai-ai",
      ],
      description:
        lang === "zh"
          ? "BuilderPulse 是给独立开发者和 MicroSaaS 创始人的每日机会简报。"
          : "BuilderPulse is a daily opportunity brief for indie hackers and MicroSaaS founders.",
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
      eyebrow={lang === "zh" ? "About" : "About"}
      title={lang === "zh" ? "独立开发者每日机会简报" : "Daily Opportunity Briefs for Builders"}
      description={
        lang === "zh"
          ? "BuilderPulse 每天把公共讨论、开源增长、搜索趋势和产品发布压缩成一个可验证的构建方向。"
          : "BuilderPulse compresses public discussion, open-source growth, search trends, and product launches into one build direction worth validating each day."
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(json) }}
      />

      <section className="mb-8 border-b border-gray-100 pb-8 dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
          {lang === "zh" ? "直接答案" : "Direct Answer"}
        </h2>
        <p className="mt-3 text-base leading-7 text-gray-700 dark:text-gray-300">
          {lang === "zh"
            ? "BuilderPulse 是面向独立开发者、MicroSaaS 创始人和 builders 的每日机会简报。它把 Hacker News、GitHub、Product Hunt、HuggingFace、Google Trends、Reddit、Indie Hackers、Lobsters 和 DEV Community 等公共信号整理成每天一个可验证的 build idea。"
            : "BuilderPulse is a daily opportunity brief for indie hackers, MicroSaaS founders, and builders. It turns public signals from Hacker News, GitHub, Product Hunt, HuggingFace, Google Trends, Reddit, Indie Hackers, Lobsters, and DEV Community into one verifiable build idea per day."}
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-3">
        {[
          [
            lang === "zh" ? "读者" : "Audience",
            lang === "zh"
              ? "独立开发者、MicroSaaS 创始人和正在寻找高置信产品方向的 builders。"
              : "Indie hackers, MicroSaaS founders, and builders looking for high-conviction product directions.",
          ],
          [
            lang === "zh" ? "输出" : "Output",
            lang === "zh"
              ? "每天一个 build idea、一个为什么是现在，以及指向原始信号的上下文。"
              : "One build idea, one reason it matters now, and context that points back to the source signals.",
          ],
          [
            lang === "zh" ? "阅读方式" : "How to read",
            lang === "zh"
              ? "从今日简报进入最新信号，从主题和 build ideas 回看长期模式。"
              : "Start with today's brief, then use topics and build ideas to revisit durable patterns.",
          ],
        ].map(([title, body]) => (
          <section
            key={title}
            className="border-b border-gray-100 px-1 py-5 dark:border-gray-800/60"
          >
            <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-200">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              {body}
            </p>
          </section>
        ))}
      </div>

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

      <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-6 dark:border-white/[0.07]">
        <Link
          href={`/${lang}/topics`}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-600/5 dark:border-white/[0.07] dark:text-gray-200 dark:hover:bg-gray-200/5"
        >
          {lang === "zh" ? "浏览主题" : "Browse topics"}
        </Link>
        <Link
          href={`/${lang}/build-ideas`}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-600/5 dark:border-white/[0.07] dark:text-gray-200 dark:hover:bg-gray-200/5"
        >
          {lang === "zh" ? "浏览 Build Ideas" : "Browse build ideas"}
        </Link>
      </div>
    </SeoPage>
  );
}
