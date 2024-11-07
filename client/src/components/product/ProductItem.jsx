import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./ProductItem.module.scss";

import { formatCurrency } from "../../utilities/formaters";
import StoreIcon from "../../assets/icons/StoreIcon";
import Rating from "../Rating";
import cartSlice from "../../redux/cart/cartSlice";

function ProductItem({ product }) {
  const dispatch = useDispatch();

  const addToCartHandler = (id) => {
    dispatch(cartSlice.actions.addOrIncreamentCartItem({ id, quantity: 1 }));
  };

  return (
    <div className={styles.card}>
      <div className={styles["card-header"]}>
        <Link to={`/products/${product._id}`}>
          <img src={product.image} loading="lazy" alt={product.name} />
        </Link>
      </div>
      <div className={styles["card-body"]}>
        <Link to={`/products/${product._id}`}>
          <div className={styles["card-title"]}>{product.name}</div>
        </Link>
        <Rating
          value={product.rating}
          text={`${product.numReviews} reviews`}
          className={styles.rating}
        />
      </div>
      <div className={styles["card-footer"]}>
        <span className={styles.price}>
          {formatCurrency(product.price, "USD")}
        </span>
        <button
          onClick={() => addToCartHandler(product._id)}
          disabled={product.countInStock === 0}
          className={styles["btn"]}
        >
          <span className={styles["btn-text"]}>Add to cart</span>
          <span className={styles["btn-icon"]}>
            <StoreIcon className={styles["cart-icon"]} />
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProductItem;
