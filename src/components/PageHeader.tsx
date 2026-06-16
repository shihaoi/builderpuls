import { CopyPageButton } from "./CopyPageButton";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  copyLabel: string;
  showCopy?: boolean;
}

export function PageHeader({
  eyebrow,
  title,
  copyLabel,
  showCopy = true,
}: PageHeaderProps) {
  return (
    <header
      id="header"
      className="relative leading-none @container/page-header"
    >
      <div className="space-y-2.5">
        <div className="eyebrow h-5 text-sm font-semibold text-primary dark:text-primary-light">
          {eyebrow}
        </div>
        <div className="relative flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center">
          <h1
            id="page-title"
            className="break-words text-2xl font-bold tracking-tight text-gray-900 [overflow-wrap:break-word] [word-break:normal] dark:text-gray-200 sm:text-3xl"
          >
            {title}
          </h1>
          {showCopy && (
            <div className="ml-auto hidden min-w-[156px] shrink-0 items-center justify-end @[600px]/page-header:flex">
              <CopyPageButton label={copyLabel} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
