"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useScrollingFlash } from "@/hooks/use-scrolling-flash";
import { formatDisplayDate } from "@/lib/format";
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
  const monthKeys = useMemo(
    () =>
      groups
        .map((group) => group.reports[0]?.date.slice(0, 7))
        .filter((key): key is string => Boolean(key)),
    [groups],
  );
  const activeMonthKey = activeDate.slice(0, 7);
  const [monthIndex, setMonthIndex] = useState(() =>
    Math.max(0, monthKeys.indexOf(activeMonthKey)),
  );
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const visibleGroup = groups[monthIndex] ?? groups[0];
  const visibleMonth =
    visibleGroup?.reports[0]?.date.slice(0, 7) ?? activeMonthKey;
  const reportsByDate = useMemo(() => {
    const map = new Map<string, ReportMeta>();
    for (const group of groups) {
      for (const report of group.reports) {
        map.set(report.date, report);
      }
    }
    return map;
  }, [groups]);
  const days = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const weekdayLabels =
    lang === "zh"
      ? ["日", "一", "二", "三", "四", "五", "六"]
      : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    ref.current?.scrollTo({ top: 0 });
  }, [activeDate, ref]);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!visibleGroup) return null;

  return (
    <nav
      aria-label={title}
      className={`archive-sidebar fixed bottom-0 right-auto z-20${isFooterVisible ? " is-compact" : ""}`}
      style={{ top: "var(--sidebar-top)" }}
    >
      <div
        ref={ref}
        className={`sidebar-scroll absolute inset-0 overflow-auto pb-10 pr-8${isScrolling ? " is-scrolling" : ""}`}
      >
        <div className="relative text-sm leading-6">
          <div id="navigation-items" className="pl-4 pr-1">
            <div className="calendar-sidebar">
              <div className="calendar-sidebar-header">
                <button
                  type="button"
                  onClick={() =>
                    setMonthIndex((index) =>
                      Math.min(monthKeys.length - 1, index + 1),
                    )
                  }
                  disabled={monthIndex >= monthKeys.length - 1}
                  className="calendar-sidebar-nav"
                  aria-label={lang === "zh" ? "上个月" : "Previous month"}
                >
                  <CaretLeft size={15} weight="bold" aria-hidden />
                </button>
                <div>
                  <h3 className="calendar-sidebar-title">{visibleGroup.label}</h3>
                  <p className="calendar-sidebar-count">
                    {visibleGroup.reports.length}{" "}
                    {lang === "zh" ? "篇日报" : "briefs"}
                  </p>
                  <p className="calendar-sidebar-compact-date">
                    {formatDisplayDate(activeDate, lang)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setMonthIndex((index) => Math.max(0, index - 1))
                  }
                  disabled={monthIndex === 0}
                  className="calendar-sidebar-nav"
                  aria-label={lang === "zh" ? "下个月" : "Next month"}
                >
                  <CaretRight size={15} weight="bold" aria-hidden />
                </button>
              </div>

              <div className="calendar-sidebar-weekdays" aria-hidden>
                {weekdayLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>

              <ol className="calendar-sidebar-grid">
                {days.map((day) => {
                  const report = reportsByDate.get(day.date);
                  const isActive = day.date === activeDate;
                  const className = [
                    "calendar-sidebar-day",
                    day.isOutside ? "is-outside" : "",
                    report ? "has-report" : "",
                    isActive ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <li key={day.date}>
                      {report ? (
                        <Link
                          href={`/${lang}/${report.date}`}
                          className={className}
                          aria-current={isActive ? "page" : undefined}
                          title={
                            report.buildIdea ||
                            formatDisplayDate(report.date, lang)
                          }
                        >
                          <time dateTime={report.date}>{day.day}</time>
                        </Link>
                      ) : (
                        <span className={className} aria-disabled="true">
                          {day.day}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function getCalendarDays(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const firstDate = new Date(year, month - 1, 1);
  const start = new Date(firstDate);
  start.setDate(firstDate.getDate() - firstDate.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      date: toDateKey(date),
      day: date.getDate(),
      isOutside: date.getMonth() !== month - 1,
    };
  });
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
