import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPage } from "@/components/SeoPage";
import { getManifest, LANGS } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/types";

const UPDATED_AT = "2026-06-17";

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
    path: "/terms",
    title: lang === "zh" ? "BuilderPulse 用户协议" : "BuilderPulse Terms of Use",
    description:
      lang === "zh"
        ? "使用 BuilderPulse 阅读站时适用的内容、链接、责任和使用规则。"
        : "Content, linking, responsibility, and usage rules for the BuilderPulse reader.",
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const manifest = getManifest();
  const sections =
    lang === "zh"
      ? [
          {
            title: "使用本站",
            body: "BuilderPulse 阅读站用于浏览每日机会简报、主题页、build idea 页面和机器可读入口。你可以正常阅读、引用和分享公开页面，但不得通过攻击、滥用请求或绕过安全限制影响站点运行。",
          },
          {
            title: "内容性质",
            body: "本站内容用于信息参考和产品研究启发，不构成法律、财务、投资、安全、医疗或专业建议。你应在做出商业、技术或合规决策前自行验证来源和结论。",
          },
          {
            title: "来源与第三方内容",
            body: "日报内容来自 BuilderPulse 上游仓库和公开信号来源。外部链接、仓库、社交平台和第三方页面由各自所有者负责，本站不控制其内容、可用性或政策。",
          },
          {
            title: "知识产权",
            body: "BuilderPulse 品牌、页面设计和阅读站代码归各自权利人所有。上游报告内容、仓库代码和第三方材料适用其对应许可。引用页面时请保留清晰来源链接。",
          },
          {
            title: "变更",
            body: "本站可能调整页面结构、同步频率、链接和这些条款。继续使用本站即表示你接受更新后的条款。",
          },
        ]
      : [
          {
            title: "Using This Site",
            body: "The BuilderPulse reader is for browsing daily opportunity briefs, topic pages, build idea pages, and machine-readable files. You may read, cite, and share public pages, but you may not attack the site, abuse requests, or bypass security restrictions.",
          },
          {
            title: "Nature of the Content",
            body: "Content on this site is for informational and product research purposes only. It is not legal, financial, investment, security, medical, or other professional advice. Verify sources and conclusions before making business, technical, or compliance decisions.",
          },
          {
            title: "Sources and Third-Party Content",
            body: "Daily briefs come from the BuilderPulse upstream repository and public signal sources. External links, repositories, social platforms, and third-party pages are controlled by their own owners, not by this reader.",
          },
          {
            title: "Intellectual Property",
            body: "The BuilderPulse brand, page design, and reader code belong to their respective rights holders. Upstream report content, repository code, and third-party materials are governed by their own licenses. Keep a clear source link when citing pages.",
          },
          {
            title: "Changes",
            body: "This site may update its page structure, sync cadence, links, and these terms. Continued use of the site means you accept the updated terms.",
          },
        ];

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      eyebrow={lang === "zh" ? "Terms" : "Terms"}
      title={lang === "zh" ? "用户协议" : "Terms of Use"}
      description={
        lang === "zh"
          ? "这些条款说明 BuilderPulse 阅读站的内容边界、外部链接和使用规则。"
          : "These terms explain the content boundaries, external links, and usage rules for the BuilderPulse reader."
      }
    >
      <p className="mb-8 font-mono text-xs text-gray-500 dark:text-gray-400">
        {lang === "zh" ? "更新日期" : "Updated"}: {UPDATED_AT}
      </p>
      <div className="space-y-7">
        {sections.map((section) => (
          <section
            key={section.title}
            className="border-b border-gray-100 pb-7 dark:border-white/[0.07]"
          >
            <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-200">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </SeoPage>
  );
}
