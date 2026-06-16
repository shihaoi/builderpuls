import { Translate } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { getSearchEntries } from "@/lib/content";
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
  const searchEntries = getSearchEntries(lang);

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
      <div className="absolute h-full w-full flex-none border-b border-gray-500/5 backdrop-blur transition-colors duration-500 supports-backdrop-blur:bg-[rgb(253,253,247)]/95 dark:border-gray-300/[0.06] dark:supports-backdrop-blur:bg-[rgb(9,9,11)]/75" />

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

          </div>

          <div className="hidden max-w-md flex-1 justify-center lg:flex">
            <SearchBox
              entries={searchEntries}
              lang={lang}
              placeholder={t.searchPlaceholder}
            />
          </div>

          <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Link
              href={altHref}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-600/5 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-200/5 dark:hover:text-gray-200 lg:hidden"
              aria-label={t.langSwitch}
              title={t.langSwitch}
            >
              <Translate size={18} />
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
