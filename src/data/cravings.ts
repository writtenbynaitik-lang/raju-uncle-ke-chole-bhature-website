/**
 * "How hungry are you?" — a way into the menu for someone who does not want to
 * read it. Each level maps onto real menu ids, so picking one can hand a
 * prefilled basket straight to the order drawer.
 *
 * These are suggested combinations, not serving sizes or portion claims.
 */
import type { ImageKey } from "./images";
import type { MenuItem } from "./menu";
import { itemById } from "./menu";

export interface Craving {
  id: string;
  label: string;
  /** The one-line read on this level of hunger. */
  line: string;
  /** menu item id -> quantity */
  basket: Record<string, number>;
  image: ImageKey;
}

export const cravings: Craving[] = [
  {
    id: "bite",
    label: "Just a bite",
    line: "Something hot in your hand, and you are on your way.",
    basket: { samosa: 1, chai: 1 },
    image: "dish-samosa",
  },
  {
    id: "plate",
    label: "One plate",
    line: "The order this place is named after. Nothing else needed.",
    basket: { "chole-bhature": 1 },
    image: "dish-chole-bhature",
  },
  {
    id: "double",
    label: "Double it",
    line: "One bhatura short is a mistake people only make once.",
    basket: { "chole-bhature": 1, "extra-bhatura": 1, lassi: 1 },
    image: "dish-lassi",
  },
  {
    id: "table",
    label: "Feed the table",
    line: "Order for everyone, put it in the middle, let the plates disappear.",
    basket: { "chole-bhature": 2, "paneer-bhature": 1, samosa: 2, lassi: 2 },
    image: "dish-spread",
  },
];

export interface BasketLine {
  item: MenuItem;
  qty: number;
}

export function basketLines(basket: Record<string, number>): BasketLine[] {
  return Object.entries(basket)
    .map(([id, qty]) => ({ item: itemById[id], qty }))
    .filter((l) => Boolean(l.item));
}
