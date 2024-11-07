import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("_cart_items_")
    ? JSON.parse(localStorage.getItem("_cart_items_"))
    : [],
};

// create slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addOrIncreamentCartItem(state, action) {
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.id === action.payload.id
      );

      if (!existingItem) {
        state.cartItems = [
          ...state.cartItems,
          { id: action.payload.id, quantity: action.payload.quantity },
        ];
      } else {
        existingItem.quantity = existingItem.quantity + action.payload.quantity;
      }

      localStorage.setItem("_cart_items_", JSON.stringify(state.cartItems));
    },

    removeOrDecreamentCartItem(state, action) {
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.id === action.payload.id
      );

      if (existingItem) {
        if (existingItem && existingItem.quantity <= action.payload.quantity) {
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem.id !== action.payload.id
          );
        } else {
          existingItem.quantity =
            existingItem.quantity - action.payload.quantity;
        }
      }

      localStorage.setItem("_cart_items_", JSON.stringify(state.cartItems));
    },

    removeCartItem(state, action) {
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      );

      localStorage.setItem("_cart_items_", JSON.stringify(state.cartItems));
    },

    clearCartItems(state) {
      state.cartItems = [];

      localStorage.setItem("_cart_items_", JSON.stringify(state.cartItems));
    },
  },
});

export default cartSlice;
