import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoPage } from "@/components/SeoPage";
import { getManifest, LANGS } from "@/lib/content";
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

  return pageMetadata({
    lang,
    path: "/methodology",
    title: lang === "zh" ? "BuilderPulse 方法论" : "BuilderPulse Methodology",
    description:
      lang === "zh"
        ? "BuilderPulse 如何从公共信号中筛选每日 build idea：信号、买家、紧迫性和反向视角。"
        : "How BuilderPulse turns public signals into a daily build idea: signal strength, buyer clarity, urgency, and counterpoints.",
  });
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const manifest = getManifest();
  const steps =
    lang === "zh"
      ? [
          ["信号", "观察 Hacker News、GitHub、Product Hunt、HuggingFace、Google Trends、Reddit、Indie Hackers、Lobsters 和 DEV Community 等公共来源里的异常变化。"],
          ["买家", "把热闹讨论翻译成谁会付钱、为什么现在需要、第一份交付物长什么样。"],
          ["紧迫性", "优先选择有日期、成本、合规、供应商变化或团队失败模式支撑的机会。"],
          ["反向视角", "每份简报都保留一个反向判断，避免把社交热度误读成购买意图。"],
        ]
      : [
          ["Signals", "Watch abnormal movement across Hacker News, GitHub, Product Hunt, HuggingFace, Google Trends, Reddit, Indie Hackers, Lobsters, and DEV Community."],
          ["Buyer", "Translate noisy discussion into who pays, why now, and what the first deliverable looks like."],
          ["Urgency", "Prefer opportunities backed by dates, costs, compliance pressure, vendor changes, or visible team failure modes."],
          ["Counterpoint", "Keep a counter-view in each brief so social heat is not mistaken for purchase intent."],
        ];
  const json = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: lang === "zh" ? "BuilderPulse 方法论" : "BuilderPulse Methodology",
    description:
      lang === "zh"
        ? "BuilderPulse 如何从公共信号中筛选每日 build idea。"
        : "How BuilderPulse selects a daily build idea from public signals.",
  };

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      activeTab="methodology"
      eyebrow={lang === "zh" ? "Methodology" : "Methodology"}
      title={lang === "zh" ? "从公共信号到每日 build idea" : "From Public Signals to Daily Build Ideas"}
      description={
        lang === "zh"
          ? "BuilderPulse 的目标不是做更长的信息流，而是每天给独立开发者一个可以验证的高置信方向。"
          : "BuilderPulse is not another feed. It is a daily attempt to give builders one high-conviction direction worth validating."
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(json) }}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map(([title, body]) => (
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

      <div className="mt-8 border-t border-gray-100 pt-6 dark:border-white/[0.07]">
        <Link
          href={`/${lang}/sources`}
          className="text-sm font-semibold text-gray-900 underline decoration-primary/35 decoration-2 underline-offset-4 hover:decoration-primary dark:text-gray-100 dark:decoration-primary-light/40 dark:hover:decoration-primary-light"
        >
          {lang === "zh" ? "查看信号来源" : "View signal sources"}
        </Link>
      </div>
    </SeoPage>
  );
}
