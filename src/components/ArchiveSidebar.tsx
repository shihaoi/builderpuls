"use client";

import { CaretDown, CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useScrollingFlash } from "@/hooks/use-scrolling-flash";
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
}

export function ArchiveSidebar({
  groups,
  lang,
  activeDate,
  title,
}: ArchiveSidebarProps) {
  const { ref, isScrolling } = useScrollingFlash<HTMLDivElement>();
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
    <nav
      aria-label={title}
      className="fixed bottom-0 right-auto z-20 hidden w-[18rem] lg:block"
      style={{ top: "var(--sidebar-top)" }}
    >
      <div
        ref={ref}
        className={`sidebar-scroll absolute inset-0 overflow-auto pb-10 pr-8${isScrolling ? " is-scrolling" : ""}`}
      >
        <div className="relative text-sm leading-6">
          <div className="sidebar-fade-top" />
          <div id="navigation-items" className="space-y-4">
            {groups.map((group) => {
              const isOpen = !collapsed.has(group.label);
              return (
                <div key={group.label}>
                  <button
                    type="button"
                    onClick={() => toggleMonth(group.label)}
                    className="sidebar-group-header mb-2.5 flex w-full items-center gap-2.5 py-0 pl-4 text-left font-semibold text-gray-900 transition hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-300 lg:mb-2.5"
                    aria-expanded={isOpen}
                  >
                    {isOpen ? (
                      <CaretDown size={12} weight="bold" className="shrink-0" />
                    ) : (
                      <CaretRight size={12} weight="bold" className="shrink-0" />
                    )}
                    <h3 className="sidebar-title flex-1 text-[length:inherit] font-[inherit] leading-[inherit]">
                      {group.label}
                    </h3>
                    <span className="pr-2 font-mono text-[10px] font-normal text-gray-400">
                      {group.reports.length}
                    </span>
                  </button>

                  {isOpen && (
                    <ul className="sidebar-group space-y-px">
                      {group.reports.map((report) => {
                        const isActive = report.date === activeDate;
                        return (
                          <li key={report.date}>
                            <Link
                              href={`/${lang}/${report.date}`}
                              className={`sidebar-link ${isActive ? "is-active" : ""}`}
                              aria-current={isActive ? "page" : undefined}
                            >
                              <time className="font-mono text-xs">
                                {formatShortDate(report.date, lang)}
                              </time>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}