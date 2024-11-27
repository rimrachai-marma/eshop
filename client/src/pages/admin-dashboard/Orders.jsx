import { Link, useSearchParams } from "react-router-dom";

import styles from "./Orders.module.scss";
import { formatDate } from "../../utilities/formaters";
import Pagination from "../../components/Pagination";
import CloseIcon from "../../assets/icons/CloseIcon";
import SearchIcon from "../../assets/icons/SearchIcon";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useGetOrdersQuery } from "../../redux/order/orderApiSlice";

const options = {
  day: "numeric",
  month: "short",
  year: "numeric",
  // weekday: "short",
  // hour: "numeric",
  // minute: "numeric",
};

export default function Orders() {
  const [search, setSearch] = useSearchParams();

  const order_id = search.get("order_id");
  const status = search.get("status");
  const pageNumber = search.get("pageNumber");
  const pageSize = search.get("pageSize");

  let query = {
    pageSize: 6,
  };
  if (order_id) query.order_id = order_id;
  if (status) query.status = status;
  if (pageNumber) query.page = pageNumber;
  if (pageSize) query.pageSize = pageSize;

  const {
    data: { orders, page, pages } = {},
    isFetching,
    error,
  } = useGetOrdersQuery(query);

  const pageSizeChangeHandler = (event) => {
    const pageSize = event.target.value;
    if (pageSize.length === 0) {
      search.delete("pageSize");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("pageSize", pageSize);
      setSearch(search, {
        replace: true,
      });
    }
  };

  const statusChangeHandler = (event) => {
    const status = event.target.value;
    if (status.length === 0) {
      search.delete("status");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("status", status);
      setSearch(search, {
        replace: true,
      });
    }
  };

  const searchHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { order_id } = Object.fromEntries(formData.entries());

    if (order_id.length === 0) {
      search.delete("order_id");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("order_id", order_id);
      setSearch(search, {
        replace: true,
      });
    }
  };

  const searchChangeHandler = (event) => {
    if (!event.target.value) {
      search.delete("order_id");
      setSearch(search, {
        replace: true,
      });
    }
  };

  return (
    <>
      {error && (
        <ErrorMessage>{error?.data?.message || error.error}</ErrorMessage>
      )}

      <div className={styles["order-table"]}>
        <h2 className={styles.heading}>Orders</h2>

        <div className={styles.filter}>
          <div className={styles.filter__left}>
            <div className={styles.filter__group}>
              <span>Show</span>
              <select
                onChange={pageSizeChangeHandler}
                value={search.get("pageSize") || ""}
              >
                <option value="">6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
              <span>entries</span>
            </div>
          </div>
          <div className={styles.filter__right}>
            <div className={styles.filter__group}>
              <label>Status</label>
              <select
                onChange={statusChangeHandler}
                value={search.get("status") || ""}
              >
                <option value="">Any</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            <form onSubmit={searchHandler}>
              <label>Order ID</label>
              <input
                name="order_id"
                type="search"
                onChange={searchChangeHandler}
              />
              <button>
                <SearchIcon className={styles["search-icon"]} />
              </button>
            </form>
          </div>
        </div>

        <div className={styles["table-wraper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>id</th>
                <th>user</th>
                <th>order at</th>
                <th>total</th>
                <th>paid at</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {!isFetching &&
                !error &&
                orders?.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <Link to={`/admin/orders/${order.orderId}`}>
                        {order.orderId}
                      </Link>
                    </td>
                    <td>{order?.user?.email}</td>
                    <td>{formatDate(new Date(order.createdAt), options)}</td>
                    <td>{order.grandTotal}</td>
                    <td>
                      {order.paidAt ? (
                        formatDate(new Date(order.paidAt), options)
                      ) : (
                        <CloseIcon className={styles["icon-close"]} />
                      )}
                    </td>
                    <td>{order.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {isFetching && <LoadingSpinner />}
      </div>

      {!isFetching && !error && orders.length > 0 && (
        <Pagination page={page} pages={pages} />
      )}
    </>
  );
}
