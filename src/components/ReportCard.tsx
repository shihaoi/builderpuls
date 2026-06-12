import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/format";
import type { Lang, ReportMeta } from "@/lib/types";

interface ReportCardProps {
  report: ReportMeta;
  lang: Lang;
}

export function ReportCard({ report, lang }: ReportCardProps) {
  return (
    <Link
      href={`/${lang}/${report.date}`}
      className="group flex items-start justify-between gap-4 border-b border-gray-100 px-1 py-4 transition last:border-b-0 hover:bg-gray-600/5 dark:border-gray-800/60 dark:hover:bg-gray-200/5"
    >
      <div className="min-w-0 flex-1">
        <time className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {formatDisplayDate(report.date, lang)}
        </time>

        {report.buildIdea && (
          <h3 className="mt-1.5 text-base font-medium leading-snug text-gray-900 group-hover:text-primary dark:text-gray-200 dark:group-hover:text-primary-light">
            {report.buildIdea}
          </h3>
        )}

        {report.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {report.summary}
          </p>
        )}
      </div>

      <ArrowRight
        size={16}
        weight="bold"
        className="mt-1 shrink-0 text-gray-400 opacity-0 transition group-hover:opacity-100 dark:text-gray-500"
      />
    </Link>
  );
}