import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import "./RepeatBand.css";

const FRAMES = [
  { name: "repeat-a" as const, alt: "Bhature and chole served over the counter." },
  { name: "repeat-b" as const, alt: "A thick, cold lassi in a clay cup, served alongside." },
  { name: "repeat-c" as const, alt: "A bhatura puffed up beside a bowl of chole." },
];

export function RepeatBand() {
  return (
    <section className="section rep on-dark">
      <div className="rep__in wrap">
        <Reveal className="rep__head">
          <SectionLabel>How it usually goes</SectionLabel>
          <h2 className="rep__title">
            <span>The plate.</span>
            <span>The craving.</span>
            <span>The repeat.</span>
          </h2>
          <p className="rep__note">
            One order turns into a standing one. That is the whole business
            model.
          </p>
        </Reveal>

        <div className="rep__row">
          {FRAMES.map((f, i) => (
            <Reveal as="figure" className="rep__fig" key={f.name} delay={i * 90}>
              <Picture
                name={f.name}
                alt={f.alt}
                sizes="(min-width: 60rem) 18vw, 31vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
