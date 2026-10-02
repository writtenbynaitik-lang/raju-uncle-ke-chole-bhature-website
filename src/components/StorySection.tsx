import { site } from "../data/site";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import "./StorySection.css";

/**
 * Deliberately short. The restaurant has not published a founder's story, so
 * this section states what the brand stands for and shows the work instead of
 * inventing a history.
 */
export function StorySection() {
  return (
    <section className="section story" id="story" aria-labelledby="story-title">
      <div className="story__in wrap">
        <Reveal className="story__head">
          <SectionLabel>About</SectionLabel>
          <h2 className="story__title" id="story-title">
            The craving
            <br />
            behind the name.
          </h2>
        </Reveal>

        <Reveal className="story__body" delay={80}>
          <p className="story__big">
            Good chole bhature doesn&rsquo;t need a complicated explanation.
          </p>
          <p className="story__p">
            You see the plate. You smell the bhature. You take the first bite.
            That&rsquo;s the point.
          </p>
          <p className="story__p">
            One kitchen, a short menu, and a plate worth coming back for &mdash;
            in Katraj&ndash;Dhankawadi, Pune.
          </p>
          <blockquote className="story__quote">
            <q>{site.tagline}</q>
            <cite>The restaurant&rsquo;s own words</cite>
          </blockquote>
        </Reveal>

        <div className="story__shots">
          <Reveal as="figure" className="story__fig story__fig--a" delay={120}>
            <Picture
              name="story-hands"
              alt="A cook working the counter, pouring a glass at a North Indian food stall."
              sizes="(min-width: 60rem) 25vw, 46vw"
            />
          </Reveal>
          <Reveal as="figure" className="story__fig story__fig--b" delay={180}>
            <Picture
              name="story-urn"
              alt="Steel pots and glasses lined up at a busy counter."
              sizes="(min-width: 60rem) 22vw, 46vw"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
