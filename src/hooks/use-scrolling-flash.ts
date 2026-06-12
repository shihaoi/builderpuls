"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollingFlash<T extends HTMLElement>(
  hideDelay = 700,
) {
  const ref = useRef<T>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      setIsScrolling(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsScrolling(false), hideDelay);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hideDelay]);

  return { ref, isScrolling };
}