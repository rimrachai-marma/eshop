import { useParams } from "react-router-dom";

import styles from "./OrderDetailesPage.module.scss";
import Container from "../../components/ui/Container";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Summary from "../../components/order/Summary";
import OrderItems from "../../components/order/OrderItems";
import ShippingAddress from "../../components/order/ShippingAddress";
import { formatDate } from "../../utilities/formaters";
import { useGetOrderQuery } from "../../redux/order/orderApiSlice";

const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "short",
  year: "numeric",
  weekday: "short",
};

export default function OrderDetailesPage() {
  const params = useParams();
  const { data: order, isFetching } = useGetOrderQuery(params.id);

  if (isFetching) {
    return (
      <div className={styles["loader-container"]}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section id={styles["order-page"]}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.detailes}>
            <h3 className={styles["order-id"]}>
              <span>Order id: </span> {order?.orderId}
            </h3>
            <div className={styles["order-detaile-group"]}>
              <h3>shipping address</h3>
              <ShippingAddress shipping={order?.shipping} />
            </div>

            <div className={styles["order-detaile-group"]}>
              <h3>Status</h3>
              <p>{order?.status}</p>
            </div>

            <div className={styles["order-detaile-group"]}>
              <h3>payment</h3>

              {order?.paidAt ? (
                <p>
                  Paid with {order?.paymentMethod} on&nbsp;
                  {formatDate(new Date(order?.paidAt ?? 0), options)}
                </p>
              ) : (
                <p className={styles.red}>Not Paid</p>
              )}
            </div>

            <div className={styles["order-detaile-group"]}>
              <h3>order{order?.orderItems.length > 0 ? " items" : "  item"}</h3>
              <OrderItems orderItems={order?.orderItems} />
            </div>
          </div>

          <div className={styles.amount}>
            <Summary order={order} />
          </div>
        </div>
      </Container>
    </section>
  );
}
