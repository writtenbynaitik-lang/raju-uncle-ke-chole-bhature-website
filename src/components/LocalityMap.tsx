/**
 * A drawn locality sketch rather than an embedded map: no third-party script,
 * no tracking, no API key, and it still answers "where is this?" at a glance.
 * Clearly diagrammatic and labelled as such — the real directions are one tap
 * away on the button beneath it.
 */
export function LocalityMap() {
  return (
    <svg
      className="map__svg"
      viewBox="0 0 400 300"
      role="img"
      aria-label="Sketch of the location: Bharati Vihar, in the Katraj–Dhankawadi area of south Pune."
    >
      <rect width="400" height="300" fill="var(--paper-3)" />

      {/* blocks */}
      <g fill="var(--paper-4)">
        <rect x="18" y="26" width="120" height="78" rx="2" />
        <rect x="255" y="20" width="128" height="62" rx="2" />
        <rect x="20" y="196" width="104" height="86" rx="2" />
        <rect x="238" y="188" width="146" height="94" rx="2" />
        <rect x="160" y="26" width="64" height="48" rx="2" />
      </g>

      {/* the main road */}
      <path
        d="M-10 152 H410"
        stroke="var(--cocoa)"
        strokeWidth="13"
        strokeLinecap="butt"
        opacity="0.9"
      />
      <path
        d="M-10 152 H410"
        stroke="var(--paper-3)"
        strokeWidth="1.5"
        strokeDasharray="10 9"
      />

      {/* side roads */}
      <g stroke="var(--cocoa)" strokeWidth="6" opacity="0.32">
        <path d="M150 -10 V310" />
        <path d="M232 152 V310" />
      </g>

      {/* labels */}
      <g
        fill="var(--muted)"
        fontFamily="var(--f-body)"
        fontSize="10"
        fontWeight="600"
        letterSpacing="1.6"
      >
        <text x="24" y="128">KATRAJ</text>
        <text x="300" y="128">DHANKAWADI</text>
        <text x="24" y="296">BHARATI VIHAR</text>
      </g>
      <text
        x="196"
        y="146"
        fill="var(--paper-3)"
        fontFamily="var(--f-body)"
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="1.4"
        textAnchor="middle"
      >
        SOUTH PUNE
      </text>

      {/* the pin */}
      <g transform="translate(186 186)">
        <circle r="26" fill="var(--saffron)" opacity="0.2" />
        <circle r="15" fill="var(--saffron)" opacity="0.35" />
        <path
          d="M0-13a9.5 9.5 0 0 0-9.5 9.5C-9.5 3.6 0 14 0 14s9.5-10.4 9.5-17.5A9.5 9.5 0 0 0 0-13z"
          fill="var(--chilli)"
        />
        <circle cy="-3.6" r="3.4" fill="var(--paper)" />
      </g>
      <text
        x="186"
        y="216"
        fill="var(--cocoa)"
        fontFamily="var(--f-display)"
        fontSize="15"
        fontWeight="700"
        letterSpacing="0.3"
        textAnchor="middle"
      >
        RAJU UNCLE
      </text>
    </svg>
  );
}
