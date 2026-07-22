"use client";

import { useState, useRef, useEffect } from "react";
import { Translate } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { Lang } from "@/lib/types";
import { ALL_LANGS, LANG_NAMES } from "@/lib/i18n";

interface LanguageSelectorProps {
  lang: Lang;
  alternateDate?: string;
}

export function LanguageSelector({ lang, alternateDate }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const otherLangs = ALL_LANGS.filter((l) => l !== lang);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-600/5 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-200/5 dark:hover:text-gray-200"
        aria-label={LANG_NAMES[lang]}
        title={LANG_NAMES[lang]}
      >
        <Translate size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[10rem] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            {LANG_NAMES[lang]}
          </div>
          {otherLangs.map((l) => {
            const href = alternateDate ? `/${l}/${alternateDate}` : `/${l}`;
            return (
              <Link
                key={l}
                href={href}
                onClick={() => setOpen(false)}
                className="block px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {LANG_NAMES[l]}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
