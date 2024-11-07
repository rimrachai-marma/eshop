import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import styles from "./Header.module.scss";

import StoreIcon from "../../assets/icons/StoreIcon";
import UserIcon from "../../assets/icons/UserIcon";

import Search from "./Search";
import Container from "../ui/Container";
import UserProfile from "./UserProfile";

function Header() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLogedIn = !!userInfo;

  const { cartItems } = useSelector((state) => state.cart);

  const [cartIsHighlighted, setCartIsHighlighted] = useState(false);

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (totalQuantity === 0) {
      return;
    }
    setCartIsHighlighted(true);

    const timer = setTimeout(() => {
      setCartIsHighlighted(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [totalQuantity]);

  return (
    <header id={styles.header}>
      <Container>
        <div className={styles.header}>
          <NavLink replace to="/">
            <img src="/logo.png" alt="logo" className={styles.logo} />
          </NavLink>

          <Search />

          <nav className={styles["user-nav"]}>
            <NavLink to="/cart" className={styles.cart}>
              <div className={cartIsHighlighted ? `${styles.bump} ${styles["cart-icon-group"]}` : styles["cart-icon-group"]}>
                <StoreIcon className={styles["cart-icon"]} />
                <span className={styles["cart-quantity"]}>{totalQuantity}</span>
              </div>
            </NavLink>
            {isLogedIn && <UserProfile />}

            {!isLogedIn && (
              <NavLink to="/login" className={styles.login}>
                <UserIcon className={styles["user-icon"]} />

                <span>Sign in</span>
              </NavLink>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}

export default Header;
