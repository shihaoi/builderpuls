"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/types";

const HEADER_OFFSET = 152;
const BOTTOM_LOCK_THRESHOLD = 80;

interface TableOfContentsProps {
  items: TocItem[];
  title: string;
}

function revealActiveLink(container: HTMLElement, link: HTMLElement) {
  const linkTop = link.offsetTop;
  const linkBottom = linkTop + link.offsetHeight;
  const viewTop = container.scrollTop;
  const viewBottom = viewTop + container.clientHeight;

  if (linkTop < viewTop) {
    container.scrollTop = linkTop;
  } else if (linkBottom > viewBottom) {
    container.scrollTop = linkBottom - container.clientHeight;
  }
}

export function TableOfContents({ items, title }: TableOfContentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const lastSyncedId = useRef<string>("");
  const [activeId, setActiveId] = useState<string>("");
  const [marker, setMarker] = useState({ height: 0, top: 0 });

  function syncMarker(link: HTMLElement) {
    const list = listRef.current;
    if (!list) return;

    const linkRect = link.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setMarker({
      height: linkRect.height,
      top: linkRect.top - listRect.top,
    });
  }

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    function updateActive() {
      const marker = window.scrollY + HEADER_OFFSET;
      const nearBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - BOTTOM_LOCK_THRESHOLD;

      let current = nearBottom
        ? headings[headings.length - 1].id
        : headings[0].id;

      if (!nearBottom) {
        for (const heading of headings) {
          if (heading.offsetTop <= marker) {
            current = heading.id;
          } else {
            break;
          }
        }
      }

      setActiveId((prev) => (prev === current ? prev : current));
    }

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [items]);

  useEffect(() => {
    if (!activeId || !containerRef.current) return;
    if (lastSyncedId.current === activeId) return;

    const activeLink = containerRef.current.querySelector<HTMLElement>(
      `a[href="#${CSS.escape(activeId)}"]`,
    );
    if (!activeLink) return;

    revealActiveLink(containerRef.current, activeLink);
    syncMarker(activeLink);
    lastSyncedId.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (!activeId || !containerRef.current) return;

    function updateMarker() {
      const activeLink = containerRef.current?.querySelector<HTMLElement>(
        `a[href="#${CSS.escape(activeId)}"]`,
      );
      if (activeLink) syncMarker(activeLink);
    }

    updateMarker();
    window.addEventListener("resize", updateMarker);
    return () => window.removeEventListener("resize", updateMarker);
  }, [activeId, items]);

  if (items.length === 0) return null;

  return (
    <aside id="table-of-contents" className="h-full w-full">
      <div
        ref={containerRef}
        className="sidebar-scroll sticky top-[var(--sidebar-top)] max-h-[calc(100dvh-var(--sidebar-top)-2rem)] overflow-y-auto overscroll-y-contain pb-4 text-sm leading-6 text-gray-600 dark:text-gray-400"
      >
        <nav aria-label={title}>
          <h2 className="m-0 font-normal">
            <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3 w-3 shrink-0"
                aria-hidden
              >
                <path d="M2.44434 12.6665H13.5554" strokeLinecap="round" />
                <path d="M2.44434 3.3335H13.5554" strokeLinecap="round" />
                <path d="M2.44434 8H7.33323" strokeLinecap="round" />
              </svg>
              <span>{title}</span>
            </span>
          </h2>
          <div className="relative mt-4 pl-5">
            <span
              className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-gray-200 dark:bg-white/10"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute left-0 w-px bg-gray-900 transition-[height,transform] duration-200 ease-out dark:bg-gray-100"
              style={{
                height: marker.height,
                opacity: marker.height ? 1 : 0,
                transform: `translateY(${marker.top}px)`,
              }}
              aria-hidden
            />
            <ul ref={listRef} className="toc space-y-0.5">
              {items.map((item) => (
                <li key={item.id} className={item.level === 3 ? "pl-5" : ""}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className={`toc-link ${activeId === item.id ? "is-active" : ""} ${item.level === 3 ? "toc-link-level-3" : "toc-link-level-2"}`}
                    aria-current={activeId === item.id ? "location" : undefined}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
