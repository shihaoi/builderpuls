"use client";

import { List } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useScrollingFlash } from "@/hooks/use-scrolling-flash";
import type { TocItem } from "@/lib/types";

interface TableOfContentsProps {
  items: TocItem[];
  title: string;
}

export function TableOfContents({ items, title }: TableOfContentsProps) {
  const { ref, isScrolling } = useScrollingFlash<HTMLDivElement>();
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-152px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div
      className="fixed right-8 top-[var(--sidebar-top)] z-20 hidden w-[16.5rem] xl:block"
      id="table-of-contents"
    >
      <div
        ref={ref}
        className={`sidebar-scroll -mt-10 max-h-[calc(100dvh-var(--sidebar-top)-2rem)] space-y-2 overflow-y-auto pb-4 pt-10 text-sm leading-6 text-gray-600 dark:text-gray-400${isScrolling ? " is-scrolling" : ""}`}
      >
        <nav aria-label={title}>
          <h2 className="m-0 font-normal">
            <span className="flex items-center space-x-2 font-medium text-gray-700 dark:text-gray-300">
              <List size={12} weight="bold" aria-hidden />
              <span>{title}</span>
            </span>
          </h2>
          <ul className="toc mt-3 space-y-0.5">
            {items.map((item) => (
              <li
                key={item.id}
                className={item.level === 3 ? "pl-3" : ""}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className={`toc-link ${activeId === item.id ? "is-active" : ""} ${item.level === 3 ? "text-xs" : ""}`}
                  aria-current={activeId === item.id ? "location" : undefined}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}