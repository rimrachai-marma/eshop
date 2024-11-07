// unuse file

import axios from "axios";

import productsSlice from "../productsSlice";

const fetchProducts = (
  pageNumber,
  keyword,
  category,
  brands,
  in_stock,
  rating,
  priceAt,
  sort
) => {
  let query = "";

  if (pageNumber) {
    if (query === "") {
      query += `?page=${pageNumber}`;
    } else {
      query += `&page=${pageNumber}`;
    }
  }

  if (keyword) {
    if (query === "") {
      query += `?keyword=${keyword}`;
    } else {
      query += `&keyword=${keyword}`;
    }
  }

  if (category) {
    if (query === "") {
      query += `?category=${category}`;
    } else {
      query += `&category=${category}`;
    }
  }

  if (brands) {
    if (query === "") {
      query += `?brands=${brands}`;
    } else {
      query += `&brands=${brands}`;
    }
  }

  if (in_stock) {
    if (query === "") {
      query += `?in_stock=${in_stock}`;
    } else {
      query += `&in_stock=${in_stock}`;
    }
  }

  if (rating) {
    if (query === "") {
      query += `?rating=${rating}`;
    } else {
      query += `&rating=${rating}`;
    }
  }

  if (priceAt) {
    if (query === "") {
      query += `?priceAt=${priceAt}`;
    } else {
      query += `&priceAt=${priceAt}`;
    }
  }

  if (sort) {
    if (query === "") {
      query += `?sort=${sort}`;
    } else {
      query += `&sort=${sort}`;
    }
  }

  return async (dispatch, getState) => {
    dispatch(productsSlice.actions.fetchPending());

    try {
      const res = await axios.get(`/api/products${query}`);

      dispatch(productsSlice.actions.fetchSuccess(res.data));
    } catch (error) {
      dispatch(
        productsSlice.actions.fetchFailed(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        )
      );
    }
  };
};

export default fetchProducts;
