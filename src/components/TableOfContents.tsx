"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/types";

interface TableOfContentsProps {
  items: TocItem[];
  title: string;
}

export function TableOfContents({ items, title }: TableOfContentsProps) {
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
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-[calc(var(--nav-height)+1.5rem)] max-h-[calc(100dvh-var(--nav-height)-2rem)] overflow-y-auto">
      <h2 className="border-b border-border pb-3 text-sm font-semibold text-foreground">
        {title}
      </h2>
      <ul className="mt-4 space-y-1 border-l border-border pl-3">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-2" : ""}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={`block py-0.5 leading-snug transition ${
                activeId === item.id
                  ? "font-medium text-accent"
                  : "text-text-muted hover:text-foreground"
              } ${item.level === 3 ? "text-xs" : "text-sm"}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}