import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./UserProfile.module.scss";

import UserIcon from "../../assets/icons/UserIcon";
import ExitIcon from "../../assets/icons/ExitIcon";
import OrdersIcon from "../../assets/icons/OrdersIcon";
import authSlice from "../../redux/auth/authSlice";
import authApiSlice from "../../redux/auth/authApiSlice";
import { useGetProfileQuery } from "../../redux/user/usersApiSlice";

function UserProfile() {
  const dispatch = useDispatch();

  const [dropdown, setDropdown] = useState(false);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const { data: user, isFetching, error } = useGetProfileQuery();

  const [logout] = authApiSlice.useLogoutMutation();

  function dropdownHandleMouseEnter() {
    setDropdown(true);
  }
  function dropdownHandleMouseLeave() {
    setDropdown(false);
  }

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.log(error);
    }
    dispatch(authSlice.actions.logout());
    document.location.href = "/login";
  };

  return (
    <div className={styles["user-profile"]} onMouseLeave={dropdownHandleMouseLeave} onMouseEnter={dropdownHandleMouseEnter}>
      <div className={styles.profile}>
        {user?.avatar ? (
          <img src={`/api/users/${userInfo._id}/avatar`} className={styles.avater} alt="user avatar" />
        ) : (
          <UserIcon className={styles["avater-icon"]} />
        )}
      </div>
      <div className={`${styles.menu} ${dropdown && styles.active}`}>
        <h2>{user?.name}</h2>
        <ul>
          <li>
            <UserIcon className={styles["menu-icons"]} />
            <Link to="/profile">My profile</Link>
          </li>

          <li>
            <OrdersIcon className={styles["menu-icons"]} />
            <Link to="/profile/orders">My Orders</Link>
          </li>
          <li>
            <ExitIcon className={styles["menu-icons"]} />
            <button onClick={logoutHandler}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserProfile;
