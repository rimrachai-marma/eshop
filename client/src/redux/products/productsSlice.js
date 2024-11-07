// unuse file

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  page: 0,
  pages: 0,

  fetchPending: false,
  fetchError: null,

  createPending: false,
  createError: null,
  createSuccess: false,

  updatePending: false,
  updateError: null,
  updateSuccess: false,

  removePending: false,
  removeError: null,
};

// create slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchPending(state) {
      state.fetchPending = true;
      state.fetchError = null;
    },
    fetchSuccess(state, action) {
      state.fetchPending = false;
      state.fetchError = null;

      state.products = action.payload.products;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
    },
    fetchFailed(state, action) {
      state.fetchPending = false;
      state.fetchError = action.payload;

      state.products = [];
      state.page = 0;
      state.pages = 0;
    },
  },
});

export default productsSlice;
