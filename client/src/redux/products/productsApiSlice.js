import apiSlice from "../apiSlice";

const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //get all products with filtering
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["PRODUCTS"],
    }),

    // get single product by id
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["PRODUCT"],
    }),

    // get single store item(product) by id
    getStoreItem: builder.query({
      query: (id) => `/products/${id}`,
    }),

    // get product reviews
    getProductReviews: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["REVIEWS"],
    }),

    // Create review by id
    createReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["REVIEWS", "PRODUCT, PRODUCTS"],
    }),

    // admin
    // get all product list with filtering
    getProductList: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["PRODUCTLIST"],
    }),

    // Admin
    // Add product
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/admin/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PRODUCTLIST", "PRODUCTS"],
    }),

    // get single product by id
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["PRODUCTDETAILS"],
    }),

    // Admin
    // Update product
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PRODUCTLIST", "PRODUCTS", "PRODUCT"], // PRODUCTDETAILS
    }),

    // Admin
    // Add product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCTS"], // "PRODUCTLIST",
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetStoreItemQuery,
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useGetProductListQuery,
  useCreateProductMutation,
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;

export default productsApiSlice;
