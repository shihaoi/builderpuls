"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { TocItem } from "@/lib/types";

const FALLBACK_SCROLL_OFFSET = 152;
const BOTTOM_LOCK_THRESHOLD = 80;
const TOC_LINE_BASE_OFFSET = 8;
const TOC_LINE_LEVEL_OFFSET = 20;
const TOC_FOLLOW_CENTER_RATIO = 0.42;
const TOC_COMFORT_TOP_RATIO = 0.3;
const TOC_COMFORT_BOTTOM_RATIO = 0.72;
const TARGET_LOCK_THRESHOLD = 6;
const TARGET_LOCK_TIMEOUT = 1400;

interface HeadingEntry {
  element: HTMLElement;
  id: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  title: string;
}

interface TocTrackPosition {
  bottom: number;
  top: number;
  x: number;
}

interface TocTrack {
  d: string;
  height: number;
  itemLineLengths: Array<[top: number, bottom: number] | null>;
  positions: Array<TocTrackPosition | null>;
  width: number;
}

interface ActiveTrack {
  bottom: number;
  offsetDistance: number;
  opacity: number;
  top: number;
}

interface ActiveRange {
  endIndex: number;
  isUp: boolean;
  startIndex: number;
}

const hiddenActiveTrack: ActiveTrack = {
  bottom: 0,
  offsetDistance: 0,
  opacity: 0,
  top: 0,
};

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

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getReadingProgress(headings: HeadingEntry[], scrollOffset: number) {
  if (headings.length < 2) return 0;

  const firstTop =
    headings[0].element.getBoundingClientRect().top + window.scrollY;
  const lastTop =
    headings[headings.length - 1].element.getBoundingClientRect().top +
    window.scrollY;
  const range = lastTop - firstTop;

  if (range <= 0) return 0;

  return clamp((window.scrollY + scrollOffset - firstTop) / range, 0, 1);
}

function syncActiveLink(
  container: HTMLElement,
  link: HTMLElement,
  options: {
    behavior?: ScrollBehavior;
    progress?: number;
  } = {},
) {
  const containerRect = container.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  const linkTop = linkRect.top - containerRect.top + container.scrollTop;
  const linkBottom = linkTop + linkRect.height;
  const linkCenter = linkTop + linkRect.height / 2;
  const viewTop = container.scrollTop;
  const viewBottom = viewTop + container.clientHeight;
  const comfortTop = viewTop + container.clientHeight * TOC_COMFORT_TOP_RATIO;
  const comfortBottom =
    viewTop + container.clientHeight * TOC_COMFORT_BOTTOM_RATIO;
  const maxScrollTop = container.scrollHeight - container.clientHeight;

  if (maxScrollTop <= 0) return;

  if (
    options.progress === undefined &&
    linkTop >= viewTop &&
    linkBottom <= viewBottom &&
    linkCenter >= comfortTop &&
    linkCenter <= comfortBottom
  ) {
    return;
  }

  const centeredTop =
    linkCenter - container.clientHeight * TOC_FOLLOW_CENTER_RATIO;
  const progressTop =
    options.progress === undefined
      ? centeredTop
      : maxScrollTop * options.progress;
  const minVisibleTop = clamp(
    linkCenter - container.clientHeight * TOC_COMFORT_BOTTOM_RATIO,
    0,
    maxScrollTop,
  );
  const maxVisibleTop = clamp(
    linkCenter - container.clientHeight * TOC_COMFORT_TOP_RATIO,
    0,
    maxScrollTop,
  );
  const targetTop =
    minVisibleTop <= maxVisibleTop
      ? clamp(progressTop, minVisibleTop, maxVisibleTop)
      : clamp(centeredTop, 0, maxScrollTop);

  if (Math.abs(container.scrollTop - targetTop) < 1) return;

  container.scrollTo({
    top: targetTop,
    behavior:
      options.behavior ??
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"),
  });
}

function getLineOffset(level: TocItem["level"]) {
  return level === 3 ? TOC_LINE_LEVEL_OFFSET : TOC_LINE_BASE_OFFSET;
}

function getActiveStartIndex(items: TocItem[], activeIndex: number) {
  const active = items[activeIndex];

  if (!active || active.level === 2) return activeIndex;

  for (let index = activeIndex - 1; index >= 0; index -= 1) {
    if (items[index].level === 2) return index;
  }

  return activeIndex;
}

