import type { ReactNode } from "react";

interface DocsShellProps {
  sidebar: ReactNode;
  toc?: ReactNode;
  children: ReactNode;
}

export function DocsShell({ sidebar, toc, children }: DocsShellProps) {
  return (
    <div className="scroll-mt-[var(--scroll-mt)] mx-auto w-full max-w-[96rem] flex-1">
      {sidebar}
      <div className="relative grow px-4 pb-10 pt-8 sm:px-6 lg:pl-[23.7rem] lg:pr-8 lg:pt-10">
        <div className="mx-auto flex w-full max-w-3xl items-stretch gap-8 xl:max-w-[calc(48rem+16.5rem+2rem)]">
          <main className="min-w-0 flex-1 max-w-3xl">{children}</main>
          {toc ? (
            <div className="hidden w-[16.5rem] shrink-0 self-stretch xl:block">
              {toc}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
