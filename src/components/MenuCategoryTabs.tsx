import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Category, CategoryId } from "../data/menu";
import "./MenuCategoryTabs.css";

interface Props {
  categories: Category[];
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}

/**
 * A tablist with roving focus and one sliding indicator. The indicator is
 * measured rather than guessed, so it stays correct at any text size.
 */
export function MenuCategoryTabs({ categories, active, onChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ink, setInk] = useState({ x: 0, w: 0 });

  const measure = useCallback(() => {
    const el = btnRefs.current[active];
    const scroller = scrollRef.current;
    if (!el || !scroller) return;
    setInk({ x: el.offsetLeft - scroller.scrollLeft, w: el.offsetWidth });
  }, [active]);

  useEffect(() => {
    measure();
    const scroller = scrollRef.current;
    if (!scroller) return;

    const ro = new ResizeObserver(measure);
    ro.observe(scroller);
    Object.values(btnRefs.current).forEach((b) => b && ro.observe(b));
    scroller.addEventListener("scroll", measure, { passive: true });

    // Web fonts land after first paint and change the tab widths.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      ro.disconnect();
      scroller.removeEventListener("scroll", measure);
    };
  }, [measure]);

  // Keep the selected tab in view when it is chosen from off-screen. Skipped on
  // the first run: scrollIntoView scrolls every scrollable ancestor, including
  // the document, so firing it on mount would drag the whole page down to the
  // menu before the visitor has seen the hero.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    btnRefs.current[active]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [active]);

  const onKeyDown = (e: KeyboardEvent) => {
    const i = categories.findIndex((c) => c.id === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % categories.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + categories.length) % categories.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = categories.length - 1;
    else return;
    e.preventDefault();
    const id = categories[next].id;
    onChange(id);
    btnRefs.current[id]?.focus();
  };

  const note = categories.find((c) => c.id === active)?.note;

  return (
    <div className="tabs">
      <div className="tabs__scroll" ref={scrollRef}>
        <div
          role="tablist"
          aria-label="Menu categories"
          onKeyDown={onKeyDown}
          style={{ display: "contents" }}
        >
          {categories.map((c) => (
            <button
              key={c.id}
              ref={(el) => {
                btnRefs.current[c.id] = el;
              }}
              id={`tab-${c.id}`}
              className="tabs__btn"
              role="tab"
              type="button"
              aria-selected={c.id === active}
              aria-controls={`panel-${c.id}`}
              tabIndex={c.id === active ? 0 : -1}
              onClick={() => onChange(c.id)}
            >
              {c.label}
              <sup>{String(c.items.length).padStart(2, "0")}</sup>
            </button>
          ))}
        </div>
      </div>
      <div className="tabs__rail">
        <span
          className="tabs__ink"
          style={{ transform: `translateX(${ink.x}px)`, width: ink.w }}
          aria-hidden="true"
        />
      </div>
      <p className="tabs__note">{note}</p>
    </div>
  );
}
