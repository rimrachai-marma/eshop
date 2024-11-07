import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./CartPage.module.scss";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Message from "../../components/ui/Message";
import CartItem from "./components/CartItem";
import { useEffect, useState } from "react";

import cartSlice from "../../redux/cart/cartSlice";
import { formatCurrency } from "../../utilities/formaters";
import asyncReduce from "../../utilities/asyncReducer";
import asyncFilter from "../../utilities/asyncFilter";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const [subTotal, setSubTotal] = useState(0);

  const [checkoutItems, setCheckoutItems] = useState([]);

  async function fetchProduct(id) {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) return null;
    return await res.json();
  }

  // calculate total products price according with thats product available in server
  useEffect(() => {
    (async () => {
      const subTotal = await asyncReduce(
        cartItems,
        async (total, cartItem) => {
          const storeItem = await fetchProduct(cartItem.id).catch(() => total);

          return total + (storeItem?.price ?? 0) * cartItem.quantity;
        },
        0
      );

      setSubTotal(subTotal);
    })();
  }, [cartItems]);

  // filter out cartItems which item is no more in server for checkout
  useEffect(() => {
    (async () => {
      const checkoutItems = await asyncFilter(cartItems, async (cartItem) => {
        const storeItem = await fetchProduct(cartItem.id).catch(() => null);

        if (storeItem) {
          return {
            id: cartItem.id,
            quantity: cartItem.quantity,
            name: storeItem.name,
            price: storeItem.price,
            image: storeItem.image,
          };
        }
        return null;
      });

      setCheckoutItems(checkoutItems);
    })();
  }, [cartItems]);

  const clearCartItems = () => {
    dispatch(cartSlice.actions.clearCartItems());
  };

  const checkoutHandler = () => {
    navigate("/shipping", { state: checkoutItems });
  };

  return (
    <section id={styles["cart-page"]}>
      <Container>
        <div className={styles.cart}>
          <div className={styles.cart_detailes}>
            <Heading>Shoping cart</Heading>

            {cartItems.length === 0 && (
              <Message>
                Your cart is empty!{" "}
                <Link className={styles["back-btn"]} to="/">
                  &#8592;back to homepage
                </Link>
              </Message>
            )}

            <ul>
              {cartItems.length > 0 &&
                cartItems.map((cartItem) => (
                  <CartItem key={cartItem.id} cartItem={cartItem} />
                ))}
            </ul>

            {cartItems.length > 0 && (
              <button onClick={clearCartItems} className={styles["clear-btn"]}>
                clear cart
              </button>
            )}
          </div>

          <div className={styles.cart_action}>
            <div className={styles.checkout}>
              <h3>total price</h3>

              <h1>{formatCurrency(subTotal, "USD")}</h1>
            </div>

            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              className={styles.checkout_btn}
            >
              Checkout
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CartPage;
