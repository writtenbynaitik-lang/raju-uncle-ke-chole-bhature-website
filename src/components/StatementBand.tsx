import { hindi, site } from "../data/site";
import "./StatementBand.css";

const ITEMS = [
  { deva: hindi.choleBhature, text: "Chole Bhature" },
  { text: site.tagline.replace(/!$/, "") },
  { deva: hindi.garam, text: "Straight out of the kadhai" },
  { text: site.address.area },
  { deva: hindi.lassi, text: "Sweet, thick and cold" },
  { text: "Pure vegetarian · North Indian" },
];

/** The running board. Duplicated once so the loop can be seamless. */
export function StatementBand() {
  const group = (
    <div className="band__group">
      {ITEMS.map((it, i) => (
        <span className="band__item" key={i}>
          {it.deva && <span className="deva">{it.deva}</span>}
          <span>{it.text}</span>
          <span className="band__dot" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="band">
      <div className="band__track">
        {group}
        <div aria-hidden="true" style={{ display: "contents" }}>
          {group}
        </div>
      </div>
    </div>
  );
}
