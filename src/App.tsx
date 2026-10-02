import { useCallback, useState } from "react";
import { CravingSelector } from "./components/CravingSelector";
import { FeaturedDish } from "./components/FeaturedDish";
import { FoodShowcase } from "./components/FoodShowcase";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { MenuSection } from "./components/MenuSection";
import { Navigation } from "./components/Navigation";
import { OrderDrawer } from "./components/OrderDrawer";
import { RepeatBand } from "./components/RepeatBand";
import { StatementBand } from "./components/StatementBand";
import { StorySection } from "./components/StorySection";
import { VisitSection } from "./components/VisitSection";

/**
 * The page is one scroll with one job: get someone from "what is this place" to
 * "I am ordering" without a dead end in between. The basket lives here so that
 * every section — a menu card, a hunger level, a CTA — can feed the same drawer.
 */
export default function App() {
  const [basket, setBasket] = useState<Record<string, number>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const setQty = useCallback((id: string, qty: number) => {
    setBasket((b) => {
      const next = { ...b };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }, []);

  const add = useCallback((id: string) => {
    setBasket((b) => ({ ...b, [id]: (b[id] ?? 0) + 1 }));
  }, []);

  /** Adding from a card should not yank the page open mid-scroll. */
  const openDrawer = useCallback(() => setDrawerOpen(true), []);

  const takeBasket = useCallback((preset: Record<string, number>) => {
    setBasket({ ...preset });
    setDrawerOpen(true);
  }, []);

  const addAndOpen = useCallback(
    (id: string) => {
      add(id);
      setDrawerOpen(true);
    },
    [add],
  );

  return (
    <>
      <a className="skip" href="#menu">
        Skip to the menu
      </a>

      {/* While the drawer is modal the rest of the page is inert: not
          focusable, not clickable and not read out. The scrim only handles the
          visual half of that contract. */}
      <div inert={drawerOpen || undefined}>
        <Navigation onOrder={openDrawer} />

        <main id="top">
          <Hero onOrder={openDrawer} />
          <StatementBand />
          <FoodShowcase />
          <FeaturedDish onOrder={() => addAndOpen("chole-bhature")} />
          <MenuSection onAdd={add} />
          <CravingSelector onTakeBasket={takeBasket} />
          <StorySection />
          <RepeatBand />
          <VisitSection onOrder={openDrawer} />
        </main>

        <Footer onOrder={openDrawer} />
      </div>

      <OrderDrawer
        open={drawerOpen}
        basket={basket}
        onClose={() => setDrawerOpen(false)}
        onSet={setQty}
        onClear={() => setBasket({})}
      />
    </>
  );
}
