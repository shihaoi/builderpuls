import { GithubLogo } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/lib/types";
import { UI, otherLang } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  lang: Lang;
  alternateDate?: string;
}

export function Header({ lang, alternateDate }: HeaderProps) {
  const t = UI[lang];
  const alt = otherLang(lang);
  const altHref = alternateDate ? `/${alt}/${alternateDate}` : `/${alt}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={`/${lang}`}
          className="group flex min-w-0 items-center gap-3"
        >
          <Image
            src="/logo.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-lg transition group-hover:brightness-110"
            priority
          />
          <div className="min-w-0 leading-tight">
            <span className="block truncate font-semibold tracking-tight text-foreground">
              {t.siteName}
            </span>
            <span className="hidden truncate font-mono text-[11px] text-text-muted sm:block">
              {lang === "zh" ? "indie hacker daily" : "daily build brief"}
            </span>
          </div>
        </Link>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href={`/${lang}`}
            className="hidden rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-surface hover:text-foreground sm:inline-flex"
          >
            {t.latest}
          </Link>
          <Link
            href={`/${lang}#archive`}
            className="hidden rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-surface hover:text-foreground md:inline-flex"
          >
            {t.archive}
          </Link>
          <a
            href="https://github.com/BuilderPulse/BuilderPulse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface hover:text-foreground active:scale-[0.98]"
            aria-label="GitHub"
          >
            <GithubLogo size={20} weight="duotone" />
          </a>
          <ThemeToggle />
          <Link
            href={altHref}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-accent/40 hover:text-accent active:scale-[0.98]"
          >
            {t.langSwitch}
          </Link>
        </nav>
      </div>
    </header>
  );
}