"use client";

import { Moon, Sun } from "@phosphor-icons/react";
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

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    const root = document.documentElement;

    root.classList.add("theme-switching");
    applyTheme(next);
    window.setTimeout(() => {
      root.classList.remove("theme-switching");
    }, 120);
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
