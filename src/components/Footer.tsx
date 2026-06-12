import { formatSyncedAt } from "@/lib/format";
import type { Lang } from "@/lib/types";
import { UI } from "@/lib/i18n";

interface FooterProps {
  lang: Lang;
  syncedAt: string | null;
}

export function Footer({ lang, syncedAt }: FooterProps) {
  const t = UI[lang];
  const syncedLabel = syncedAt ? formatSyncedAt(syncedAt, lang) : "-";

  return (
    <footer className="mx-auto mt-auto w-full max-w-[96rem] border-t border-gray-100 px-4 py-10 dark:border-gray-800/50 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {t.source}:{" "}
          <a
            href="https://github.com/BuilderPulse/BuilderPulse"
            className="text-gray-700 underline decoration-gray-300 underline-offset-2 transition hover:text-gray-900 dark:text-gray-300 dark:decoration-gray-600 dark:hover:text-gray-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            BuilderPulse/BuilderPulse
          </a>
          {" · "}
          <a
            href="https://github.com/liuxiaopai-ai"
            className="text-gray-700 underline decoration-gray-300 underline-offset-2 transition hover:text-gray-900 dark:text-gray-300 dark:decoration-gray-600 dark:hover:text-gray-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            Liu Xiaopai
          </a>
        </p>
        <p className="font-mono text-xs">
          {t.syncedAt}: {syncedLabel}
        </p>
      </div>
    </footer>
  );
}