import { configureStore } from "@reduxjs/toolkit";

import apiSlice from "./apiSlice";
import authSlice from "./auth/authSlice";
import cartSlice from "./cart/cartSlice";
import shippingAddressSlice from "./shipping-address/shippingAddressSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    shippingAddress: shippingAddressSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  preloadedState: {
    // auth: {
    //   userInfo: localStorage.getItem("userInfo")
    //     ? JSON.parse(localStorage.getItem("userInfo"))
    //     : null,
    // },
  },
});

export default store;
