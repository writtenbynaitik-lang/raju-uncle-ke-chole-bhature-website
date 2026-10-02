import { hindi } from "../data/site";
import { Arrow } from "./Arrow";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import "./FeaturedDish.css";

interface Props {
  onOrder: () => void;
}

export function FeaturedDish({ onOrder }: Props) {
  return (
    <section className="section feat on-dark">
      <div className="feat__in wrap">
        <Reveal className="feat__head">
          <SectionLabel>The house plate</SectionLabel>
          <h2 className="feat__title">
            <span>The one</span>
            <span>everyone</span>
            <span className="accent">talks about.</span>
          </h2>
        </Reveal>

        <Reveal className="feat__frame" delay={80}>
          <Picture
            name="featured-plate"
            alt="A close-up of chole bhature: a golden bhatura beside a bowl of dark chickpea masala."
            sizes="(min-width: 60rem) 58vw, 100vw"
          />
        </Reveal>

        <Reveal className="feat__side" delay={160}>
          <h3 className="feat__dish">
            Chole Bhature <span className="deva">{hindi.choleBhature}</span>
          </h3>
          <p className="feat__quote">
            Golden, hot, spicy and made for eating immediately.
          </p>
          <div className="feat__meta">
            <div className="feat__row">
              <span>On the plate</span>
              <b>Bhature, chole, onion, achar</b>
            </div>
            <div className="feat__row">
              <span>Kitchen</span>
              <b>Pure vegetarian</b>
            </div>
            <div className="feat__row">
              <span>Best eaten</span>
              <b>Hot, straight away</b>
            </div>
          </div>
          <div className="feat__cta">
            <button className="btn btn--saffron" onClick={onOrder}>
              Add to order <Arrow />
            </button>
            <a className="btn btn--ghost" href="#menu">
              See the full menu
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
