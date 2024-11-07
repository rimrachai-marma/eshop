import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Form.module.scss";

import FormInput from "../../../components/FormInput";
import { isEmail, isStrongPassword } from "../../../utilities/validator";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import authApiSlice from "../../../redux/auth/authApiSlice";
import authSlice from "../../../redux/auth/authSlice";

function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoggedIn = !!userInfo;

  const [register, { isLoading, error }] = authApiSlice.useRegisterMutation();

  const [search] = useSearchParams();
  const origin = search.get("redirect");
  const redirectPath = origin ? `?redirect=${origin}` : "";

  const [enteredUserInfo, setEnteredUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [userInfoToutched, setUserInfoToutched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const nameIsNotEmty = enteredUserInfo.name.length > 0;
  const nameInputIsInvaliedAsEmpty = !nameIsNotEmty && userInfoToutched.name;

  const enteredEmailIsValied = isEmail(enteredUserInfo.email);
  const emailInputIsInvalied = !enteredEmailIsValied && userInfoToutched.email;

  const enteredPasswordIsValied = isStrongPassword(enteredUserInfo.password);
  const passwordInputIsInvalied = !enteredPasswordIsValied && userInfoToutched.password;

  const enteredConfirmPasswordIsValied = enteredUserInfo.password === enteredUserInfo.confirmPassword;
  const confirmPasswordInputIsInvalied = !enteredConfirmPasswordIsValied && userInfoToutched.confirmPassword;

  let formIsValid = false;
  if (nameIsNotEmty && enteredEmailIsValied && enteredPasswordIsValied && enteredConfirmPasswordIsValied) {
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
      const res = await register({
        name: enteredUserInfo.name,
        email: enteredUserInfo.email,
        password: enteredUserInfo.password,
      }).unwrap();

      dispatch(authSlice.actions.setCredentials({ ...res }));

      navigate(origin ? origin : "/", { replace: true });
    } catch (error) {
      console.log(error);
    }

    setEnteredUserInfo({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setUserInfoToutched({
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
    });
  }

  if (isLoggedIn) return <Navigate to="/" replace />;

  return (
    <div className={styles["auth-form"]}>
      <h1>Register</h1>

      {error && (
        <div className={styles.error}>
          <ErrorMessage>{error?.data?.message || error.error}</ErrorMessage>
        </div>
      )}

      <form onSubmit={submitHander}>
        <FormInput
          name="name"
          id="name"
          type="name"
          label="Name"
          placeholder="Name"
          value={enteredUserInfo.name}
          handleChange={handleChange}
          handleBlur={handleBlur}
          valid={nameIsNotEmty}
          error={nameInputIsInvaliedAsEmpty}
          errorMassage="Name must not be empty!"
        />
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
          valid={enteredPasswordIsValied}
          error={passwordInputIsInvalied}
          errorMassage="Password must be at least a lowecase, an uppercase, a numeric value and a special character!"
        />
        <FormInput
          name="confirmPassword"
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm Password"
          value={enteredUserInfo.confirmPassword}
          handleChange={handleChange}
          handleBlur={handleBlur}
          valid={enteredConfirmPasswordIsValied && enteredUserInfo.confirmPassword !== ""}
          error={confirmPasswordInputIsInvalied}
          errorMassage="Password dose not match!"
        />

        <button disabled={!formIsValid} className={styles.btn}>
          {isLoading ? "loading..." : "Register"}
        </button>
      </form>

      <p>
        Have an account?
        <Link to={`/login${redirectPath}`}>Login</Link>
      </p>
    </div>
  );
}

export default Form;
