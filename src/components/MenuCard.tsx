import { useEffect, useRef, useState } from "react";
import type { MenuItem } from "../data/menu";
import { Picture } from "./Picture";
import "./MenuCard.css";

interface Props {
  item: MenuItem;
  onAdd: (id: string) => void;
  sizes: string;
}

export function MenuCard({ item, onAdd, sizes }: Props) {
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const add = () => {
    onAdd(item.id);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="card">
      <div className="card__frame">
        <Picture name={item.image} alt={`${item.name} — ${item.blurb}`} sizes={sizes} />
        {item.tag && <p className="card__tag">{item.tag}</p>}
      </div>

      <div className="card__body">
        <h3 className="card__name">
          {item.name}
          {item.hindi && <span className="deva">{item.hindi}</span>}
        </h3>

        <p className="card__meta">
          <span className="veg" aria-hidden="true" />
          Veg
        </p>

        <p className="card__blurb">{item.blurb}</p>

        <div className="card__foot">
          <p className="card__price">{item.price ?? "Ask for today's price"}</p>
          <button
            className={`btn btn--sm card__add ${added ? "is-added" : ""}`}
            onClick={add}
            aria-label={`Add ${item.name} to your order`}
          >
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
