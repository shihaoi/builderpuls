import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPage, TextLinkCard } from "@/components/SeoPage";
import {
  getArchivePeriods,
  getManifest,
  getReportsByArchivePeriod,
  LANGS,
} from "@/lib/content";
import { formatDisplayDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/types";

export function generateStaticParams() {
  const params: { lang: string; period: string }[] = [];
  for (const lang of LANGS) {
    const years = new Set<string>();
    for (const period of getArchivePeriods(lang)) {
      params.push({ lang, period: period.key });
      years.add(period.key.slice(0, 4));
    }
    for (const year of years) {
      params.push({ lang, period: year });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; period: string }>;
}): Promise<Metadata> {
  const { lang: langParam, period } = await params;
  if (!LANGS.includes(langParam as Lang)) return {};
  const lang = langParam as Lang;

  return pageMetadata({
    lang,
    path: `/archive/${period}`,
    title:
      lang === "zh"
        ? `BuilderPulse ${period} 归档`
        : `BuilderPulse ${period} Archive`,
    description:
      lang === "zh"
        ? `浏览 ${period} 的 BuilderPulse 每日机会简报。`
        : `Browse BuilderPulse daily opportunity briefs from ${period}.`,
  });
}

export default async function ArchivePeriodPage({
  params,
}: {
  params: Promise<{ lang: string; period: string }>;
}) {
  const { lang: langParam, period } = await params;
  if (!LANGS.includes(langParam as Lang)) notFound();
  const lang = langParam as Lang;
  const reports = getReportsByArchivePeriod(lang, period);
  if (reports.length === 0) notFound();

  const manifest = getManifest();
  const label =
    period.length === 4
      ? period
      : (getArchivePeriods(lang).find((item) => item.key === period)?.label ??
        period);

  return (
    <SeoPage
      lang={lang}
      syncedAt={manifest.syncedAt}
      activeTab="archive"
      eyebrow={lang === "zh" ? "Archive" : "Archive"}
      title={lang === "zh" ? `${label} 归档` : `${label} Archive`}
      description={
        lang === "zh"
          ? "按时间回看 build ideas，并把单篇日期页连接到更大的机会脉络。"
          : "Review build ideas by time and connect individual daily pages to the larger opportunity pattern."
      }
    >
      <div>
        {reports.map((report) => (
          <TextLinkCard
            key={report.date}
            href={`/${lang}/${report.date}`}
            title={report.buildIdea || report.title}
            description={report.summary}
            meta={formatDisplayDate(report.date, lang)}
          />
        ))}
      </div>
    </SeoPage>
  );
}
