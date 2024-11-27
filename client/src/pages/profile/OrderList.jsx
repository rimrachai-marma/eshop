import { Link } from "react-router-dom";

import styles from "./OrderList.module.scss";
import { formatDate } from "../../utilities/formaters";
import CloseIcon from "../../assets/icons/CloseIcon";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useGetUserOrdersQuery } from "../../redux/order/orderApiSlice";

const options = {
  day: "numeric",
  month: "short",
  year: "numeric",
  // weekday: "short",
  // hour: "numeric",
  // minute: "numeric",
};

const OrderList = () => {
  const { data: orders, isFetching, error } = useGetUserOrdersQuery();

  return (
    <>
      <h2 className={styles.heading}>My orders</h2>

      {isFetching && <LoadingSpinner />}

      {!isFetching && (
        <div className={styles["table-wraper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>id</th>
                <th>date</th>
                <th>total</th>
                <th>paid</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.orderId}>
                  <td>
                    <Link to={`/orders/${order.orderId}`}>{order.orderId}</Link>
                  </td>
                  <td>{formatDate(new Date(order.createdAt), options)}</td>

                  <td>{order.grandTotal}</td>
                  <td>
                    {order.paidAt &&
                      formatDate(new Date(order.paidAt), options)}
                    {!order.paidAt && (
                      <CloseIcon className={styles["icon-close"]} />
                    )}
                  </td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderList;
