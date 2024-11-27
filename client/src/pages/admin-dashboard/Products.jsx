import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./Products.module.scss";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import SearchIcon from "../../assets/icons/SearchIcon";
import ErrorMessage from "../../components/ui/ErrorMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { formatCurrency } from "../../utilities/formaters";
import apiSlice from "../../redux/apiSlice";
import {
  useDeleteProductMutation,
  useGetProductListQuery,
} from "../../redux/products/productsApiSlice";
import Pagination from "../../components/Pagination";
import { useGetCategoriesBrandsQuery } from "../../redux/category/categoryApiSlice";

export default function Products() {
  const dispatch = useDispatch();
  const [search, setSearch] = useSearchParams();

  const keyword = search.get("keyword");
  const brands = search.get("brand");
  const pageNumber = search.get("pageNumber");
  const pageSize = search.get("pageSize");

  let query = {
    pageSize: 6,
  };
  if (keyword) query.keyword = keyword;
  if (brands) query.brands = brands;
  if (pageNumber) query.page = pageNumber;
  if (pageSize) query.pageSize = pageSize;

  const {
    data: { products, page, pages } = {},
    isFetching,
    error: fetchError,
  } = useGetProductListQuery(query);

  const { data } = useGetCategoriesBrandsQuery();

  const [deleteProduct, { error: deleteError }] = useDeleteProductMutation();

  async function deleteHandler(id) {
    if (window.confirm("Are you sure? You wanna delete!")) {
      const deleteResult = dispatch(
        apiSlice.util.updateQueryData("getProductList", query, (draftData) => {
          console.log(JSON.parse(JSON.stringify(draftData)));

          draftData.products = draftData.products.filter(
            (product) => product._id !== id
          );
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

  const searchHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const { keyword } = Object.fromEntries(formData.entries());

    if (keyword.length === 0) {
      search.delete("keyword");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("keyword", keyword);
      setSearch(search, {
        replace: true,
      });
    }
  };

  const searchChangeHandler = (event) => {
    if (!event.target.value) {
      search.delete("keyword");
      setSearch(search, {
        replace: true,
      });
    }
  };

  const brandChangeHandler = (event) => {
    const brand = event.target.value;
    if (brand.length === 0) {
      search.delete("brand");
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set("brand", brand);
      setSearch(search, {
        replace: true,
      });
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

      <div className={styles["product-table"]}>
        <div className={styles.header}>
          <h2>Products</h2>
          <Link to="/admin/products/create">Add product</Link>
        </div>

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
              <label>Brand</label>
              <select
                onChange={brandChangeHandler}
                value={search.get("brand") || ""}
              >
                <option value="">Any</option>
                {data?.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={searchHandler}>
              <label>Name</label>
              <input
                onChange={searchChangeHandler}
                name="keyword"
                type="search"
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
                <th>id</th>
                <th>name</th>
                <th>price</th>
                <th>brand</th>
                <th>stock</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {!isFetching &&
                !fetchError &&
                products?.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <Link to={`/admin/products/${product._id}`}>
                        {product._id}
                      </Link>
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

        {isFetching && <LoadingSpinner />}
      </div>

      {!isFetching && !fetchError && products.length > 0 && (
        <Pagination page={page} pages={pages} />
      )}
    </>
  );
}
