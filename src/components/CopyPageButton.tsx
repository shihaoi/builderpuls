"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useState } from "react";

interface CopyPageButtonProps {
  label: string;
}

export function CopyPageButton({ label }: CopyPageButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-l-xl border border-gray-200 bg-background px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-600/5 dark:border-white/[0.07] dark:bg-background dark:text-gray-300 dark:hover:bg-gray-200/5"
      aria-label={label}
    >
      {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />}
      {label}
    </button>
  );
}