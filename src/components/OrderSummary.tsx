import { itemById } from "../data/menu";
import "./OrderSummary.css";

interface Props {
  basket: Record<string, number>;
  onRemove: (id: string) => void;
}

/**
 * The running order. There is deliberately no money on it: the restaurant does
 * not publish prices, so inventing a total would be the one dishonest thing on
 * the page. The counter confirms the bill.
 */
export function OrderSummary({ basket, onRemove }: Props) {
  const lines = Object.entries(basket).filter(([, q]) => q > 0);
  const count = lines.reduce((n, [, q]) => n + q, 0);

  return (
    <div className="osum">
      <div className="osum__head">
        <h3 className="osum__title">Your order</h3>
        <p className="osum__count">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>

      {lines.length === 0 ? (
        <p className="osum__empty">
          Nothing picked yet. Add a plate above and it will show up here.
        </p>
      ) : (
        <ul className="osum__list">
          {lines.map(([id, qty]) => (
            <li className="osum__li" key={id}>
              <span className="osum__q">{qty} &times;</span>
              <span className="osum__n">{itemById[id]?.name ?? id}</span>
              <button
                className="osum__x"
                onClick={() => onRemove(id)}
                aria-label={`Remove ${itemById[id]?.name ?? id} from your order`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="osum__total">
        <b>Total</b>
        <span>Confirmed at the counter — prices are not printed here.</span>
      </div>
    </div>
  );
}
