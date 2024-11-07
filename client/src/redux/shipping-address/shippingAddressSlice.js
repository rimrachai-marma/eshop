import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shippingAddress: localStorage.getItem("_shipping-address_")
    ? JSON.parse(localStorage.getItem("_shipping-address_"))
    : {},
};

// create slice
const shippingAddressSlice = createSlice({
  name: "shipping-address",

  initialState,

  reducers: {
    setShippingAddress(state, action) {
      state.shippingAddress = action.payload;

      localStorage.setItem(
        "_shipping-address_",
        JSON.stringify(action.payload)
      );
    },
  },
});

export const { setShippingAddress } = shippingAddressSlice.actions;

export default shippingAddressSlice;
