import { Outlet } from "react-router-dom";

import styles from "./AuthLayout.module.scss";
import Footer from "../components/footer/Footer";

function AuthLayout() {
  return (
    <>
      <main id={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default AuthLayout;