function calculateTocTrack(
  list: HTMLUListElement,
  itemRefs: Map<string, HTMLLIElement>,
  items: TocItem[],
): TocTrack | null {
  if (items.length === 0 || list.clientHeight === 0) return null;

  const listRect = list.getBoundingClientRect();
  const positions: Array<TocTrackPosition | null> = Array.from(
    { length: items.length },
    () => null,
  );
  let d = "";
  let height = 0;
  let previous: TocTrackPosition | null = null;
  let width = 0;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const link = itemRefs.get(item.id)?.querySelector<HTMLElement>("a");
    if (!link) continue;

    const styles = getComputedStyle(link);
    const linkRect = link.getBoundingClientRect();
    const top = linkRect.top - listRect.top + Number.parseFloat(styles.paddingTop);
    const bottom =
      linkRect.bottom - listRect.top - Number.parseFloat(styles.paddingBottom);
    const x = getLineOffset(item.level) + 0.5;
    const position = { bottom, top, x };

    width = Math.max(width, x + 8);
    height = Math.max(height, bottom);

    if (!previous) {
      d += `M ${x} ${top} L ${x} ${bottom}`;
    } else {
      d += ` C ${previous.x} ${top - 4} ${x} ${
        previous.bottom + 4
      } ${x} ${top} L ${x} ${bottom}`;
    }

    positions[index] = position;
    previous = position;
  }

  if (!d) return null;

  const itemLineLengths: Array<[top: number, bottom: number] | null> =
    positions.map(() => null);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.inset = "0 auto auto 0";
  svg.style.opacity = "0";
  svg.style.pointerEvents = "none";
  svg.style.position = "absolute";
  path.setAttribute("d", d);
  svg.append(path);
  document.body.append(svg);

  try {
    const totalLength = path.getTotalLength();
    let previousLength = 0;

    for (let index = 0; index < positions.length; index += 1) {
      const position = positions[index];
      if (!position) continue;

      let length = previousLength;
      while (
        length < totalLength &&
        path.getPointAtLength(length).y < position.top
      ) {
        length += 1;
      }

      const lineLengths: [top: number, bottom: number] = [
        length,
        Math.min(totalLength, length + position.bottom - position.top),
      ];
      itemLineLengths[index] = lineLengths;
      previousLength = lineLengths[1];
    }
  } catch {
    return null;
  } finally {
    svg.remove();
  }

  return {
    d,
    height,
    itemLineLengths,
    positions,
    width,
  };
}

