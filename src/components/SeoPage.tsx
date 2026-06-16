import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header, type HeaderTab } from "@/components/Header";
import type { Lang } from "@/lib/types";

interface SeoPageProps {
  lang: Lang;
  syncedAt: string | null;
  activeTab?: HeaderTab;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function SeoPage({
  lang,
  syncedAt,
  activeTab,
  eyebrow,
  title,
  description,
  children,
}: SeoPageProps) {
  return (
    <>
      <Header lang={lang} activeTab={activeTab} />
      <main className="mx-auto w-full max-w-[96rem] flex-1 px-4 pb-16 pt-[calc(var(--nav-height)+2rem)] sm:px-6 lg:px-12 lg:pt-10">
        <div className="mx-auto max-w-5xl">
          <header className="border-b border-gray-100 pb-8 dark:border-white/[0.07]">
            <p className="text-sm font-semibold text-primary dark:text-primary-light">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </header>
          <div className="mt-8">{children}</div>
        </div>
      </main>
      <Footer lang={lang} syncedAt={syncedAt} />
    </>
  );
}

interface TextLinkCardProps {
  href: string;
  title: string;
  description: string;
  meta?: string;
}

export function TextLinkCard({
  href,
  title,
  description,
  meta,
}: TextLinkCardProps) {
  return (
    <Link
      href={href}
      className="group block border-b border-gray-100 px-1 py-5 transition hover:bg-gray-600/5 dark:border-gray-800/60 dark:hover:bg-gray-200/5"
    >
      {meta ? (
        <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {meta}
        </p>
      ) : null}
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-gray-900 group-hover:text-primary dark:text-gray-200 dark:group-hover:text-primary-light">
        {title}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </Link>
  );
}
