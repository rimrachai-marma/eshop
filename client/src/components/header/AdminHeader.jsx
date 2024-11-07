import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./AdminHeader.module.scss";
import authApiSlice from "../../redux/auth/authApiSlice";
import authSlice from "../../redux/auth/authSlice";

function AdminHeader() {
  const dispatch = useDispatch();

  const [logout] = authApiSlice.useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
      dispatch(authSlice.actions.logout());
      document.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header id={styles.header}>
      <div className={styles["brand-logo"]}>
        <NavLink replace to="/">
          <img src="/logo.png" alt="logo" />
        </NavLink>
      </div>
      <div className={styles.menu}>
        <nav>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
        <button onClick={logoutHandler}>Logout</button>
      </div>
    </header>
  );
}

export default AdminHeader;
