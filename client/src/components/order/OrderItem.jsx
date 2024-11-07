import { Link } from "react-router-dom";

import styles from "./OrderItem.module.scss";

import { formatCurrency } from "../../utilities/formaters";

export default function OrderItem({ orderItem }) {
  return (
    <div className={styles["order-item"]}>
      <div className={styles["order-item_img"]}>
        <Link to={`/products/${orderItem.sku}`}>
          <img src={orderItem.image} alt={orderItem.name} />
        </Link>
      </div>

      <div className={styles["order-item_details"]}>
        <Link to={`/products/${orderItem.sku}`}>
          <div className={styles.name}>{orderItem.name}</div>
        </Link>
        <div className={styles.qty}>
          <span>&#10006;</span>
          {orderItem.quantity} {orderItem.quantity > 1 ? "items" : "item"}
        </div>
        <div className={styles.price}>
          {formatCurrency(orderItem.price * orderItem.quantity, "USD")}
          <span>({formatCurrency(orderItem.price, "USD")}/item)</span>
        </div>
      </div>
    </div>
  );
}
