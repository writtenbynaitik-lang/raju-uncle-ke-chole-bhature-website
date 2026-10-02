import { useCallback, useEffect, useRef, useState } from "react";
import { nav, site } from "../data/site";
import { useActiveSection } from "../hooks/useActiveSection";
import { useScrolled } from "../hooks/useScrolled";
import { Arrow } from "./Arrow";
import "./Navigation.css";

const SECTION_IDS = ["menu", "story", "visit"] as const;

interface Props {
  onOrder: () => void;
}

export function Navigation({ onOrder }: Props) {
  const [open, setOpen] = useState(false);
  const stuck = useScrolled(20);
  const active = useActiveSection(SECTION_IDS);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Escape closes the sheet and hands focus back to the control that opened it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Widening past the mobile breakpoint must not leave an orphaned sheet open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 60rem)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className={`nav ${stuck ? "is-stuck" : ""}`}>
        <div className="nav__in">
          <a className="nav__mark" href="#top" onClick={close}>
            <span className="nav__mark-name">Raju Uncle</span>
            <span className="nav__mark-rest">Ke Chole Bhature</span>
          </a>

          <nav className="nav__links" aria-label="Sections">
            {nav.map((l) => (
              <a
                key={l.href}
                className="nav__link"
                href={l.href}
                aria-current={active === l.href.slice(1) ? "true" : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <button
            className="btn btn--saffron btn--sm nav__cta"
            onClick={onOrder}
            data-order-trigger
          >
            Order <Arrow />
          </button>

          <button
            ref={burgerRef}
            className="nav__burger"
            aria-expanded={open}
            aria-controls="nav-sheet"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={`nav__scrim ${open ? "is-open" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      <div
        id="nav-sheet"
        ref={sheetRef}
        className={`nav__sheet ${open ? "is-open" : ""}`}
        hidden={!open}
      >
        <nav aria-label="Menu">
          {nav.map((l, i) => (
            <a key={l.href} className="nav__sheet-link" href={l.href} onClick={close}>
              {l.label}
              <span>{String(i + 1).padStart(2, "0")}</span>
            </a>
          ))}
        </nav>
        <div className="nav__sheet-foot">
          <button
            className="btn btn--saffron"
            onClick={() => {
              close();
              onOrder();
            }}
          >
            Order now <Arrow />
          </button>
          <a className="btn btn--ghost" href={site.phoneHref}>
            Call {site.phone}
          </a>
        </div>
      </div>
    </>
  );
}
