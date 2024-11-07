import axios from "axios";
import { useEffect, useState } from "react";

import styles from "./Summary.module.scss";
import { formatCurrency } from "../../../utilities/formaters";

export default function Summary({ checkoutItems }) {
  const [taxRate, setTaxRate] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/api/config/tax_rate");
      setTaxRate(data.taxRate);
    })();
  }, []);

  const subTotal = checkoutItems.reduce((total, checkoutItem) => {
    return checkoutItem.price * checkoutItem.quantity + total;
  }, 0);

  function calculateTax(price, taxRate) {
    return price * (taxRate / 100);
  }

  const totalTax = checkoutItems.reduce((total, item) => {
    return total + calculateTax(item.price * item.quantity, taxRate);
  }, 0);

  const shipping = 50; // Shipping price should be based on location

  return (
    <div className={styles.summary}>
      <h1>checkout summary</h1>
      <ul>
        <li>
          <label>subtotal</label>
          <span>{formatCurrency(subTotal, "USD")}</span>
        </li>
        <li>
          <label>shipping</label>
          <span>{formatCurrency(50, "USD")}</span>
        </li>
        <li>
          <label>tax (10%)</label>
          <span>{formatCurrency(totalTax, "USD")}</span>
        </li>
        <li>
          <label>total</label>
          <span>{formatCurrency(subTotal + totalTax + shipping, "USD")}</span>
        </li>
      </ul>
    </div>
  );
}
