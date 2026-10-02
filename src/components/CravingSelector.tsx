import { useState } from "react";
import { basketLines, cravings } from "../data/cravings";
import { Arrow } from "./Arrow";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import "./CravingSelector.css";

interface Props {
  onTakeBasket: (basket: Record<string, number>) => void;
}

export function CravingSelector({ onTakeBasket }: Props) {
  const [picked, setPicked] = useState(cravings[1].id);
  const craving = cravings.find((c) => c.id === picked) ?? cravings[1];
  const lines = basketLines(craving.basket);

  return (
    <section className="section crave">
      <div className="crave__in wrap">
        <Reveal className="crave__head">
          <SectionLabel>Not sure what to get</SectionLabel>
          <h2 className="crave__title">
            How hungry
            <br />
            <span className="accent">are you?</span>
          </h2>
        </Reveal>

        <Reveal className="crave__opts" delay={60}>
          {cravings.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className="crave__opt"
              aria-pressed={c.id === picked}
              onClick={() => setPicked(c.id)}
            >
              <small>{String(i + 1).padStart(2, "0")}</small>
              {c.label}
            </button>
          ))}
        </Reveal>

        <Reveal className="crave__shot" delay={100}>
          <Picture
            name={craving.image}
            alt=""
            sizes="(min-width: 60rem) 38vw, 0px"
          />
        </Reveal>

        {/* Keyed so the panel replays its entrance when the choice changes. */}
        <div className="crave__out" key={craving.id} aria-live="polite">
          <p className="crave__line">{craving.line}</p>

          <ul className="crave__list">
            {lines.map(({ item, qty }) => (
              <li className="crave__li" key={item.id}>
                <b>{item.name}</b>
                <span>&times; {qty}</span>
              </li>
            ))}
          </ul>

          <div className="crave__actions">
            <button
              className="btn btn--saffron"
              onClick={() => onTakeBasket(craving.basket)}
            >
              Put this in my order <Arrow />
            </button>
            <a className="btn btn--ghost" href="#menu">
              Browse instead
            </a>
          </div>

          <p className="crave__fine">
            Suggested combinations — not serving sizes.
          </p>
        </div>
      </div>
    </section>
  );
}
