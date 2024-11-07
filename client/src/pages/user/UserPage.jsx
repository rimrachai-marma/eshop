import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./UserPage.module.scss";
import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import ErrorMessage from "../../components/ui/ErrorMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import apiSlice from "../../redux/apiSlice";
import { useGetUserQuery, useUpdateUserMutation } from "../../redux/user/usersApiSlice";

export default function UserPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const [updateUser, { isLoading, error: upadateError }] = useUpdateUserMutation();

  const { data: user, isFetching, error: fetchError } = useGetUserQuery(params.id);

  const handleRoleChange = async (event) => {
    if (window.confirm("Are you sure? You wanna change role this user!")) {
      const patchResult = dispatch(
        apiSlice.util.updateQueryData("getUser", params.id, (draftData) => {
          console.log(JSON.parse(JSON.stringify(draftData)));

          Object.assign(draftData, { role: event.target.value });
        })
      );

      try {
        await updateUser({
          id: params.id,
          data: { role: event.target.value },
        }).unwrap();
      } catch (err) {
        console.error(err?.data?.message || err.error);
        patchResult.undo();
      }
    }
  };

  return (
    <section id={styles["user-page"]}>
      <Container>
        <div className={styles.wrapper}>
          <Heading>User Info</Heading>

          {upadateError && <ErrorMessage>{upadateError?.data?.message || upadateError.error}</ErrorMessage>}
          <div className={styles.group}>
            <span>Name</span>
            <span>{user?.name}</span>
          </div>

          <div className={styles.group}>
            <span>Email</span>
            <span>{user?.email}</span>
          </div>

          <div className={styles.group}>
            <span>Role</span>
            <fieldset>
              <label>
                <input name="role" type="radio" value="superadmin" checked={user?.role === "superadmin"} onChange={handleRoleChange} />
                Superadmin
              </label>

              <label>
                <input name="role" type="radio" value="admin" checked={user?.role === "admin"} onChange={handleRoleChange} />
                Admin
              </label>

              <label>
                <input name="role" type="radio" value="customer" checked={user?.role === "customer"} onChange={handleRoleChange} />
                Customer
              </label>
            </fieldset>
          </div>
        </div>
      </Container>
    </section>
  );
}
