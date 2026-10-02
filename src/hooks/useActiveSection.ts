import { useEffect, useState } from "react";

/** Which section id is currently under the header — drives the nav underline. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const state = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        // Track every section's state, not just this batch, so that scrolling
        // out of the last one clears the marker instead of leaving it lit.
        for (const e of entries) state.set(e.target.id, e.isIntersecting);
        const lit = ids.find((id) => state.get(id));
        setActive(lit ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}
