import { Link } from "react-router-dom";

import styles from "./Orders.module.scss";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useGetOrdersQuery } from "../../redux/order/orderApiSlice";
import { formatDate } from "../../utilities/formaters";

const options = {
  day: "numeric",
  month: "short",
  year: "numeric",
  // weekday: "short",
  // hour: "numeric",
  // minute: "numeric",
};

export default function Orders() {
  const { data: { orders, page, pages } = {}, isFetching, error } = useGetOrdersQuery();

  if (isFetching) return <LoadingSpinner />;

  return (
    <>
      <h2 className={styles.heading}>Orders</h2>

      {error && <ErrorMessage>{error?.data?.message || error.error}</ErrorMessage>}

      <div className={styles["table-wraper"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>id</th>
              <th>user</th>
              <th>date</th>
              <th>total</th>
              <th>paid</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order._id}>
                <td>
                  <Link to={`/admin/orders/${order.orderId}`}>{order.orderId}</Link>
                </td>
                <td>{order?.user?.email}</td>
                <td>{formatDate(new Date(order.createdAt), options)}</td>
                <td>{order.grandTotal}</td>
                <td>
                  {order.isPaid && formatDate(new Date(order.paidAt), options)}
                  {!order.isPaid && <CloseIcon className={styles["icon-close"]} />}
                </td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
