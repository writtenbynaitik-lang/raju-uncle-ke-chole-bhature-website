import { credits } from "../data/credits";
import { nav, site } from "../data/site";
import { Arrow } from "./Arrow";
import "./Footer.css";

interface Props {
  onOrder: () => void;
}

export function Footer({ onOrder }: Props) {
  return (
    <footer className="foot on-dark">
      <div className="foot__in wrap">
        <div className="foot__mark">
          <p className="foot__word">
            Raju Uncle
            <br />
            Ke <em>Chole</em>
            <br />
            Bhature
          </p>
          <p className="foot__deva">{site.nameHindi}</p>
        </div>

        <div className="foot__cols">
          <div className="foot__col">
            <h3>Browse</h3>
            <ul>
              {nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
              <li>
                <button onClick={onOrder}>Order now</button>
              </li>
            </ul>
          </div>

          <div className="foot__col">
            <h3>Find us</h3>
            <ul>
              <li>
                <p>
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.city}
                </p>
              </li>
              <li>
                <a href="#visit">
                  Visit section <Arrow />
                </a>
              </li>
            </ul>
          </div>

          <div className="foot__col">
            <h3>Call</h3>
            <ul>
              <li>
                <a href={site.phoneHref}>{site.phone}</a>
              </li>
              <li>
                <button onClick={onOrder}>Build an order</button>
              </li>
            </ul>
          </div>

          <div className="foot__col">
            <h3>Hours</h3>
            <ul>
              <li>
                <p>{site.hours.display ?? site.hours.fallback}</p>
              </li>
              <li>
                <p>Pure vegetarian &middot; North Indian</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot__fine">
          <p className="foot__concept">{site.concept.note}</p>

          <details className="foot__credits">
            <summary>Photography credits</summary>
            <p>
              Openly-licensed photographs from Wikimedia Commons, taken
              elsewhere and graded to one look. They stand in for Raju Uncle Ke
              Chole Bhature&rsquo;s own food photography, and each one is
              credited below as its licence requires.
            </p>
            <ul className="foot__creditlist">
              {credits.map((c) => (
                <li key={c.key}>
                  <a href={c.page} target="_blank" rel="noopener noreferrer">
                    {c.title}
                  </a>{" "}
                  &middot; {c.author} &middot;{" "}
                  <a href={c.licenceUrl} target="_blank" rel="noopener noreferrer">
                    {c.licence}
                  </a>{" "}
                  &middot; via Wikimedia Commons
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </footer>
  );
}
