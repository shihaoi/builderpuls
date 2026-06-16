"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import type { MouseEvent } from "react";
import { useSyncExternalStore } from "react";

const THEME_CHANGE_EVENT = "builderpulse-theme-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

function applyTheme(next: boolean) {
  document.documentElement.classList.toggle("dark", next);
  document.documentElement.classList.toggle("light", !next);
  localStorage.setItem("theme", next ? "dark" : "light");
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function runFallbackWipe(next: boolean) {
  const overlay = document.createElement("div");
  overlay.className = "theme-transition-wipe";
  overlay.style.setProperty(
    "--theme-wipe-color",
    next
      ? "color-mix(in srgb, var(--background) 50%, transparent)"
      : "color-mix(in srgb, var(--background) 85%, transparent)",
  );

  document.documentElement.classList.add("theme-transitioning");
  document.body.appendChild(overlay);
  applyTheme(next);

  window.setTimeout(() => {
    overlay.remove();
    document.documentElement.classList.remove("theme-transitioning");
  }, 820);
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next = !document.documentElement.classList.contains("dark");
    const transitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => {
        ready: Promise<void>;
      };
    };
    const shouldReduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!transitionDocument.startViewTransition || shouldReduceMotion) {
      if (shouldReduceMotion) {
        applyTheme(next);
      } else {
        runFallbackWipe(next);
      }
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const transition = transitionDocument.startViewTransition(() => {
      applyTheme(next);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 760,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-600/5 dark:text-gray-400 dark:hover:bg-gray-200/5"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
