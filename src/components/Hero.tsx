import { useEffect, useState } from "react";
import { hindi, site } from "../data/site";
import { Arrow } from "./Arrow";
import { Picture } from "./Picture";
import { SectionLabel } from "./SectionLabel";
import "./Hero.css";

interface Props {
  onOrder: () => void;
}

export function Hero({ onOrder }: Props) {
  const [ready, setReady] = useState(false);

  // One frame after mount, so the staggered load-in actually plays rather than
  // being painted in its final state.
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className={`hero ${ready ? "is-ready" : ""}`} id="top">
      <div className="hero__in wrap">
        <div className="hero__meta">
          <SectionLabel>{site.kicker}</SectionLabel>
          <p className="hero__where">{site.address.area}</p>
        </div>

        <h1 className="hero__type">
          <span className="hero__owner">Raju Uncle&rsquo;s</span>
          <span className="hero__word hero__word--1">Chole</span>
          <span className="hero__word hero__word--2">Bhature</span>
        </h1>

        <figure className="hero__shot">
          <div className="hero__frame">
            <Picture
              name="hero-plate"
              art={[{ name: "hero-plate-p", media: "(min-width: 60rem)" }]}
              alt="Two freshly fried bhature, puffed and golden, beside a bowl of dark spiced chole with sliced onion."
              sizes="(min-width: 60rem) 42vw, 92vw"
              priority
            />
            <figcaption className="hero__stamp">
              <span className="deva">{hindi.choleBhature}</span>
              <span aria-hidden="true">·</span>
              <span>Fried to order</span>
            </figcaption>
          </div>
        </figure>

        <div className="hero__say">
          <div className="hero__pitch">
            <p className="hero__line">
              Hot bhature.
              <br />
              Spiced chole.
              <br />
              <em>That&rsquo;s the plan.</em>
            </p>
            <p className="hero__support">{site.heroSupport}</p>
          </div>
          <div className="hero__cta">
            <button className="btn btn--saffron" onClick={onOrder}>
              Order now <Arrow />
            </button>
            <a className="btn btn--ghost" href="#menu">
              View menu
            </a>
            <a className="btn btn--ghost" href="#visit">
              Visit us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
