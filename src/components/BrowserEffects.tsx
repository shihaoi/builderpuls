"use client";

import { useEffect, useLayoutEffect } from "react";

const CLARITY_ID = "x7tgtknj61";

type ClarityFunction = ((...args: unknown[]) => void) & {
  q?: unknown[][];
};

type WindowWithClarity = Window & {
  clarity?: ClarityFunction;
};

const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function ThemeBootstrap() {
  useBrowserLayoutEffect(() => {
    for (const attribute of Array.from(document.documentElement.attributes)) {
      if (attribute.name.startsWith("trancy-")) {
        document.documentElement.removeAttribute(attribute.name);
      }
    }

    const theme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = theme === "dark" || (!theme && prefersDark);

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, []);

  return null;
}

export function ClarityAnalytics() {
  useEffect(() => {
    const win = window as WindowWithClarity;

    win.clarity =
      win.clarity ??
      ((...args: unknown[]) => {
        const clarity = win.clarity;
        if (!clarity) return;
        clarity.q = clarity.q ?? [];
        clarity.q.push(args);
      });

    if (document.querySelector(`script[data-clarity-id="${CLARITY_ID}"]`)) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    script.dataset.clarityId = CLARITY_ID;
    document.head.appendChild(script);
  }, []);

  return null;
}
