import Image from "next/image";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { getSearchEntries } from "@/lib/content";
import type { Lang } from "@/lib/types";
import { UI } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";

export type HeaderTab =
  | "read"
  | "archive"
  | "topics"
  | "buildIdeas"
  | "for"
  | "methodology"
  | "source";

export interface HeaderSectionLink {
  id: string;
  label: string;
}

interface HeaderProps {
  lang: Lang;
  activeTab?: HeaderTab;
  alternateDate?: string;
  sectionLinks?: HeaderSectionLink[];
}

export function Header({
  lang,
  activeTab = "read",
  alternateDate,
  sectionLinks = [],
}: HeaderProps) {
  const t = UI[lang];
  const searchEntries = getSearchEntries(lang);

  const tabs: {
    id: HeaderTab;
    label: string;
    href: string;
    external?: boolean;
  }[] = [
    { id: "read", label: t.tabRead, href: `/${lang}` },
    { id: "archive", label: t.tabArchive, href: `/${lang}/archive` },
    { id: "topics", label: t.tabTopics, href: `/${lang}/topics` },
    { id: "buildIdeas", label: t.tabBuildIdeas, href: `/${lang}/build-ideas` },
    { id: "for", label: t.tabFor, href: `/${lang}/for` },
    { id: "methodology", label: t.tabMethodology, href: `/${lang}/methodology` },
    { id: "source", label: t.tabSource, href: `/${lang}/sources` },
  ];

  return (
    <header
      id="navbar"
      className="peer fixed top-0 z-30 w-full lg:sticky"
      style={{ ["--nav-height" as string]: "7rem" }}
    >
      <div className="absolute h-full w-full flex-none border-b border-border/70 bg-background/95 backdrop-blur dark:border-border/80 dark:bg-background/75" />

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
            <LanguageSelector lang={lang} alternateDate={alternateDate} />
          </nav>
        </div>

        <div className="relative hidden h-12 items-center overflow-x-auto px-12 lg:flex">
          {sectionLinks.length > 0 ? (
            <nav
              className="flex min-w-0 items-center gap-2"
              aria-label={t.onThisPage}
            >
              {sectionLinks.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="section-tabs-item"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          ) : (
            tabs.map((tab) =>
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
            )
          )}
        </div>
      </div>
    </header>
  );
}
