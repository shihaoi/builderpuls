import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { MarkdownContent } from "@/components/MarkdownContent";
import type { Lang, ReportSection } from "@/lib/types";

const SECTION_NUMBERS: Record<Lang, string[]> = {
  zh: ["一", "二", "三", "四", "五", "六"],
  en: ["01", "02", "03", "04", "05", "06"],
};

interface HomeBriefProps {
  sections: ReportSection[];
  lang: Lang;
  date: string;
  dateLabel: string;
  readReportLabel: string;
}

export function HomeBrief({
  sections,
  lang,
  date,
  dateLabel,
  readReportLabel,
}: HomeBriefProps) {
  const numbers = SECTION_NUMBERS[lang];

  return (
    <div className="mt-8 space-y-14">
      {sections.map((section, index) => (
        <section
          key={section.key}
          id={section.id}
          className="scroll-mt-[var(--scroll-mt)]"
        >
          <div className="flex items-start gap-4 border-b border-gray-100 pb-4 dark:border-white/[0.07]">
            <span
              className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 font-mono text-xs font-medium text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
              aria-hidden
            >
              {numbers[index] ?? String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-200">
                {section.title}
              </h2>
            </div>
          </div>

          <div className="home-section-prose mt-6">
            <MarkdownContent
              content={section.content}
              className="mb-0 mt-0 prose-h2:mt-6 prose-h2:first:mt-0"
            />
          </div>
        </section>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/60 px-5 py-4 dark:border-white/[0.07] dark:bg-gray-900/40">
        <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {dateLabel}
        </p>
        <Link
          href={`/${lang}/${date}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:opacity-80 dark:text-primary-light"
        >
          {readReportLabel}
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    </div>
  );
}