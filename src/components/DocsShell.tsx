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
      <div className="relative grow px-4 pb-10 sm:px-6 lg:pl-[23.7rem] lg:pr-8 xl:mr-[18rem]">
        <main className="mx-auto w-full max-w-3xl">{children}</main>
      </div>
      {toc}
    </div>
  );
}