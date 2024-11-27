import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import styles from "./ProfilePageLayout.module.scss";
import Container from "../components/ui/Container";
import UserIcon from "../assets/icons/UserIcon";

import { useGetProfileQuery } from "../redux/user/usersApiSlice";

export default function ProfilePageLayout() {
  const location = useLocation();

  const path = location.pathname.split("/").pop();

  const { data: user, isFetching, error, refetch } = useGetProfileQuery();

  const [imageKey, setImageKey] = useState(0);

  const updateImage = () => {
    setImageKey((prevKey) => prevKey + 1); // Increment the key to force re-render
  };

  const uploadAvatar = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("/api/users/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      refetch();
      updateImage();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <section id={styles["profile-page"]}>
      <Container>
        <div className={styles.profile}>
          <div className={styles.profile__menu}>
            <ul>
              <li>
                <label className={styles.avatar}>
                  {user?.avatar && (
                    <img
                      className={styles["avatar-img"]}
                      src={`/api/users/${user?._id}/avatar?${imageKey}`}
                      alt="user avatar"
                    />
                  )}

                  {!user?.avatar && (
                    <UserIcon className={styles["avater-icon"]} />
                  )}

                  <div className={styles.hints}>
                    <div className={styles.icon}></div>
                  </div>
                  <input
                    onChange={uploadAvatar}
                    id="avatar"
                    name="avatar"
                    hidden
                    type="file"
                  />
                </label>
                <div className={styles["user-info"]}>
                  <h3 className={styles.name}>{user?.name}</h3>
                  <span>{user?.email}</span>
                </div>
              </li>

              <li className={path === "profile" ? styles.active : ""}>
                <NavLink to="">Personal Info</NavLink>
              </li>

              <li className={path === "security" ? styles.active : ""}>
                <NavLink to="security">Security </NavLink>
              </li>

              <li className={path === "orders" ? styles.active : ""}>
                <NavLink to="orders">My Orders</NavLink>
              </li>
            </ul>
          </div>

          <div className={styles.details}>
            <Outlet />
          </div>
        </div>
      </Container>
    </section>
  );
}
