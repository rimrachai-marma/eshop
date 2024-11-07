import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./CartItem.module.scss";

import { formatCurrency } from "../../../utilities/formaters";
import cartSlice from "../../../redux/cart/cartSlice";
import { useGetStoreItemQuery } from "../../../redux/products/productsApiSlice";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

function CartItem({ cartItem }) {
  const dispatch = useDispatch();

  const { data: storeItem, isFetching } = useGetStoreItemQuery(cartItem.id);

  const increaseCartItem = (id) => {
    dispatch(cartSlice.actions.addOrIncreamentCartItem({ id, quantity: 1 }));
  };

  const decreaseCartItem = (id) => {
    dispatch(cartSlice.actions.removeOrDecreamentCartItem({ id, quantity: 1 }));
  };

  const removeCartItem = (id) => {
    dispatch(cartSlice.actions.removeCartItem({ id, quantity: 1 }));
  };

  if (isFetching) {
    return (
      <li className={styles["loader-item"]}>
        <LoadingSpinner />
      </li>
    );
  }

  return (
    <li className={styles["cart-item"]}>
      <div className={styles["cart-item_img"]}>
        <Link to={`/products/${cartItem?.id}`}>
          <img
            src={storeItem?.image ?? "/images/not-available.jpg"}
            alt={storeItem?.name ?? "Item not available"}
          />
        </Link>
      </div>

      <div className={styles["cart-item_title"]}>
        <Link to={`/products/${cartItem?.id}`}>
          <div
            className={
              storeItem
                ? styles.name
                : `${styles.name} ${styles["not-available"]}`
            }
          >
            {storeItem?.name ?? "This Item is not available any more"}
          </div>
        </Link>
        <div className={styles.qty}>
          <span>&#10006;</span>
          {cartItem.quantity} {cartItem.quantity === 1 ? "item" : "items"}
        </div>
      </div>
      <div className={styles["cart-item_price"]}>
        {formatCurrency((storeItem?.price ?? 0) * cartItem.quantity, "USD")}
        <span>({formatCurrency(storeItem?.price ?? 0, "USD")}/item)</span>
      </div>
      <div className={styles["cart-item_add-and-remove"]}>
        <button onClick={() => increaseCartItem(cartItem.id)}>&#43;</button>
        <button onClick={() => decreaseCartItem(cartItem.id)}>&#8722;</button>
        <button onClick={() => removeCartItem(cartItem.id)}>&#215;</button>
      </div>
    </li>
  );
}

export default CartItem;
