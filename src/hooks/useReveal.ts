import { useEffect, useRef } from "react";

/**
 * Adds `is-in` once the element has scrolled into view, then stops watching.
 * Anything already on screen at load is revealed immediately, so the first
 * paint is never a page of invisible text.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Reveal on the way in — or immediately if the element is already
          // above the viewport. Without that second case, landing part-way down
          // the page (a deep link, a restored position, a reload mid-scroll)
          // leaves every section above the entry point stuck at opacity 0, and
          // scrolling back up shows blank space where the content should be.
          const alreadyPassed = e.boundingClientRect.bottom <= 0;
          if (e.isIntersecting || alreadyPassed) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    io.observe(el);

    // Last-resort safety net. If the observer never reports — a browser quirk,
    // a throttled background tab that is then brought forward — the content
    // must not stay invisible. Showing it a little early is a non-event;
    // leaving it blank during a demo is not.
    const failsafe = window.setTimeout(() => {
      el.classList.add("is-in");
      io.disconnect();
    }, 3000);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return ref;
}
