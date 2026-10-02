import { useEffect, useMemo, useRef, useState } from "react";
import { allItems, itemById } from "../data/menu";
import { site } from "../data/site";
import { useBodyLock } from "../hooks/useBodyLock";
import { Arrow } from "./Arrow";
import { ConnectNote } from "./ConnectNote";
import { OrderSummary } from "./OrderSummary";
import { Picture } from "./Picture";
import "./OrderDrawer.css";

interface Props {
  open: boolean;
  basket: Record<string, number>;
  onClose: () => void;
  onSet: (id: string, qty: number) => void;
  onClear: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** The shortlist the drawer opens with, before anyone scrolls. */
const QUICK = ["chole-bhature", "paneer-bhature", "extra-bhatura", "samosa", "lassi", "chai"];

function buildSlip(basket: Record<string, number>) {
  const lines = Object.entries(basket)
    .filter(([, q]) => q > 0)
    .map(([id, q]) => `• ${q} × ${itemById[id]?.name ?? id}`);
  return [
    `Order for ${site.name}`,
    "",
    ...(lines.length ? lines : ["(nothing picked yet)"]),
    "",
    "Please confirm the total and how long it will take.",
  ].join("\n");
}

export function OrderDrawer({ open, basket, onClose, onSet, onClear }: Props) {
  const [step, setStep] = useState<"pick" | "review">("pick");
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const restoreTo = useRef<Element | null>(null);

  useBodyLock(open);

  const count = useMemo(
    () => Object.values(basket).reduce((n, q) => n + q, 0),
    [basket],
  );
  const slip = useMemo(() => buildSlip(basket), [basket]);

  // Opening: remember what had focus, move focus into the panel. Closing: give
  // it back, so the keyboard never lands at the top of the document. The
  // trigger can be anywhere on the page, and it may have been re-rendered or
  // scrolled out while the drawer was up, so the header's Order button is the
  // fallback rather than letting focus fall to <body>.
  useEffect(() => {
    if (open) {
      const from = document.activeElement;
      restoreTo.current =
        from instanceof HTMLElement && from !== document.body ? from : null;
      setStep("pick");
      const id = window.setTimeout(() => titleRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
    const prev = restoreTo.current as HTMLElement | null;
    const target =
      prev?.isConnected && prev.offsetParent !== null
        ? prev
        : document.querySelector<HTMLElement>("[data-order-trigger]");
    target?.focus({ preventScroll: true });
  }, [open]);

  // Escape closes; Tab is kept inside the panel while it is modal.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  const quickItems = QUICK.map((id) => itemById[id]).filter(Boolean);
  const extras = allItems.filter((i) => !QUICK.includes(i.id));

  const row = (id: string) => {
    const item = itemById[id];
    const qty = basket[id] ?? 0;
    return (
      <div className={`pick ${qty > 0 ? "is-on" : ""}`} key={id}>
        <div className="pick__img">
          <Picture name={item.image} alt="" sizes="52px" />
        </div>
        <div>
          <h3 className="pick__name">{item.name}</h3>
          <p className="pick__meta">
            <span className="veg" aria-hidden="true" />
            Veg
          </p>
        </div>
        <div className="step">
          <button
            className="step__b"
            onClick={() => onSet(id, Math.max(0, qty - 1))}
            disabled={qty === 0}
            aria-label={`One less ${item.name}`}
          >
            &minus;
          </button>
          <span className="step__n" aria-live="polite" aria-label={`${item.name} quantity`}>
            {qty}
          </span>
          <button
            className="step__b"
            onClick={() => onSet(id, Math.min(20, qty + 1))}
            disabled={qty >= 20}
            aria-label={`One more ${item.name}`}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`drawer__scrim ${open ? "is-open" : ""}`}
        onClick={onClose}
        hidden={!open}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={`drawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        hidden={!open}
      >
        <div className="drawer__head">
          <h2 className="drawer__title" id="drawer-title" ref={titleRef} tabIndex={-1}>
            {step === "pick" ? "What are we getting you?" : "Ready to order"}
          </h2>
          <p className="drawer__sub">
            {step === "pick"
              ? "Pick what you want. The kitchen confirms the total when you order."
              : "Here is the order. Call the shop and read it out — the total is confirmed at the counter."}
          </p>
          <button className="drawer__close" onClick={onClose} aria-label="Close order">
            &times;
          </button>
        </div>

        <div className="drawer__body">
          {step === "pick" ? (
            <>
              <div className="drawer__group">
                <p className="drawer__glabel">The usual</p>
                {quickItems.map((i) => row(i.id))}
              </div>

              <div className="drawer__group">
                <p className="drawer__glabel">Anything else</p>
                {extras.map((i) => row(i.id))}
              </div>

              <OrderSummary basket={basket} onRemove={(id) => onSet(id, 0)} />
            </>
          ) : (
            <div className="review">
              <OrderSummary basket={basket} onRemove={(id) => onSet(id, 0)} />
              <p className="review__msg">{slip}</p>
              <ConnectNote
                label="Other ways to order"
                note={site.connect.ordering}
              />
            </div>
          )}
        </div>

        <div className="drawer__foot">
          <div className="drawer__actions">
            {step === "pick" ? (
              <>
                <button
                  className="btn btn--saffron"
                  onClick={() => setStep("review")}
                  disabled={count === 0}
                  style={count === 0 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                >
                  Review order <Arrow />
                </button>
                <a className="btn btn--ghost" href={site.phoneHref}>
                  Call instead
                </a>
              </>
            ) : (
              <>
                <a className="btn btn--saffron" href={site.phoneHref}>
                  Call to order <Arrow />
                </a>
                <button className="btn btn--ghost" onClick={() => setStep("pick")}>
                  Back
                </button>
              </>
            )}
          </div>
          <div className="drawer__fine">
            <p className="drawer__demo">{site.concept.orderNote}</p>
            {count > 0 && step === "pick" && (
              <button className="drawer__clear" onClick={onClear}>
                Clear order
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
