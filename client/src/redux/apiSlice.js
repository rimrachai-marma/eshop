import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  keepUnusedDataFor: 10,

  tagTypes: [],

  endpoints: (builder) => ({}),
});

export default apiSlice;
