import { useLocation } from "react-router-dom";

import styles from "./CheckoutPage.module.scss";

import Container from "../../components/ui/Container";
import OrderPayment from "./components/order/OrderPayment";
import Summary from "./components/Summary";
import ShippingAddress from "./components/ShippingAddress";
import CheckoutItems from "./components/CheckoutItems";

function CheckoutPage() {
  const { state } = useLocation();

  return (
    <section id={styles["checkout-page"]}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.detailes}>
            <div className={styles["checkout-detaile-group"]}>
              <h3>shipping address</h3>
              <ShippingAddress shippingAddress={state.shippingAddress} />
            </div>
            <div className={styles["checkout-detaile-group"]}>
              <h3>checkout items</h3>
              <CheckoutItems checkoutItems={state.checkoutItems} />
            </div>
          </div>

          <div className={styles.amount}>
            <Summary checkoutItems={state.checkoutItems} />
            <OrderPayment orderinfo={state} />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CheckoutPage;
