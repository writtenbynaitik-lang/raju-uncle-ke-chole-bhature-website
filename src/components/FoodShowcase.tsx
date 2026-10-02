import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import "./FoodShowcase.css";

/**
 * The brand moment. Three frames, deliberately unequal, and the line that the
 * rest of the site keeps coming back to.
 */
export function FoodShowcase() {
  return (
    <section className="section show">
      <div className="show__in wrap">
        <Reveal className="show__head">
          <SectionLabel>Why people come back</SectionLabel>
          <h2 className="show__title">
            The plate
            <br />
            you came
            <br />
            <span className="accent">for.</span>
          </h2>
          <p className="show__note">
            No specials board, no long menu to work through. One thing, made the
            same way, all day.
          </p>
        </Reveal>

        <div className="show__grid">
          <Reveal as="figure" className="show__fig show__fig--tall" delay={40}>
            <div className="show__frame">
              <Picture
                name="show-plate"
                alt="A bhatura torn open over a steel bowl of dark chole."
                sizes="(min-width: 60rem) 40vw, (min-width: 48rem) 48vw, 92vw"
              />
            </div>
            <figcaption className="show__cap">
              <b>01</b> The plate
            </figcaption>
          </Reveal>

          <Reveal as="figure" className="show__fig show__fig--a" delay={120}>
            <div className="show__frame">
              <Picture
                name="show-chole"
                alt="Chickpeas simmering in dark, oil-glossed masala."
                sizes="(min-width: 60rem) 42vw, (min-width: 48rem) 40vw, 45vw"
              />
            </div>
            <figcaption className="show__cap">
              <b>02</b> The chole
            </figcaption>
          </Reveal>

          <Reveal as="figure" className="show__fig show__fig--b" delay={200}>
            <div className="show__frame">
              <Picture
                name="show-bhatura"
                alt="A blistered golden bhatura, just lifted out of the oil."
                sizes="(min-width: 60rem) 28vw, (min-width: 48rem) 30vw, 45vw"
              />
            </div>
            <figcaption className="show__cap">
              <b>03</b> The bhatura
            </figcaption>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
