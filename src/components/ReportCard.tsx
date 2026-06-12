import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/format";
import type { Lang, ReportMeta } from "@/lib/types";
import { UI } from "@/lib/i18n";

interface ReportCardProps {
  report: ReportMeta;
  lang: Lang;
  featured?: boolean;
}

export function ReportCard({ report, lang, featured }: ReportCardProps) {
  const t = UI[lang];

  return (
    <Link
      href={`/${lang}/${report.date}`}
      className={`group block border-b border-border py-5 transition last:border-b-0 hover:bg-surface ${
        featured ? "border-t px-5" : "px-1"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <time className="font-mono text-xs text-text-muted">
            {formatDisplayDate(report.date, lang)}
          </time>

          {report.buildIdea && (
            <h3
              className={`mt-1.5 font-semibold leading-snug text-foreground group-hover:text-accent ${
                featured ? "text-xl tracking-tight" : "text-base"
              }`}
            >
              {report.buildIdea}
            </h3>
          )}

          {report.summary && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
              {report.summary}
            </p>
          )}
        </div>

        <span className="mt-1 flex shrink-0 items-center gap-1 text-sm font-medium text-accent opacity-0 transition group-hover:opacity-100">
          <ArrowRight size={16} weight="bold" />
        </span>
      </div>

      {featured && (
        <span className="mt-3 inline-flex rounded-md bg-accent-subtle px-2 py-0.5 font-mono text-[11px] text-accent">
          {t.latest}
        </span>
      )}
    </Link>
  );
}