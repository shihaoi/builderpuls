"use client";

import { CaretDown, CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatShortDate } from "@/lib/format";
import type { Lang, ReportMeta } from "@/lib/types";

export interface ArchiveGroup {
  label: string;
  reports: ReportMeta[];
}

interface ArchiveSidebarProps {
  groups: ArchiveGroup[];
  lang: Lang;
  activeDate: string;
  title: string;
  totalCount: number;
}

export function ArchiveSidebar({
  groups,
  lang,
  activeDate,
  title,
  totalCount,
}: ArchiveSidebarProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    const activeGroup = groups.find((g) =>
      g.reports.some((r) => r.date === activeDate),
    );
    const initial = new Set<string>();
    for (const group of groups) {
      if (group.label !== activeGroup?.label) {
        initial.add(group.label);
      }
    }
    return initial;
  });

  useEffect(() => {
    const activeGroup = groups.find((g) =>
      g.reports.some((r) => r.date === activeDate),
    );
    if (!activeGroup) return;
    setCollapsed((prev) => {
      if (!prev.has(activeGroup.label)) return prev;
      const next = new Set(prev);
      next.delete(activeGroup.label);
      return next;
    });
  }, [activeDate, groups]);

  function toggleMonth(label: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  return (
    <aside className="sticky top-[calc(var(--nav-height)+1.5rem)] hidden max-h-[calc(100dvh-var(--nav-height)-2rem)] overflow-y-auto lg:block">
      <div className="border-b border-border pb-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-1 font-mono text-xs text-text-muted">
          {totalCount} {lang === "zh" ? "篇" : "issues"}
        </p>
      </div>

      <nav className="mt-4 space-y-4">
        {groups.map((group) => {
          const isOpen = !collapsed.has(group.label);
          return (
            <div key={group.label}>
              <button
                type="button"
                onClick={() => toggleMonth(group.label)}
                className="mb-1 flex w-full items-center gap-1.5 rounded-md py-1 text-left font-mono text-[11px] text-text-muted transition hover:bg-surface hover:text-foreground"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <CaretDown size={12} weight="bold" className="shrink-0" />
                ) : (
                  <CaretRight size={12} weight="bold" className="shrink-0" />
                )}
                <span className="flex-1">{group.label}</span>
                <span className="text-[10px] opacity-60">
                  {group.reports.length}
                </span>
              </button>

              {isOpen && (
                <ul className="space-y-px border-l border-border">
                  {group.reports.map((report) => {
                    const isActive = report.date === activeDate;
                    return (
                      <li key={report.date}>
                        <Link
                          href={`/${lang}/${report.date}`}
                          className={`relative block border-l-2 py-1.5 pl-3 pr-1 font-mono text-xs transition ${
                            isActive
                              ? "-ml-px border-l-accent bg-accent-subtle font-medium text-accent"
                              : "border-l-transparent text-text-muted hover:border-l-border hover:bg-surface hover:text-foreground"
                          }`}
                        >
                          <time>{formatShortDate(report.date, lang)}</time>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}