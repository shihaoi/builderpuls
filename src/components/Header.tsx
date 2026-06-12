import { GithubLogo, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/lib/types";
import { UI, otherLang } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";

export type HeaderTab = "read" | "archive" | "source";

interface HeaderProps {
  lang: Lang;
  activeTab?: HeaderTab;
  alternateDate?: string;
}

export function Header({
  lang,
  activeTab = "read",
  alternateDate,
}: HeaderProps) {
  const t = UI[lang];
  const alt = otherLang(lang);
  const altHref = alternateDate ? `/${alt}/${alternateDate}` : `/${alt}`;

  const tabs: { id: HeaderTab; label: string; href: string; external?: boolean }[] =
    [
      { id: "read", label: t.tabRead, href: `/${lang}` },
      { id: "archive", label: t.tabArchive, href: `/${lang}#archive` },
      {
        id: "source",
        label: t.tabSource,
        href: "https://github.com/BuilderPulse/BuilderPulse",
        external: true,
      },
    ];

  return (
    <header
      id="navbar"
      className="peer fixed top-0 z-30 w-full lg:sticky"
      style={{ ["--nav-height" as string]: "7rem" }}
    >
      <div className="absolute h-full w-full flex-none border-b border-gray-500/5 backdrop-blur transition-colors duration-500 supports-backdrop-blur:bg-background/60 dark:border-gray-300/[0.06] dark:supports-backdrop-blur:bg-[rgb(9,9,11)]/75" />

      <div className="relative mx-auto max-w-[96rem]">
        <div className="relative mx-4 flex h-16 min-w-0 items-center gap-x-4 border-b border-gray-500/5 dark:border-gray-300/[0.06] lg:mx-0 lg:px-12">
          <div className="flex min-w-0 flex-1 items-center gap-x-4">
            <Link href={`/${lang}`} className="flex shrink-0 items-center gap-2.5">
              <Image
                src="/logo.svg"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 shrink-0"
                priority
              />
              <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t.siteName}
              </span>
            </Link>

            <button
              type="button"
              className="hidden items-center gap-2 rounded-xl border-0 bg-transparent px-2 py-1 text-sm text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 md:inline-flex"
              aria-label={t.langSwitch}
            >
              <span>{lang === "zh" ? "简体中文" : "English"}</span>
              <span className="text-xs opacity-60">▾</span>
            </button>
          </div>

          <div className="hidden max-w-sm flex-1 lg:flex">
            <div className="pointer-events-none flex h-9 w-full items-center rounded-xl border border-gray-200/80 bg-background px-3.5 text-sm text-gray-500 dark:border-white/[0.08] dark:bg-background dark:text-gray-400">
              <MagnifyingGlass size={16} className="mr-2 shrink-0 opacity-70" />
              <span>{t.searchPlaceholder}</span>
              <span className="ml-auto rounded-md border border-gray-200/80 px-1.5 py-0.5 font-mono text-[10px] text-gray-400 dark:border-white/10">
                ⌘K
              </span>
            </div>
          </div>

          <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
            <a
              href="https://github.com/BuilderPulse/BuilderPulse"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 whitespace-nowrap px-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 sm:inline-flex"
            >
              {t.upstreamRepo}
            </a>
            <a
              href="https://github.com/liuxiaopai-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative hidden items-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-background transition hover:opacity-90 dark:bg-gray-100 dark:text-gray-900 lg:inline-flex"
            >
              {t.ctaAuthor}
            </a>
            <a
              href="https://github.com/BuilderPulse/BuilderPulse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-600/5 dark:text-gray-400 dark:hover:bg-gray-200/5"
              aria-label="GitHub"
            >
              <GithubLogo size={20} weight="duotone" />
            </a>
            <ThemeToggle />
            <Link
              href={altHref}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-600/5 dark:border-white/[0.07] dark:text-gray-300 dark:hover:bg-gray-200/5"
            >
              {t.langSwitch}
            </Link>
          </nav>
        </div>

        <div className="relative hidden h-12 px-12 lg:flex">
          {tabs.map((tab) =>
            tab.external ? (
              <a
                key={tab.id}
                href={tab.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`nav-tabs-item px-3 ${activeTab === tab.id ? "is-active" : ""}`}
              >
                {tab.label}
              </a>
            ) : (
              <Link
                key={tab.id}
                href={tab.href}
                className={`nav-tabs-item px-3 ${activeTab === tab.id ? "is-active" : ""}`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </header>
  );
}