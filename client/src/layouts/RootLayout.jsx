import { Outlet } from "react-router-dom";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

import styles from "./RootLayout.module.scss";
import Error from "../components/Error";

function RootLayout() {
  return (
    <>
      <Header />
      <main id={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default RootLayout;
