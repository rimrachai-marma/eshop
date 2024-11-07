import styles from "./OrderPayment.module.scss";
import PayPal from "./PayPal";
import Stripe from "./Stripe";

export default function OrderPayment({ orderinfo }) {
  return (
    <>
      <PayPal orderinfo={orderinfo} />
      <span className={styles.separator}>or</span>
      <Stripe orderinfo={orderinfo} />
    </>
  );
}
