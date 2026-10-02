/** The north-east arrow that follows every outbound or opening action. */
export function Arrow() {
  return (
    <svg
      className="arw"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1.5 9.5 9.5 1.5M9.5 1.5H3.2M9.5 1.5v6.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
    </svg>
  );
}
