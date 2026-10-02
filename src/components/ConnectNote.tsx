import { useId, useState } from "react";
import { Arrow } from "./Arrow";
import "./ConnectNote.css";

interface Props {
  label: string;
  /** What would be wired up here, and what has to be confirmed first. */
  note: string;
  className?: string;
}

/**
 * Used wherever the real destination is not verified for this restaurant — the
 * map pin and the ordering handoff. Clicking explains what would connect here
 * rather than guessing at a URL or leaving the button doing nothing.
 */
export function ConnectNote({ label, note, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className={`connect ${className}`.trim()}>
      <button
        className="btn btn--ghost"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
      >
        {label} <Arrow />
      </button>
      {open && (
        <p className="connect__panel" id={id}>
          <span className="connect__mark" aria-hidden="true">
            i
          </span>
          <span>{note}</span>
        </p>
      )}
    </div>
  );
}
