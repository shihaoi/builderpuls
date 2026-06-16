"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang, SearchEntry } from "@/lib/types";

interface SearchBoxProps {
  entries: SearchEntry[];
  lang: Lang;
  placeholder: string;
}

interface SearchResult extends SearchEntry {
  excerpt: string;
  score: number;
}

const MAX_RESULTS = 6;

function normalize(value: string): string {
  return value.toLocaleLowerCase().trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesTerm(source: string, term: string): boolean {
  if (/^[a-z0-9][a-z0-9-]*$/i.test(term)) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}($|[^a-z0-9])`).test(
      source,
    );
  }

  return source.includes(term);
}

function makeExcerpt(entry: SearchEntry, query: string): string {
  const source = entry.content || entry.summary;
  const normalizedSource = normalize(source);
  const index = normalizedSource.indexOf(normalize(query));
  const start = index > 40 ? index - 40 : 0;
  const excerpt = source.slice(start, start + 118).trim();

  if (!excerpt) return entry.summary;
  return `${start > 0 ? "..." : ""}${excerpt}${start + 118 < source.length ? "..." : ""}`;
}

function rankEntries(entries: SearchEntry[], query: string): SearchResult[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return entries
    .map((entry) => {
      const title = normalize(entry.title);
      const summary = normalize(entry.summary);
      const content = normalize(entry.content);
      let score = 0;

      for (const term of terms) {
        if (includesTerm(title, term)) score += 12;
        if (includesTerm(summary, term)) score += 6;
        if (includesTerm(content, term)) score += 2;
      }

      if (includesTerm(title, normalizedQuery)) score += 20;
      if (includesTerm(summary, normalizedQuery)) score += 10;
      if (includesTerm(content, normalizedQuery)) score += 4;

      return {
        ...entry,
        excerpt: makeExcerpt(entry, query),
        score,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
    .slice(0, MAX_RESULTS);
}

export function SearchBox({ entries, lang, placeholder }: SearchBoxProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => rankEntries(entries, query), [entries, query]);
  const hasQuery = query.trim().length > 0;
  const noResultsText = lang === "zh" ? "没有匹配结果" : "No results";

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function openFirstResult() {
    const first = results[0];
    if (!first) return;
    setOpen(false);
    inputRef.current?.blur();
    router.push(first.href);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    openFirstResult();
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      openFirstResult();
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative w-full max-w-sm"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <form
        role="search"
        onSubmit={submitSearch}
        className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-500 shadow-sm transition focus-within:border-gray-300 focus-within:text-gray-700 focus-within:ring-2 focus-within:ring-gray-900/5 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-gray-400 dark:focus-within:border-white/15 dark:focus-within:text-gray-200"
      >
        <MagnifyingGlass size={16} className="mr-2 shrink-0 opacity-60" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleInputKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-left text-gray-700 outline-none placeholder:text-gray-500 dark:text-gray-200 dark:placeholder:text-gray-400"
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
            aria-label={lang === "zh" ? "清空搜索" : "Clear search"}
          >
            <X size={12} weight="bold" />
          </button>
        ) : null}
        <kbd className="rounded-md border border-gray-200 px-1.5 py-0.5 font-mono text-[10px] text-gray-400 dark:border-white/10">
          ⌘K
        </kbd>
      </form>

      {open && hasQuery ? (
        <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10 dark:border-white/[0.08] dark:bg-zinc-950">
          {results.length > 0 ? (
            <ul className="max-h-[22rem] overflow-auto py-1.5">
              {results.map((result) => (
                <li key={result.href}>
                  <Link
                    href={result.href}
                    onClick={() => setOpen(false)}
                    className="block px-3.5 py-2.5 transition hover:bg-gray-50 focus:bg-gray-50 focus:outline-none dark:hover:bg-white/[0.06] dark:focus:bg-white/[0.06]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {result.title}
                      </span>
                      <time className="shrink-0 font-mono text-[10px] text-gray-400">
                        {result.dateLabel}
                      </time>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {result.excerpt}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3.5 py-4 text-sm text-gray-500 dark:text-gray-400">
              {noResultsText}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
