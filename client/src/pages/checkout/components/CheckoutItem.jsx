import { Link } from "react-router-dom";

import styles from "./CheckoutItem.module.scss";
import { formatCurrency } from "../../../utilities/formaters";

const CheckoutItem = ({ checkoutItem }) => {
  return (
    <li className={styles["checkout-item"]}>
      <div className={styles["checkout-item_img"]}>
        <Link to={`/products/${checkoutItem?.id}`}>
          <img src={checkoutItem?.image} alt={checkoutItem?.name} />
        </Link>
      </div>

      <div className={styles["checkout-item_details"]}>
        <Link to={`/products/${checkoutItem?.id}`}>
          <div className={styles.name}>{checkoutItem?.name}</div>
        </Link>
        <div className={styles.qty}>
          <span>&#10006;</span>
          {checkoutItem?.quantity}{" "}
          {checkoutItem?.quantity === 1 ? "item" : "items"}
        </div>
        <div className={styles.price}>
          {formatCurrency(
            (checkoutItem?.price ?? 0) * checkoutItem.quantity,
            "USD"
          )}
          <span>({formatCurrency(checkoutItem?.price, "USD")}/item)</span>
        </div>
      </div>
    </li>
  );
};

export default CheckoutItem;
