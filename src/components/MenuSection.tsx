import { useState } from "react";
import { categories, type CategoryId } from "../data/menu";
import { MenuCard } from "./MenuCard";
import { MenuCategoryTabs } from "./MenuCategoryTabs";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import "./MenuSection.css";

interface Props {
  onAdd: (id: string) => void;
}

export function MenuSection({ onAdd }: Props) {
  const [active, setActive] = useState<CategoryId>("chole-bhature");
  const current = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <section className="section menu" id="menu" aria-labelledby="menu-title">
      <div className="wrap">
        <Reveal className="menu__head">
          <SectionLabel className="menu__label">
            Everything we make
          </SectionLabel>
          <h2 className="menu__title" id="menu-title">
            The menu
          </h2>
          <p className="menu__sub">Some cravings don&rsquo;t need explaining.</p>
        </Reveal>

        <MenuCategoryTabs
          categories={categories}
          active={active}
          onChange={setActive}
        />

        <div
          className="menu__panel"
          key={active}
          id={`panel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          tabIndex={-1}
        >
          <div className="menu__grid" data-count={current.items.length}>
            {current.items.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAdd={onAdd}
                sizes="(min-width: 64rem) 22vw, (min-width: 34rem) 45vw, 92vw"
              />
            ))}
          </div>
        </div>

        <div className="menu__foot">
          <p>
            Shown as concept items, to demonstrate the layout &mdash; the real
            list goes here. No prices are printed, because none were confirmed;
            the counter tells you today&rsquo;s rate.
          </p>
          <a className="btn btn--ghost" href="#visit">
            Hours &amp; directions
          </a>
        </div>
      </div>
    </section>
  );
}
