import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./Users.module.scss";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import SearchIcon from "../../assets/icons/SearchIcon";
import Pagination from "../../components/Pagination";

import apiSlice from "../../redux/apiSlice";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../redux/user/usersApiSlice";

export default function Users() {
  const dispatch = useDispatch();
  const [search, setSearch] = useSearchParams();

  const email = search.get("email");
  const role = search.get("role");
  const pageNumber = search.get("pageNumber");
  const pageSize = search.get("pageSize");

  let query = {
    pageSize: 6,
  };
  if (email) query.email = email;
  if (role) query.role = role;
  if (pageNumber) query.page = pageNumber;
  if (pageSize) query.pageSize = pageSize;

  const {
    data: { users, page, pages } = {},
    isFetching,
    error: fetchError,
  } = useGetUsersQuery(query);

  const [deleteUser, { error: deleteError }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure? You wanna delete!")) {
      const deleteResult = dispatch(
        apiSlice.util.updateQueryData("getUsers", query, (draftData) => {
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

  const pageSizeChangeHandler = (event) => {
    const pageSize = event.target.value;
    if (pageSize.length === 0) {
      search.delete("pageSize");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("pageSize", pageSize);
      setSearch(search, {
        replace: true,
      });
    }
  };

  const roleChangeHandler = (event) => {
    const role = event.target.value;
    if (role.length === 0) {
      search.delete("role");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("role", role);
      setSearch(search, {
        replace: true,
      });
    }
  };

  const searchHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { email } = Object.fromEntries(formData.entries());

    if (email.length === 0) {
      search.delete("email");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("email", email);
      setSearch(search, {
        replace: true,
      });
    }
  };

  const searchChangeHandler = (event) => {
    if (!event.target.value) {
      search.delete("email");
      setSearch(search, {
        replace: true,
      });
    }
  };

  return (
    <>
      {fetchError && (
        <ErrorMessage>
          {fetchError?.data?.message || fetchError.error}
        </ErrorMessage>
      )}
      {deleteError && (
        <ErrorMessage>
          {deleteError?.data?.message || deleteError.error}
        </ErrorMessage>
      )}

      <div className={styles["user-table"]}>
        <h2 className={styles.heading}>Users</h2>

        <div className={styles.filter}>
          <div className={styles.filter__left}>
            <div className={styles.filter__group}>
              <span>Show</span>
              <select
                onChange={pageSizeChangeHandler}
                value={search.get("pageSize") || ""}
              >
                <option value="">6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
              <span>entries</span>
            </div>
          </div>
          <div className={styles.filter__right}>
            <div className={styles.filter__group}>
              <label>Role</label>
              <select
                onChange={roleChangeHandler}
                value={search.get("role") || ""}
              >
                <option value="">Any</option>
                <option value="customer">Customer</option>
                <option value="superadmin">Superadmin</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <form onSubmit={searchHandler}>
              <label>Email</label>
              <input
                name="email"
                type="search"
                onChange={searchChangeHandler}
              />
              <button>
                <SearchIcon className={styles["search-icon"]} />
              </button>
            </form>
          </div>
        </div>

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
              {!isFetching &&
                !fetchError &&
                users?.map((user) => (
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

        {isFetching && <LoadingSpinner />}
      </div>

      {!isFetching && !fetchError && users.length > 0 && (
        <Pagination page={page} pages={pages} />
      )}
    </>
  );
}
