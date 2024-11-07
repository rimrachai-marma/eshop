import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./Categories.module.scss";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import ErrorMessage from "../../components/ui/ErrorMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import apiSlice from "../../redux/apiSlice";
import { useDeleteCategoryMutation, useGetCategoriesQuery } from "../../redux/category/categoryApiSlice";

export default function Categories() {
  const dispatch = useDispatch();

  const { data: categories, error: fetchError, isFetching } = useGetCategoriesQuery();
  const [deleteCategory, { error: deleteError }] = useDeleteCategoryMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure? You wanna delete!")) {
      const deleteResult = dispatch(
        apiSlice.util.updateQueryData("getCategories", undefined, (draftData) => {
          console.log(JSON.parse(JSON.stringify(draftData)));

          return draftData.filter((category) => category._id !== id);
        })
      );

      try {
        const data = await deleteCategory(id).unwrap();
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
      <div className={styles.header}>
        <h2 className={styles.heading}>Categories</h2>
        <Link to="/admin/categories/create">Add category</Link>
      </div>

      {fetchError && <ErrorMessage>{fetchError?.data?.message || fetchError.error}</ErrorMessage>}
      {deleteError && <ErrorMessage>{deleteError?.data?.message || deleteError.error}</ErrorMessage>}

      <div className={styles["table-wraper"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>name</th>
              <th>Parent Category</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category._id}>
                <td>
                  <Link to={`/admin/categories/${category._id}`}>{category.name}</Link>
                </td>

                <td>{category?.parentCategory?.name ?? <span>None</span>}</td>

                <td>
                  <div className={styles["action-btn"]}>
                    <button onClick={() => deleteHandler(category._id)}>
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
