import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./Users.module.scss";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import apiSlice from "../../redux/apiSlice";
import { useDeleteUserMutation, useGetUsersQuery } from "../../redux/user/usersApiSlice";

export default function Users() {
  const dispatch = useDispatch();
  const { data: { users } = {}, isFetching, error: fetchError } = useGetUsersQuery();

  const [deleteUser, { error: deleteError }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure? You wanna delete!")) {
      const deleteResult = dispatch(
        apiSlice.util.updateQueryData("getUsers", undefined, (draftData) => {
          console.log(JSON.parse(JSON.stringify(draftData)));

          draftData.users = draftData.users.filter((user) => user._id !== id);
        })
      );

      try {
        const data = await deleteUser(id).unwrap();
        console.log(data);
      } catch (error) {
        console.log(error);
        deleteResult.undo();
      }
    }
  };

  if (isFetching) return <LoadingSpinner />;

  return (
    <>
      <h2 className={styles.heading}>Users</h2>

      {fetchError && <ErrorMessage>{fetchError?.data?.message || fetchError.error}</ErrorMessage>}
      {deleteError && <ErrorMessage>{deleteError?.data?.message || deleteError.error}</ErrorMessage>}

      <div className={styles["table-wraper"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>name</th>
              <th>email</th>
              <th>role</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id}>
                <td>
                  <Link to={`/admin/users/${user._id}`}>{user.name}</Link>
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div className={styles["action-btn"]}>
                    <button onClick={() => deleteHandler(user._id)}>
                      <DeleteIcon className={styles["icon-delete"]} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
