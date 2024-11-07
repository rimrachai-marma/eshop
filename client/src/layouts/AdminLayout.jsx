import { Outlet } from "react-router-dom";

import Footer from "../components/footer/Footer";

import styles from "./AdminLayout.module.scss";
import AdminHeader from "../components/header/AdminHeader";

function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <main id={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default AdminLayout;
