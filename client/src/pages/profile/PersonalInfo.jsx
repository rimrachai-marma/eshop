import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import styles from "./PersonalInfo.module.scss";
import FormInput from "./components/FormInput";
import { useGetProfileQuery } from "../../redux/user/usersApiSlice";
import { useUpdateProfileMutation } from "../../redux/user/usersApiSlice";
import ErrorMessage from "../../components/ui/ErrorMessage";
import apiSlice from "../../redux/apiSlice";

const PersonalInfo = () => {
  const dispatch = useDispatch();

  const { data: user, isFetching } = useGetProfileQuery();
  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    setUserInfo({ name: user?.name ?? "", email: user?.email ?? "" });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const patchResult = dispatch(
      apiSlice.util.updateQueryData("getProfile", undefined, (draftData) => {
        console.log(JSON.parse(JSON.stringify(draftData)));

        Object.assign(draftData, {
          name: userInfo.name,
          email: userInfo.email,
        });
      })
    );

    try {
      await updateProfile({
        name: userInfo.name,
        email: userInfo.email,
      }).unwrap();
    } catch (err) {
      console.error(err?.data?.message || err.error);
      patchResult.undo();
    }
  }

  return (
    <>
      <h2 className={styles.heading}>Personal info</h2>

      {error && <ErrorMessage>{error?.data?.message}</ErrorMessage>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <FormInput
          name="name"
          label="Name"
          id="name"
          htmlFor="name"
          type="text"
          placeholder="Name"
          value={userInfo.name}
          onChange={handleChange}
          error={error?.data?.extrafield?.errors.hasOwnProperty("name")}
          errorMassage={error?.data?.extrafield?.errors.name}
        />

        <FormInput
          name="email"
          label="Email"
          id="email"
          htmlFor="email"
          type="text"
          placeholder="Email"
          value={userInfo.email}
          onChange={handleChange}
          error={error?.data?.extrafield?.errors.hasOwnProperty("email")}
          errorMassage={error?.data?.extrafield?.errors.email}
        />

        <button> {isLoading ? " Updating" : "Update"}</button>
      </form>
    </>
  );
};

export default PersonalInfo;
