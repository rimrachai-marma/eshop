import { useState } from "react";
import { useParams } from "react-router-dom";

import styles from "./OrderDetailesPage.module.scss";
import Container from "../../components/ui/Container";
import Summary from "../../components/order/Summary";
import ErrorMessage from "../../components/ui/ErrorMessage";
import OrderItems from "../../components/order/OrderItems";
import ShippingAddress from "../../components/order/ShippingAddress";
import { formatDate } from "../../utilities/formaters";
import {
  useCancelOrderMutation,
  useGetOrderQuery,
} from "../../redux/order/orderApiSlice";
import Message from "../../components/ui/Message";

const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "short",
  year: "numeric",
  weekday: "short",
};

export default function OrderDetailesPage() {
  const [cancelationMessage, setCancelationMessage] = useState(null);
  const params = useParams();
  const {
    data: order,
    isFetching,
    error,
    refetch,
  } = useGetOrderQuery(params.id);

  const [cancelOrder, { isLoading, error: cancelError }] =
    useCancelOrderMutation();

  const cancelHandler = async (id) => {
    try {
      const data = await cancelOrder(id).unwrap();

      setCancelationMessage(data.message);

      refetch();
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
  };

  return (
    <section id={styles["order-page"]}>
      <Container>
        {error && (
          <ErrorMessage>
            {error?.data?.message || fetchError.error}
          </ErrorMessage>
        )}

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

          <div className={styles.summury_and_actions}>
            <Summary order={order} />

            {cancelError && (
              <ErrorMessage>
                {cancelError?.data?.message || cancelError.error}
              </ErrorMessage>
            )}

            {cancelationMessage && <Message> {cancelationMessage}</Message>}

            {["Pending", "Processing"].includes(order?.status) && (
              <button
                disabled={isLoading}
                onClick={() => cancelHandler(order?.orderId)}
                className={styles.btn}
              >
                {isLoading ? "Cancelling.." : "Cancell"}
              </button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
