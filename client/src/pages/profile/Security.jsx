import { useState } from "react";
import { useDispatch } from "react-redux";

import styles from "./Security.module.scss";
import FormInput from "./components/FormInput";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Message from "../../components/ui/Message";
import authApiSlice from "../../redux/auth/authApiSlice";
import authSlice from "../../redux/auth/authSlice";

const Security = () => {
  const dispatch = useDispatch();

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmedPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [logoutAllDevices] = authApiSlice.useLogoutAllDevicesMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPassword((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handelSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setMessage("");
    try {
      const res = await fetch("/api/users/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(password),
      });

      const data = await res.json();
      if (!res.ok) {
        return setError(data);
      }

      setMessage(data.message);
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmedPassword: "",
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutAllDevices().unwrap();
      dispatch(authSlice.actions.logout());
      document.location.href = "/login";
    } catch (error) {
      console.error(error);
    }
  };

  const acountDeleteHandler = async () => {
    if (window.confirm("Are you sure? You wanna delete acount!")) {
      try {
        const res = await fetch("/api/users/profile", { method: "DELETE" });

        const data = await res.json();
        if (!res.ok) {
          console.error(data);
        }

        localStorage.removeItem("_cart_items_");
        dispatch(authSlice.actions.logout());
        document.location.href = "/register";
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <h2 className={styles.heading}>Security</h2>

      <section className={styles.section}>
        {error && <ErrorMessage>{error?.message}</ErrorMessage>}
        {message && <Message>{message}</Message>}

        <h3>Change password</h3>

        <form className={styles.form} onSubmit={handelSubmit}>
          <FormInput
            name="currentPassword"
            label="Current Password"
            id="currentPassword"
            htmlFor="currentPassword"
            type="password"
            placeholder="Current Password"
            value={password.currentPassword}
            onChange={handleChange}
            error={error?.extrafield?.errors.hasOwnProperty("currentPassword")}
            errorMassage={error?.extrafield?.errors.currentPassword}
          />

          <FormInput
            name="newPassword"
            label="New Password"
            id="newPassword"
            htmlFor="newPassword"
            type="password"
            autocomplete="new-password"
            placeholder="New Password"
            value={password.newPassword}
            onChange={handleChange}
            error={error?.extrafield?.errors.hasOwnProperty("newPassword")}
            errorMassage={error?.extrafield?.errors.newPassword}
          />

          <FormInput
            name="confirmedPassword"
            label="Confirmed password"
            id="confirmedPassword"
            htmlFor="confirmedPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Confirmed password"
            value={password.confirmedPassword}
            onChange={handleChange}
            error={error?.extrafield?.errors.hasOwnProperty("confirmedPassword")}
            errorMassage={error?.extrafield?.errors.confirmedPassword}
          />

          <button> {loading ? " Changing" : "Change"}</button>
        </form>
      </section>

      <section className={styles.section}>
        <h3>More actions</h3>

        <div className={styles["action-btns"]}>
          <button onClick={logoutHandler}>Logout all divices</button>
          <button onClick={acountDeleteHandler}>Delete acount</button>
        </div>
      </section>
    </>
  );
};

export default Security;
