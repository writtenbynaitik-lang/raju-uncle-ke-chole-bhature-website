import { hindi, site } from "../data/site";
import { Arrow } from "./Arrow";
import { ConnectNote } from "./ConnectNote";
import { LocalityMap } from "./LocalityMap";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import "./VisitSection.css";

interface Props {
  onOrder: () => void;
}

/**
 * The conversion section. Calling is the only channel verified for this
 * restaurant, so calling is the primary action; everything else is either a
 * labelled demo state or absent.
 */
export function VisitSection({ onOrder }: Props) {
  return (
    <section className="section visit" id="visit" aria-labelledby="visit-title">
      <div className="visit__in wrap">
        <Reveal className="visit__head">
          <SectionLabel>Order &amp; visit</SectionLabel>
          <h2 className="visit__title" id="visit-title">
            Come <span className="accent">hungry.</span>
          </h2>
          <p className="lede visit__lede">
            One plate is rarely the whole story. Call ahead, or just turn up.
          </p>
        </Reveal>

        <Reveal className="visit__card on-dark" delay={80}>
          <div>
            <h3 className="visit__name">{site.name}</h3>
            <p className="visit__deva">{site.nameHindi}</p>
          </div>

          <div className="visit__rows">
            <div className="visit__row">
              <span className="visit__k">Where</span>
              <span className="visit__v">
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                {site.address.city}
              </span>
            </div>
            <div className="visit__row">
              <span className="visit__k">Phone</span>
              <span className="visit__v">
                <a href={site.phoneHref}>{site.phone}</a>
              </span>
            </div>
            <div className="visit__row">
              <span className="visit__k">Hours</span>
              <span className="visit__v">
                {site.hours.display ?? site.hours.fallback}
              </span>
            </div>
            <div className="visit__row">
              <span className="visit__k">Kitchen</span>
              <span className="visit__v">Pure vegetarian &middot; North Indian</span>
            </div>
          </div>

          <div className="visit__cta">
            <a className="btn btn--saffron" href={site.phoneHref}>
              Call now <Arrow />
            </a>
            <button className="btn btn--ghost" onClick={onOrder}>
              Build an order
            </button>
          </div>
        </Reveal>

        <Reveal className="map" delay={140}>
          <h3 className="map__title">
            Find the
            <br />
            craving.
          </h3>
          <div className="map__frame">
            <LocalityMap />
          </div>
          <p className="map__fine">
            Sketch, not to scale &mdash; {hindi.garam} bhature are at the pin.
          </p>
          <ConnectNote label="Get directions" note={site.connect.directions} />
          <div className="map__shot">
            <Picture
              name="visit-counter"
              alt="Steel pots and glasses lined up along a busy North Indian food counter."
              sizes="(min-width: 60rem) 42vw, 92vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
