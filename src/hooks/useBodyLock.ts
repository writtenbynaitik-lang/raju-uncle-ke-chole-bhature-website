import { useEffect } from "react";

/**
 * Freezes the page behind an overlay without the scrollbar-width jump that
 * makes a fixed header twitch when a drawer opens.
 */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevPad = body.style.paddingRight;
    body.classList.add("is-locked");
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.classList.remove("is-locked");
      body.style.paddingRight = prevPad;
    };
  }, [locked]);
}
