/**
 * The menu as structured data, so a real build can be repriced, reordered or
 * translated without touching a component.
 *
 * SOURCING — the restaurant does not publish a menu, and the dish lists on the
 * public listings could not be tied to this branch rather than to another
 * business of the same name. So nothing here is presented as "their menu":
 * these are the staples any chole bhature counter carries, shown as concept
 * items to demonstrate the layout, and the page says so in as many words.
 *
 * ON PRICES — none are printed, anywhere, because none could be verified.
 * Fill `price` in on any item and it appears on the card automatically.
 */

import type { ImageKey } from "./images";

export type CategoryId = "chole-bhature" | "sides" | "drinks";

export interface MenuItem {
  id: string;
  name: string;
  hindi?: string;
  blurb: string;
  image: ImageKey;
  /** The kitchen is vegetarian, per the prospect brief. */
  veg: true;
  /** A quiet badge. Marketing framing only — never a popularity claim. */
  tag?: string;
  price?: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  /** Sits under the tab row when the category is active. */
  note: string;
  items: MenuItem[];
}

export const categories: Category[] = [
  {
    id: "chole-bhature",
    label: "Chole Bhature",
    note: "Rich spiced chole, fresh bhature. The reason for the name.",
    items: [
      {
        id: "chole-bhature",
        name: "Chole Bhature",
        hindi: "छोले भटूरे",
        blurb:
          "Bhature straight out of the kadhai, puffed and golden, with dark slow-spiced chole, raw onion and achar.",
        image: "dish-chole-bhature",
        veg: true,
        tag: "The house plate",
      },
      {
        id: "paneer-bhature",
        name: "Paneer Bhature",
        blurb:
          "The same bhatura, stuffed with spiced paneer, torn open over the same bowl of chole.",
        image: "dish-paneer",
        veg: true,
      },
      {
        id: "extra-bhatura",
        name: "Extra Bhatura",
        blurb: "Because one is rarely the right number.",
        image: "dish-bhatura",
        veg: true,
        tag: "Add on",
      },
      {
        id: "chole",
        name: "Chole",
        blurb:
          "Just the bowl. Chickpeas cooked down dark, heavy on the masala, finished with coriander.",
        image: "dish-chole",
        veg: true,
      },
    ],
  },
  {
    id: "sides",
    label: "Sides",
    note: "Classic Indian accompaniments — the small things that finish a plate.",
    items: [
      {
        id: "samosa",
        name: "Samosa",
        hindi: "समोसा",
        blurb: "Fried crisp, filled with spiced potato, hot through the middle.",
        image: "dish-samosa",
        veg: true,
      },
      {
        id: "salad-achar",
        name: "Salad & Achar",
        blurb:
          "Sliced onion, green chilli and pickle — the sharp cut that keeps the chole moving.",
        image: "dish-onion",
        veg: true,
      },
      {
        id: "chutney",
        name: "Green Chutney",
        blurb: "Coriander, mint and chilli, ground sharp. Ask for extra.",
        image: "dish-chutney",
        veg: true,
      },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    note: "Something cold for after the chilli, something hot for after the meal.",
    items: [
      {
        id: "lassi",
        name: "Lassi",
        hindi: "लस्सी",
        blurb:
          "Thick, sweet and cold, with the malai still sitting on top of the glass.",
        image: "dish-lassi",
        veg: true,
        tag: "Cold",
      },
      {
        id: "masala-chaas",
        name: "Masala Chaas",
        blurb:
          "Salted buttermilk, cumin and curry leaf. The lighter way to cool down.",
        image: "dish-chaas",
        veg: true,
      },
      {
        id: "chai",
        name: "Chai",
        blurb:
          "Strong, sweet, boiled with ginger. The full stop at the end of the plate.",
        image: "dish-chai",
        veg: true,
      },
    ],
  },
];

export const categoryById = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export const allItems: MenuItem[] = categories.flatMap((c) => c.items);

export const itemById = Object.fromEntries(
  allItems.map((i) => [i.id, i]),
) as Record<string, MenuItem>;
