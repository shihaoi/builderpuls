"use client";

import { CaretDown, Check, Copy } from "@phosphor-icons/react";
import { useState } from "react";

interface CopyPageButtonProps {
  label: string;
}

export function CopyPageButton({ label }: CopyPageButtonProps) {
  const [copied, setCopied] = useState(false);

  function copyWithSelection(text: string) {
    const textarea = document.createElement("textarea");
    const selection = document.getSelection();
    const selectedRange =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    textarea.value = text;
    textarea.id = "copy-page-url-buffer";
    textarea.name = "copy-page-url-buffer";
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("aria-hidden", "true");
    textarea.style.position = "fixed";
    textarea.style.inset = "0 auto auto 0";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";

    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (selection && selectedRange) {
      selection.removeAllRanges();
      selection.addRange(selectedRange);
    }

    return ok;
  }

  function markCopied() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function hasClipboardGrant() {
    if (!navigator.permissions?.query) return false;

    try {
      const status = await navigator.permissions.query({
        name: "clipboard-write" as PermissionName,
      });
      return status.state === "granted";
    } catch {
      return false;
    }
  }

  async function handleCopy() {
    const url = window.location.href;

    if (copyWithSelection(url)) {
      markCopied();
      return;
    }

    if (navigator.clipboard?.writeText && (await hasClipboardGrant())) {
      try {
        await navigator.clipboard.writeText(url);
        markCopied();
      } catch {
        /* Permission can change between the query and the write. */
      }
    }
  }

  return (
    <div
      id="page-context-menu"
      className="inline-flex items-center overflow-hidden rounded-xl border border-gray-200 bg-[var(--color-background)] dark:border-white/[0.07]"
    >
      <button
        type="button"
        id="page-context-menu-button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 border-r-0 bg-transparent px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-600/5 dark:text-gray-300 dark:hover:bg-gray-200/5"
        aria-label={label}
      >
        {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />}
        {label}
      </button>
      <button
        type="button"
        className="inline-flex items-center border-l border-gray-200 bg-transparent px-2 py-1.5 text-gray-500 transition hover:bg-gray-600/5 dark:border-white/[0.07] dark:text-gray-400 dark:hover:bg-gray-200/5"
        aria-hidden
        tabIndex={-1}
      >
        <CaretDown size={14} weight="bold" />
      </button>
    </div>
  );
}
