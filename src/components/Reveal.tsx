import type { CSSProperties, ElementType, ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

interface Props {
  children: ReactNode;
  /** Stagger, in ms, against the rest of its group. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/** Wraps a block so it fades up the first time it reaches the viewport. */
export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: Props) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
