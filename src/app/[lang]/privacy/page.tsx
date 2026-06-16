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
    path: "/privacy",
    title: lang === "zh" ? "BuilderPulse 隐私说明" : "BuilderPulse Privacy Notice",
    description:
      lang === "zh"
        ? "BuilderPulse 阅读站如何处理访问日志、本地偏好、搜索和外部链接。"
        : "How the BuilderPulse reader handles access logs, local preferences, search, and external links.",
  });
}

export default async function PrivacyPage({
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
            title: "我们收集什么",
            body: "BuilderPulse 阅读站目前不提供账号、评论、付款或投稿表单。站内搜索在浏览器中基于已发布内容运行，不会把你的搜索词发送到本站服务器。托管服务可能会记录基础访问日志，例如请求时间、页面路径、IP 地址、浏览器类型和错误状态，用于安全、排障和服务运行。",
          },
          {
            title: "本地偏好",
            body: "主题切换会把 light/dark 偏好保存在浏览器 localStorage 中。这个值只用于在你的设备上恢复界面主题，不用于识别个人身份。",
          },
          {
            title: "第三方链接",
            body: "本站链接到 GitHub、X、上游内容仓库和公共信号来源。访问这些外部网站时，它们会按照各自的隐私政策处理数据。",
          },
          {
            title: "内容来源",
            body: "日报内容来自公开信号和 BuilderPulse 上游仓库。本站会展示来源、机器可读文件和同步时间，帮助读者理解内容出处。",
          },
          {
            title: "联系我们",
            body: "如果你希望反馈隐私相关问题，可以通过页脚中的作者 GitHub 或 X 链接联系维护者。",
          },
        ]
      : [
          {
            title: "What We Collect",
            body: "The BuilderPulse reader currently has no accounts, comments, payments, or submission forms. Site search runs in the browser against published content, so your search terms are not sent to a BuilderPulse server. Hosting providers may keep basic access logs such as request time, page path, IP address, browser type, and error status for security, debugging, and service operations.",
          },
          {
            title: "Local Preferences",
            body: "The theme toggle stores a light/dark preference in browser localStorage. This value is only used on your device to restore the interface theme and is not used to identify you.",
          },
          {
            title: "Third-Party Links",
            body: "This site links to GitHub, X, the upstream content repository, and public signal sources. Those external sites process data under their own privacy policies.",
          },
          {
            title: "Content Sources",
            body: "Daily briefs come from public signals and the BuilderPulse upstream repository. This reader shows sources, machine-readable files, and sync time to make provenance easier to inspect.",
          },
          {
            title: "Contact",
            body: "For privacy-related feedback, contact the maintainer through the GitHub or X links in the footer.",
          },
        ];

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      eyebrow={lang === "zh" ? "Privacy" : "Privacy"}
      title={lang === "zh" ? "隐私说明" : "Privacy Notice"}
      description={
        lang === "zh"
          ? "BuilderPulse 是一个静态阅读站，默认不要求登录，也不收集用户提交内容。"
          : "BuilderPulse is a static reader. It does not require sign-in or collect user-submitted content by default."
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
