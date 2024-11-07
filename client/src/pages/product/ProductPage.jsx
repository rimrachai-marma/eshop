import { useState } from "react";
import { useDispatch } from "react-redux";

import { Link, Outlet, useLocation, useParams } from "react-router-dom";

import styles from "./ProductPage.module.scss";

import StoreIcon from "../../assets/icons/StoreIcon";
import Rating from "../../components/Rating";
import Container from "../../components/ui/Container";
import { formatCurrency } from "../../utilities/formaters";
import ChevronIconRight from "../../assets/icons/ChevronIconRight";
import ChevronIconDown from "../../assets/icons/ChevronIconDown";
import { useGetProductQuery } from "../../redux/products/productsApiSlice";
import ErrorMessage from "../../components/ui/ErrorMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import cartSlice from "../../redux/cart/cartSlice";

function ProductPage() {
  const location = useLocation();
  const params = useParams();
  const dispatch = useDispatch();

  const { data: product, isFetching, error } = useGetProductQuery(params.id);

  const [qty, setQty] = useState(1);

  const addToCartHandler = (id, quantity) => {
    dispatch(cartSlice.actions.addOrIncreamentCartItem({ id, quantity }));
  };

  return (
    <>
      <section id={styles.product}>
        <Container>
          {error && <ErrorMessage>{error.data.message || error.message}</ErrorMessage>}

          {isFetching && <LoadingSpinner />}

          {product && (
            <div className={styles.product__details}>
              <div className={styles.image}>
                <img src={product?.image} loading="lazy" alt={product?.name} />
              </div>
              <div className={styles.details}>
                <h2 className={styles.details_title}>{product?.name}</h2>
                <Rating className={styles.details_rating} value={product?.rating} text={`(${product?.numReviews} reviews)`} />
                <p className={styles.details_availability}>
                  Availability &#40;
                  <strong>{product?.countInStock > 0 ? "In Stock" : "Out Of Stock"}</strong>
                  &#41;
                </p>
                {product?.countInStock > 0 && product?.countInStock <= 3 && <span>Only {product.countInStock} left in stock order soon.</span>}
                <h3 className={styles.details_price}>{formatCurrency(product?.price ?? 0, "USD")}</h3>
                <p className={styles.details_description}>
                  <span>Description: </span>
                  {product?.description}
                </p>

                <div className={styles["details_add-to-cart"]}>
                  <select value={qty} onChange={(e) => setQty(Number(e.target.value))} disabled={product?.countInStock === 0}>
                    {[...Array(product?.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button disabled={product?.countInStock < 1} className={styles["btn"]} onClick={() => addToCartHandler(product._id, qty)}>
                    <span className={styles["text"]}>Add to cart</span>
                    <span className={styles["icon"]}>
                      <StoreIcon className={styles["cart-icon"]} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
      {product && (
        <section id={styles["product-review"]}>
          <Container>
            <Link className={styles.btn_inline} to={location.pathname.split("/").pop() === "review" ? -1 : "review"}>
              <div className={styles.btn_inline_wraper}>
                {location.pathname.split("/").pop() === "review" ? (
                  <ChevronIconDown className={styles.btn_inline_icon} />
                ) : (
                  <ChevronIconRight className={styles.btn_inline_icon} />
                )}
                <span>{location.pathname.split("/").pop() === "review" ? "Hide reviews" : "See reviews"}</span>
              </div>
            </Link>
            <Outlet />
          </Container>
        </section>
      )}
    </>
  );
}

export default ProductPage;
