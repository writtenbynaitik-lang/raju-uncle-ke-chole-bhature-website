import type { ReactNode } from "react";
import "./SectionLabel.css";

interface Props {
  children: ReactNode;
  /** Drops the saffron dash — for labels sitting inside tight compositions. */
  plain?: boolean;
  /** Neutral colour, for metadata rather than section headers. */
  muted?: boolean;
  className?: string;
  id?: string;
}

/** The small all-caps metadata line that opens most sections. */
export function SectionLabel({ children, plain, muted, className = "", id }: Props) {
  return (
    <p
      id={id}
      className={`slabel ${plain ? "slabel--plain" : ""} ${muted ? "slabel--n" : ""} ${className}`.trim()}
    >
      {children}
    </p>
  );
}
