import { NavLink, Outlet, useLocation } from "react-router-dom";

import styles from "./AdminDashboardPageLayout.module.scss";
import UsersIcon from "../assets/icons/UsersIcon";
import ProductsIcon from "../assets/icons/ProductsIcon";
import OrdersIcon from "../assets/icons/OrdersIcon";
import DasboardIcon from "../assets/icons/DasboardIcon";
import StoreIcon from "../assets/icons/StorageIcon";

export default function AdminDashboardPageLayout() {
  const location = useLocation();

  const path = location.pathname.split("/").pop();

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard__menu}>
        <ul>
          <li className={path === "dashboard" ? styles.active : ""}>
            <NavLink to="">
              <DasboardIcon className={styles.icon} />
              <span>dashboard</span>
            </NavLink>
          </li>

          <li className={path === "users" ? styles.active : ""}>
            <NavLink to="users">
              <UsersIcon className={styles.icon} />
              <span>Users</span>
            </NavLink>
          </li>

          <li className={path === "products" ? styles.active : ""}>
            <NavLink to="products">
              <ProductsIcon className={styles.icon} />
              <span>products</span>
            </NavLink>
          </li>

          <li className={path === "orders" ? styles.active : ""}>
            <NavLink to="orders">
              <OrdersIcon className={styles.icon} />
              <span>Orders</span>
            </NavLink>
          </li>
          <li className={path === "categories" ? styles.active : ""}>
            <NavLink to="categories">
              <StoreIcon className={styles.icon} />
              <span>Catagories</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={styles.details}>
        <Outlet />
      </div>
    </div>
  );
}
