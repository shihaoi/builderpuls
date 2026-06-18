import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/lib/types";
import { UI } from "@/lib/i18n";

interface FooterProps {
  lang: Lang;
  syncedAt: string | null;
}

export function Footer({ lang }: FooterProps) {
  const t = UI[lang];

  const columns = [
    {
      title: lang === "zh" ? "探索" : "Explore",
      links: [
        { label: t.tabRead, href: `/${lang}`, external: false },
        { label: t.tabArchive, href: `/${lang}/archive`, external: false },
        { label: t.tabTopics, href: `/${lang}/topics`, external: false },
        {
          label: t.tabBuildIdeas,
          href: `/${lang}/build-ideas`,
          external: false,
        },
        { label: t.tabFor, href: `/${lang}/for`, external: false },
      ],
    },
    {
      title: lang === "zh" ? "关于" : "About",
      links: [
        {
          label: t.tabMethodology,
          href: `/${lang}/methodology`,
          external: false,
        },
        {
          label: t.tabSource,
          href: `/${lang}/sources`,
          external: false,
        },
        {
          label: lang === "zh" ? "关于本站" : "About BuilderPulse",
          href: `/${lang}/about`,
          external: false,
        },
      ],
    },
    {
      title: lang === "zh" ? "法务" : "Legal",
      links: [
        {
          label: lang === "zh" ? "隐私说明" : "Privacy Notice",
          href: `/${lang}/privacy`,
          external: false,
        },
        {
          label: lang === "zh" ? "用户协议" : "Terms of Use",
          href: `/${lang}/terms`,
          external: false,
        },
        {
          label: lang === "zh" ? "English" : "简体中文",
          href: lang === "zh" ? "/en" : "/zh",
          external: false,
        },
      ],
    },
  ];

  return (
    <footer
      id="site-footer"
      className="mx-auto mt-auto w-full max-w-[96rem] border-t border-gray-100 px-4 py-16 dark:border-gray-800/50 sm:px-6 lg:px-12"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 shrink-0"
          />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t.siteName}
          </span>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                {column.title}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {link.label}
                      </a>
                    ) : link.href === "#" ? (
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {link.label}
                      </span>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
