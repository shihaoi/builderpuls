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
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-8 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          {t.source}:{" "}
          <a
            href="https://github.com/BuilderPulse/BuilderPulse"
            className="text-text-secondary underline decoration-border underline-offset-2 transition hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            BuilderPulse/BuilderPulse
          </a>
          {" · "}
          <a
            href="https://github.com/liuxiaopai-ai"
            className="text-text-secondary underline decoration-border underline-offset-2 transition hover:text-accent"
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