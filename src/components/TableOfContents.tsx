"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/types";

const FALLBACK_SCROLL_OFFSET = 152;
const BOTTOM_LOCK_THRESHOLD = 80;
const MIN_INDICATOR_HEIGHT = 14;
const TOC_FOLLOW_CENTER_RATIO = 0.42;

interface TableOfContentsProps {
  items: TocItem[];
  title: string;
}

function getScrollOffset() {
  const rawValue = getComputedStyle(document.documentElement)
    .getPropertyValue("--scroll-mt")
    .trim();
  const parsedValue = Number.parseFloat(rawValue);

  if (!Number.isFinite(parsedValue)) return FALLBACK_SCROLL_OFFSET;

  return rawValue.endsWith("rem")
    ? parsedValue *
        Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    : parsedValue;
}

function scrollToHeading(heading: HTMLElement) {
  const top =
    heading.getBoundingClientRect().top + window.scrollY - getScrollOffset();
  window.scrollTo({ top, behavior: "smooth" });
}

function syncActiveLink(container: HTMLElement, link: HTMLElement) {
  const linkTop = link.offsetTop;
  const linkBottom = linkTop + link.offsetHeight;
  const linkCenter = linkTop + link.offsetHeight / 2;
  const viewTop = container.scrollTop;
  const viewBottom = viewTop + container.clientHeight;
  const comfortTop = viewTop + container.clientHeight * 0.3;
  const comfortBottom = viewTop + container.clientHeight * 0.72;

  if (
    linkTop >= viewTop &&
    linkBottom <= viewBottom &&
    linkCenter >= comfortTop &&
    linkCenter <= comfortBottom
  ) {
    return;
  }

  const maxScrollTop = container.scrollHeight - container.clientHeight;
  const targetTop = Math.max(
    0,
    Math.min(
      maxScrollTop,
      linkCenter - container.clientHeight * TOC_FOLLOW_CENTER_RATIO,
    ),
  );

  container.scrollTo({
    top: targetTop,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
}

export function TableOfContents({ items, title }: TableOfContentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const lastSyncedId = useRef<string>("");
  const [activeId, setActiveId] = useState<string>("");
  const [activeIndicator, setActiveIndicator] = useState({
    dotTop: 0,
    height: 0,
    top: 0,
  });

  useEffect(() => {
    const headings = items.flatMap((item) => {
      const element = document.getElementById(item.id);
      return element ? [{ element, id: item.id }] : [];
    });

    if (headings.length === 0) return;
    let frame = 0;

    function updateActive() {
      const scrollOffset = getScrollOffset();
      const nearBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - BOTTOM_LOCK_THRESHOLD;

      let current = nearBottom
        ? headings[headings.length - 1].id
        : headings[0].id;

      if (!nearBottom) {
        for (const heading of headings) {
          const top = heading.element.getBoundingClientRect().top;

          if (top <= scrollOffset + 1) {
            current = heading.id;
          } else {
            break;
          }
        }
      }

      setActiveId((prev) => (prev === current ? prev : current));
    }

    function scheduleUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    }

    const observer = new IntersectionObserver(scheduleUpdate, {
      rootMargin: `-${getScrollOffset()}px 0px -65% 0px`,
      threshold: [0, 1],
    });

    for (const heading of headings) {
      observer.observe(heading.element);
    }

    updateActive();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [items]);

  useEffect(() => {
    if (!activeId || !containerRef.current) return;
    if (lastSyncedId.current === activeId) return;

    const activeLink = containerRef.current.querySelector<HTMLElement>(
      `a[href="#${CSS.escape(activeId)}"]`,
    );
    if (!activeLink) return;

    syncActiveLink(containerRef.current, activeLink);
    lastSyncedId.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const list = listRef.current;
    if (!activeId || !list) {
      setActiveIndicator({ dotTop: 0, height: 0, top: 0 });
      return;
    }

    function updateActiveIndicator() {
      const list = listRef.current;
      const activeItem = itemRefs.current.get(activeId);
      const activeIndex = items.findIndex((item) => item.id === activeId);
      if (!list || !activeItem || activeIndex < 0) return;

      const activeRect = activeItem.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      const active = items[activeIndex];
      const activeTop = activeRect.top - listRect.top;
      const activeCenter = activeTop + activeRect.height / 2;

      if (active.level === 2) {
        const top = Math.max(0, activeCenter - MIN_INDICATOR_HEIGHT);

        setActiveIndicator({
          dotTop: activeCenter,
          height: activeCenter - top,
          top,
        });
        return;
      }

      const parent = [...items]
        .slice(0, activeIndex)
        .reverse()
        .find((item) => item.level === 2);
      const parentItem = parent ? itemRefs.current.get(parent.id) : null;

      if (!parentItem) {
        setActiveIndicator({
          dotTop: activeCenter,
          height: MIN_INDICATOR_HEIGHT,
          top: activeCenter - MIN_INDICATOR_HEIGHT / 2,
        });
        return;
      }

      const parentRect = parentItem.getBoundingClientRect();
      const parentTop = parentRect.top - listRect.top;
      const parentCenter = parentTop + parentRect.height / 2;
      const top = Math.min(parentCenter, activeCenter);

      setActiveIndicator({
        dotTop: activeCenter,
        height: activeCenter - top,
        top,
      });
    }

    updateActiveIndicator();
    window.addEventListener("resize", updateActiveIndicator);
    return () => window.removeEventListener("resize", updateActiveIndicator);
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
          <div className="toc-tree relative mt-4">
            <span className="toc-tree-line" aria-hidden />
            <span
              className="toc-tree-active"
              style={{
                height: activeIndicator.height,
                opacity: activeIndicator.height ? 1 : 0,
                top: activeIndicator.top,
              }}
              aria-hidden
            />
            <span
              className="toc-tree-dot"
              style={{
                opacity: activeIndicator.height ? 1 : 0,
                top: activeIndicator.dotTop,
              }}
              aria-hidden
            />
            <ul ref={listRef} className="toc space-y-0.5">
              {items.map((item) => (
                <li
                  key={item.id}
                  ref={(node) => {
                    if (node) {
                      itemRefs.current.set(item.id, node);
                    } else {
                      itemRefs.current.delete(item.id);
                    }
                  }}
                  className={`toc-item ${activeId === item.id ? "is-active" : ""} ${item.level === 3 ? "toc-item-level-3" : "toc-item-level-2"}`}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const heading = document.getElementById(item.id);
                      if (!heading) return;

                      setActiveId(item.id);
                      scrollToHeading(heading);
                      history.replaceState(null, "", `#${item.id}`);
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
