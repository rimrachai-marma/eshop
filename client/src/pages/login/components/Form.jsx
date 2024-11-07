import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Form.module.scss";

import FormInput from "../../../components/FormInput";
import { isEmail } from "../../../utilities/validator";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import authSlice from "../../../redux/auth/authSlice";
import authApiSlice from "../../../redux/auth/authApiSlice";

function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoggedIn = !!userInfo;

  const [login, { isLoading, error }] = authApiSlice.useLoginMutation();

  const [search] = useSearchParams();
  const origin = search.get("redirect");
  const redirectPath = origin ? `?redirect=${origin}` : "";

  const [enteredUserInfo, setEnteredUserInfo] = useState({
    email: "",
    password: "",
  });
  const [userInfoToutched, setUserInfoToutched] = useState({
    email: false,
    password: false,
  });

  const enteredEmailIsValied = isEmail(enteredUserInfo.email);
  const emailInputIsInvalied = !enteredEmailIsValied && userInfoToutched.email;

  const passwordIsNotEmpty = enteredUserInfo.password.length > 0;
  const passwordInputIsInvaliedAsEmpty = !passwordIsNotEmpty && userInfoToutched.password;

  let formIsValid = false;
  if (enteredEmailIsValied && passwordIsNotEmpty) {
    formIsValid = true;
  }

  //handlers
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEnteredUserInfo((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleBlur = (event) => {
    const name = event.target.name;
    setUserInfoToutched((prevValue) => {
      return {
        ...prevValue,
        [name]: true,
      };
    });
  };

  async function submitHander(event) {
    event.preventDefault();

    try {
      const data = await login({
        email: enteredUserInfo.email,
        password: enteredUserInfo.password,
      }).unwrap();

      dispatch(authSlice.actions.setCredentials({ ...data }));

      if (data.role === "admin" || data.role === "superadmin") {
        navigate(origin ? origin : "/admin", { replace: true });
      } else {
        navigate(origin ? origin : "/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }

    setEnteredUserInfo({ email: "", password: "" });
    setUserInfoToutched({ email: false, password: false });
  }

  if (isLoggedIn) return <Navigate to="/" replace />;

  return (
    <div className={styles["auth-form"]}>
      <h1>Login</h1>

      {error && <ErrorMessage>{error?.data?.message || error.error}</ErrorMessage>}

      <form onSubmit={submitHander}>
        <FormInput
          name="email"
          id="email"
          type="email"
          label="Email"
          placeholder="Email"
          value={enteredUserInfo.email}
          handleChange={handleChange}
          handleBlur={handleBlur}
          valid={enteredEmailIsValied}
          error={emailInputIsInvalied}
          errorMassage="Please enter a valid email address!"
        />
        <FormInput
          name="password"
          id="password"
          type="password"
          label="Password"
          placeholder="Password"
          value={enteredUserInfo.password}
          handleChange={handleChange}
          handleBlur={handleBlur}
          valid={passwordIsNotEmpty}
          error={passwordInputIsInvaliedAsEmpty}
          errorMassage="Please enter password!"
        />

        <button disabled={!formIsValid} className={styles.btn}>
          {isLoading ? "login in..." : "login"}
        </button>
      </form>

      <p>
        New Customer?
        <Link to={`/register${redirectPath}`}>Register</Link>
      </p>
    </div>
  );
}

export default Form;