export function TableOfContents({ items, title }: TableOfContentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const lastSyncedId = useRef<string>("");
  const pinnedTocId = useRef<string | null>(null);
  const navigationTargetId = useRef<string | null>(null);
  const navigationTargetTimeout = useRef<number | null>(null);
  const previousActiveRange = useRef<ActiveRange | null>(null);
  const [activeId, setActiveId] = useState<string>("");
  const [activeTrack, setActiveTrack] =
    useState<ActiveTrack>(hiddenActiveTrack);
  const [tocTrack, setTocTrack] = useState<TocTrack | null>(null);

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

      const navigationTarget = navigationTargetId.current;
      if (navigationTarget) {
        const targetHeading = headings.find(
          (heading) => heading.id === navigationTarget,
        );

        if (targetHeading) {
          const targetTop = targetHeading.element.getBoundingClientRect().top;

          if (Math.abs(targetTop - scrollOffset) <= TARGET_LOCK_THRESHOLD) {
            navigationTargetId.current = null;
          } else {
            current = navigationTarget;
          }
        } else {
          navigationTargetId.current = null;
        }
      }

      if (pinnedTocId.current && pinnedTocId.current !== current) {
        pinnedTocId.current = null;
      }

      const container = containerRef.current;
      const activeLink = container?.querySelector<HTMLElement>(
        `a[href="#${CSS.escape(current)}"]`,
      );

      if (container && activeLink) {
        const isNavigationTarget = navigationTargetId.current === current;
        const isPinned = pinnedTocId.current === current;
        syncActiveLink(
          container,
          activeLink,
          isNavigationTarget || isPinned
            ? { behavior: "auto" }
            : {
                behavior: "auto",
                progress: nearBottom
                  ? 1
                  : getReadingProgress(headings, scrollOffset),
              },
        );
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
      if (navigationTargetTimeout.current !== null) {
        window.clearTimeout(navigationTargetTimeout.current);
        navigationTargetTimeout.current = null;
      }
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
    if (!list) return;

    const currentList = list;
    let frame = 0;
    function updateTrack() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setTocTrack(calculateTocTrack(currentList, itemRefs.current, items));
      });
    }

    const observer = new ResizeObserver(updateTrack);
    observer.observe(currentList);
    updateTrack();
    window.addEventListener("resize", updateTrack);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", updateTrack);
    };
  }, [items]);

  useEffect(() => {
    let frame = 0;

    function commit(next: ActiveTrack) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActiveTrack(next));
    }

    if (!activeId || !tocTrack) {
      previousActiveRange.current = null;
      commit(hiddenActiveTrack);
      return () => cancelAnimationFrame(frame);
    }

    const activeIndex = items.findIndex((item) => item.id === activeId);
    if (activeIndex < 0) {
      previousActiveRange.current = null;
      commit(hiddenActiveTrack);
      return () => cancelAnimationFrame(frame);
    }

    const startIndex = getActiveStartIndex(items, activeIndex);
    const start = tocTrack.positions[startIndex];
    const end = tocTrack.positions[activeIndex];
    const startLength = tocTrack.itemLineLengths[startIndex];
    const endLength = tocTrack.itemLineLengths[activeIndex];

    if (!start || !end || !startLength || !endLength) {
      commit(hiddenActiveTrack);
      return () => cancelAnimationFrame(frame);
    }

    const previous = previousActiveRange.current;
    const isUp =
      previous !== null &&
      (previous.startIndex > startIndex ||
        previous.endIndex > activeIndex ||
        (previous.startIndex === startIndex &&
          previous.endIndex === activeIndex &&
          previous.isUp));

    previousActiveRange.current = {
      endIndex: activeIndex,
      isUp,
      startIndex,
    };

    commit({
      bottom: end.bottom,
      offsetDistance: isUp ? startLength[0] : endLength[1],
      opacity: 1,
      top: start.top,
    });

    return () => cancelAnimationFrame(frame);
  }, [activeId, items, tocTrack]);

  if (items.length === 0) return null;

  const trackStyle =
    tocTrack && activeTrack.opacity
      ? ({
          "--toc-track-bottom": `${activeTrack.bottom}px`,
          "--toc-track-top": `${activeTrack.top}px`,
        } as CSSProperties)
      : undefined;
  const dotStyle =
    tocTrack &&
    ({
      offsetDistance: `${activeTrack.offsetDistance}px`,
      offsetPath: `path("${tocTrack.d}")`,
      opacity: activeTrack.opacity,
    } as CSSProperties);

  return (
    <aside id="table-of-contents" className="h-full w-full">
      <div
        className="sticky top-[var(--sidebar-top)] flex max-h-[calc(100dvh-var(--sidebar-top)-2rem)] flex-col text-sm leading-6 text-gray-600 dark:text-gray-400"
      >
        <nav aria-label={title} className="flex min-h-0 flex-col">
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
          <div
            ref={containerRef}
            className="sidebar-scroll toc-scroll-area min-h-0 overflow-y-auto overscroll-y-contain"
          >
            <div className="toc-tree relative">
              {tocTrack ? (
                <div
                  className="toc-tree-track"
                  style={{
                    height: tocTrack.height,
                    width: tocTrack.width,
                    ...trackStyle,
                  }}
                  aria-hidden
                >
                  <svg
                    className="toc-tree-svg"
                    viewBox={`0 0 ${tocTrack.width} ${tocTrack.height}`}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path className="toc-tree-path" d={tocTrack.d} />
                  </svg>
                  <svg
                    className="toc-tree-svg toc-tree-svg-active"
                    viewBox={`0 0 ${tocTrack.width} ${tocTrack.height}`}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path className="toc-tree-path-active" d={tocTrack.d} />
                  </svg>
                  {dotStyle ? (
                    <span className="toc-tree-dot" style={dotStyle} />
                  ) : null}
                </div>
              ) : null}
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

                        navigationTargetId.current = item.id;
                        pinnedTocId.current = item.id;
                        if (navigationTargetTimeout.current !== null) {
                          window.clearTimeout(navigationTargetTimeout.current);
                        }
                        navigationTargetTimeout.current = window.setTimeout(
                          () => {
                            navigationTargetId.current = null;
                            navigationTargetTimeout.current = null;
                          },
                          TARGET_LOCK_TIMEOUT,
                        );

                        const activeLink =
                          containerRef.current?.querySelector<HTMLElement>(
                            `a[href="#${CSS.escape(item.id)}"]`,
                          );
                        if (containerRef.current && activeLink) {
                          syncActiveLink(containerRef.current, activeLink, {
                            behavior: "auto",
                          });
                          lastSyncedId.current = item.id;
                        }

                        setActiveId(item.id);
                        scrollToHeading(heading);
                        history.replaceState(null, "", `#${item.id}`);
                      }}
                      className={`toc-link ${activeId === item.id ? "is-active" : ""} ${item.level === 3 ? "toc-link-level-3" : "toc-link-level-2"}`}
                      aria-current={
                        activeId === item.id ? "location" : undefined
                      }
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
