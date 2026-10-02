/**
 * Every fact on this site lives here, so a real client build can be re-pointed
 * by editing one file.
 *
 * SOURCING RULE — read before adding anything.
 *
 * Several businesses trade under the name "Raju Uncle Ke Chole Bhature", and
 * the aggregator listings for them are easy to mix up. Only two sources count
 * as verified for THIS prospect:
 *
 *   1. the restaurant's own site, rajuunclekecholebhature.com
 *   2. the prospect record (phone number, area)
 *
 * Anything from Google/Zomato/JustDial/TripAdvisor/restaurant-guru is NOT
 * verified, because it cannot be proven to describe this branch rather than a
 * similarly named one. Those details are deliberately absent, and the page is
 * written so that their absence reads as restraint rather than as a gap.
 *
 * Marketing copy is written as marketing copy, never as fact.
 */

export const site = {
  /** Verified: the restaurant's own site. */
  name: "Raju Uncle Ke Chole Bhature",
  shortName: "Raju Uncle",
  nameHindi: "राजू अंकल के छोले भटूरे",

  /** Verified: the restaurant's own line, carried over from their site. */
  tagline: "Taste the Tradition!",

  /** Marketing copy, framed as such — no superlative, no comparison. */
  heroLine: "Hot bhature. Spiced chole. That's the plan.",
  heroSupport: "Come hungry.",
  kicker: "North Indian comfort food",

  /**
   * From the prospect brief. Deliberately no street line and no PIN: the
   * street address and postcode on the public listings could not be tied to
   * this branch rather than to another business of the same name.
   */
  address: {
    line1: "Bharati Vihar",
    line2: "Katraj–Dhankawadi",
    city: "Pune",
    area: "Katraj · Pune",
  },

  /** Verified: the number on the prospect record. */
  phone: "+91 98237 87513",
  phoneHref: "tel:+919823787513",

  /**
   * Hours are NOT published on the restaurant's own site, and the times on the
   * public listings cannot be tied to this branch. So the page asks rather than
   * tells. Fill `display` in once the restaurant confirms, and the line below
   * is replaced automatically.
   */
  hours: {
    display: null as string | null,
    fallback: "Call ahead to check today's timings.",
  },

  /**
   * Channels that exist but are not yet confirmed for this restaurant. Each one
   * renders as a labelled demo state instead of a dead button or an invented
   * link, and flips to live the moment it is confirmed.
   */
  connect: {
    directions:
      "Directions can be wired to the restaurant's own Google listing once it is confirmed — this concept does not guess at a map pin.",
    ordering:
      "Ordering can be connected here — WhatsApp, a delivery partner, or a simple call-back — once the restaurant confirms which it uses.",
  },

  concept: {
    note: "Website concept created as a visual showcase for Raju Uncle Ke Chole Bhature.",
    orderNote:
      "This ordering flow is part of the concept. Nothing is sent, and no payment or personal detail is collected.",
  },
} as const;

export const nav = [
  { label: "Home", href: "#top" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#story" },
  { label: "Visit", href: "#visit" },
] as const;

/** Hindi words used as accents. Kept few, kept correct. */
export const hindi = {
  choleBhature: "छोले भटूरे",
  garam: "गरम",
  lassi: "लस्सी",
  samosa: "समोसा",
} as const;
