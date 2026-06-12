"use client";

import { Gear } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-600/5 dark:text-gray-400 dark:hover:bg-gray-200/5"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Gear size={18} />
    </button>
  );
}