import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./AdminOrderDetailesPage.module.scss";
import Container from "../../components/ui/Container";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Summary from "../../components/order/Summary";
import OrderItems from "../../components/order/OrderItems";
import ShippingAddress from "../../components/order/ShippingAddress";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { formatDate } from "../../utilities/formaters";
import { useGetOrderQuery, useUpdateOrderStatusMutation } from "../../redux/order/orderApiSlice";
import apiSlice from "../../redux/apiSlice";

const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "short",
  year: "numeric",
  weekday: "short",
};

export default function AdminOrderDetailesPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const { data: order, isFetching, error: fetchError } = useGetOrderQuery(params.id);
  const [status, setStatus] = useState("");

  const [updateOrderStatus, { isLoading, error: updateError }] = useUpdateOrderStatusMutation();

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const patchResult = dispatch(
      apiSlice.util.updateQueryData("getOrder", params.id, (draftData) => {
        console.log(JSON.parse(JSON.stringify(draftData)));

        Object.assign(draftData, { status });
      })
    );

    try {
      await updateOrderStatus({
        id: params.id,
        data: status,
      }).unwrap();
    } catch (err) {
      console.error(err?.data?.message || err.error);
      patchResult.undo();
    }
  };

  return (
    <section id={styles["order-page"]}>
      <Container>
        {fetchError && <ErrorMessage>{fetchError?.data?.message || fetchError.error}</ErrorMessage>}

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

              {order?.isPaid ? (
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

            <br />
            {updateError && <ErrorMessage>{updateError?.data?.message || updateError.error}</ErrorMessage>}

            <fieldset>
              <legend>Update order status</legend>
              <form id="status" onSubmit={handleSubmit}>
                <label>
                  <input onChange={handleStatusChange} value="Processing" name="status" type="radio" checked={status === "Processing"} /> Processing
                </label>
                <label>
                  <input onChange={handleStatusChange} value="Shipped" name="status" type="radio" checked={status === "Shipped"} /> Shipped
                </label>
                <label>
                  <input onChange={handleStatusChange} value="Delivered" name="status" type="radio" checked={status === "Delivered"} /> Delivered
                </label>
                <label>
                  <input onChange={handleStatusChange} value="Cancelled" name="status" type="radio" checked={status === "Cancelled"} /> Cancelled
                </label>
                <label>
                  <input onChange={handleStatusChange} value="Refunded" name="status" type="radio" checked={status === "Refunded"} /> Refunded
                </label>
              </form>
              <button disabled={isLoading} form="status">
                Update
              </button>
            </fieldset>
          </div>
        </div>
      </Container>
    </section>
  );
}
