import apiSlice from "../apiSlice";

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //get all order
    getUserOrders: builder.query({
      query: (params) => ({
        url: "/orders",
        params,
      }),
      providesTags: ["ORDERS"],
    }),

    // admin and owner
    // get order by id
    getOrder: builder.query({
      query: (id) => "/orders/" + id,
      providesTags: ["ORDER"],
    }),

    // admin
    // get all order
    getOrders: builder.query({
      query: (params) => ({
        url: "/admin/orders",
        params,
      }),
      providesTags: ["ORDERSLIST"],
    }),

    // admin
    // update order status
    updateOrderStatus: builder.mutation({
      query: ({ id, data: status }) => ({
        url: `/admin/orders/${id}/status/${status}`,
        method: "PATCH",
      }),
      invalidatesTags: ["ORDERSLIST"], // ORDER
    }),
  }),
});

export const { useGetOrderQuery, useGetUserOrdersQuery, useGetOrdersQuery, useUpdateOrderStatusMutation } = orderApiSlice;

export default orderApiSlice;
