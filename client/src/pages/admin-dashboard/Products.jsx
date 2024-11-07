import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./Products.module.scss";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import { formatCurrency } from "../../utilities/formaters";
import ErrorMessage from "../../components/ui/ErrorMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import apiSlice from "../../redux/apiSlice";
import { useDeleteProductMutation, useGetProductListQuery } from "../../redux/products/productsApiSlice";

export default function Products() {
  const dispatch = useDispatch();

  const { data: { products, page, pages } = {}, isFetching, error: fetchError } = useGetProductListQuery();

  const [deleteProduct, { error: deleteError }] = useDeleteProductMutation();

  async function deleteHandler(id) {
    if (window.confirm("Are you sure? You wanna delete!")) {
      const deleteResult = dispatch(
        apiSlice.util.updateQueryData("getProductList", undefined, (draftData) => {
          console.log(JSON.parse(JSON.stringify(draftData)));

          draftData.products = draftData.products.filter((product) => product._id !== id);
        })
      );

      try {
        const data = await deleteProduct(id).unwrap();
        console.log(data);
      } catch (error) {
        console.log(error);
        deleteResult.undo();
      }
    }
  }

  function truncateText(text, charLimit = 40) {
    if (text.length <= charLimit) {
      return text;
    }

    return text.slice(0, charLimit) + "...";
  }

  if (isFetching) return <LoadingSpinner />;

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.heading}>Products</h2>
        <Link to="/admin/products/create">Add product</Link>
      </div>

      {fetchError && <ErrorMessage>{fetchError?.data?.message || fetchError.error}</ErrorMessage>}
      {deleteError && <ErrorMessage>{deleteError?.data?.message || deleteError.error}</ErrorMessage>}

      <div className={styles["table-wraper"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>price</th>
              <th>brand</th>
              <th>stock</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id}>
                <td>
                  <Link to={`/admin/products/${product._id}`}>{product._id}</Link>
                </td>
                <td>{truncateText(product.name)}</td>
                <td>{formatCurrency(product.price, "USD")}</td>
                <td>{product.brand}</td>
                <td>{product.countInStock}</td>
                <td>
                  <div className={styles["action-btn"]}>
                    <button onClick={() => deleteHandler(product._id)}>
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
