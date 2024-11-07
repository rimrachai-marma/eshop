import styles from "./Summary.module.scss";
import { formatCurrency } from "../../utilities/formaters";

export default function Summary({ order }) {
  return (
    <div className={styles.summary}>
      <h1>checkout summary</h1>
      <ul>
        <li>
          <label>subtotal</label>
          <span>{formatCurrency(order?.itemsPrice ?? 0, "USD")}</span>
        </li>
        <li>
          <label>shipping</label>
          <span>{formatCurrency(order?.shippingPrice ?? 0, "USD")}</span>
        </li>
        <li>
          <label>tax (10%)</label>
          <span>{formatCurrency(order?.totalTax ?? 0, "USD")}</span>
        </li>
        <li>
          <label>total</label>
          <span>{formatCurrency(order?.grandTotal ?? 0, "USD")}</span>
        </li>
      </ul>
    </div>
  );
}
