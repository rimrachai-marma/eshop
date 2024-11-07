import apiSlice from "../apiSlice";

const GETPOST = "getPost";

const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get profile
    getProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["PROFILE"],
    }),

    // update profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["USERS"], // PROFILE
    }),

    // admin
    // get all users with filtering
    getUsers: builder.query({
      query: (params) => ({
        url: "/admin/users",
        params,
      }),
      providesTags: ["USERS"],
    }),

    // admin
    // get user by id
    getUser: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: ["USER"],
    }),

    // only superadmin
    // update user by id
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/superadmin/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["USERS"], // USER
    }),

    // admin
    // delte user by id
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      // invalidatesTags: ["USERS"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useGetUsersQuery, useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation } =
  usersApiSlice;

export default usersApiSlice;
