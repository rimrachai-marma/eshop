import apiSlice from "../apiSlice";

const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get parent category
    getParentCategories: builder.query({
      query: () => "/parent-categories",
      providesTags: ["PARENT-CATEGORIES"],
    }),

    // get categories
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["CATEGORIES"],
    }),

    // get category tree
    getCategorytree: builder.query({
      query: () => "/category-tree",
      providesTags: ["CATEGORY-TREE"],
    }),

    // get categories-brands
    getCategoriesBrands: builder.query({
      query: () => "/categories-brands",
      providesTags: ["CATEGORIES-BRANDS"],
    }),

    // get single category
    getCategory: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: ["CATEGORY"],
    }),

    // get category brands
    getCategoryBrands: builder.query({
      query: (category) => `/categories/${category}/brands`,
      providesTags: ["CATEGORY-BRANDS"],
    }),

    // Create category
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/admin/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CATEGORIES", "PARENT-CATEGORIES", "CATEGORY-TREE", "CATEGORIES-BRANDS", "CATEGORY-BRANDS"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CATEGORIES", "PARENT-CATEGORIES", "CATEGORY-TREE", "CATEGORIES-BRANDS", "CATEGORY-BRANDS"], // "CATEGORY"
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PARENT-CATEGORIES", "CATEGORY-TREE", "CATEGORIES-BRANDS", "CATEGORY-BRANDS"], // "CATEGORIES"
    }),
  }),
});

export const {
  useGetParentCategoriesQuery,
  useGetCategoriesQuery,
  useGetCategorytreeQuery,
  useGetCategoryQuery,
  useGetCategoryBrandsQuery,
  useGetCategoriesBrandsQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;

export default categoryApiSlice;
