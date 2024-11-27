import { useLocation, useParams, useSearchParams } from "react-router-dom";

import styles from "./ProductList.module.scss";

import ProductItem from "./ProductItem";
import ErrorMessage from "../ui/ErrorMessage";
import Heading from "../ui/Heading";
import ProductShimmerEffect from "../ui/ProductShimmerEffect";
import Pagination from "../Pagination";
import { useGetProductsQuery } from "../../redux/products/productsApiSlice";

function ProductList() {
  const [search] = useSearchParams();
  const location = useLocation();
  const params = useParams();

  const pageNumber = search.get("pageNumber");
  const keyword = search.get("keyword");
  const brands = search.get("brands");
  const in_stock = search.get("in_stock");
  const rating = search.get("rating");
  const min_price = search.get("min_price");
  const max_price = search.get("max_price");
  const sort = search.get("sort");
  const order = search.get("order");

  let filter = false;
  if (
    keyword ||
    brands ||
    in_stock ||
    rating ||
    min_price ||
    max_price ||
    params.keyword
  )
    filter = true;

  let query = {};
  if (pageNumber) query.page = pageNumber;
  if (brands) query.brands = brands;
  if (in_stock) query.in_stock = in_stock;
  if (rating) query.rating = rating;
  if (min_price) query.min_price = min_price;
  if (max_price) query.max_price = max_price;
  if (sort) query.sort = sort;
  if (order) query.order = order;
  if (location.pathname.includes("/products/search")) {
    query.keyword = params.keyword;
  } else {
    if (keyword) query.keyword = keyword;
  }
  if (location.pathname.includes("/products/category")) {
    query.category = params.category;
  }

  const {
    data: { products, page, pages } = {},
    isFetching,
    error,
  } = useGetProductsQuery(query);

  return (
    <div className={styles.wraper}>
      {error && (
        <ErrorMessage>{error?.data?.message || error?.message}</ErrorMessage>
      )}

      {!isFetching && !error && products.length < 1 && (
        <Heading>Not found any product</Heading>
      )}

      {!isFetching && !error && products.length > 0 && filter && (
        <Heading>Products Found</Heading>
      )}

      {isFetching && (
        <div className={styles.products}>
          {[...Array(8).keys()].map((x) => (
            <ProductShimmerEffect key={x} />
          ))}
        </div>
      )}

      {!isFetching && !error && (
        <div className={styles.products}>
          {products?.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>
      )}

      {!isFetching && !error && products.length > 0 && (
        <Pagination page={page} pages={pages} />
      )}
    </div>
  );
}

export default ProductList;
