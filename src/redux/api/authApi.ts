import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";


interface Response {
  data: any | void;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (body) => ({
        url: `/auth/login`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    myProfile: build.query<Response, void>({
      query: () => ({
        url: `/users/my-profile`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    updateProfile: build.mutation({
      query: (body) => ({
        url: `/users/update-my-profile`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    updatePassword: build.mutation({
      query: (body) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    //End
  }),
});

export const { useUserLoginMutation, useMyProfileQuery, useUpdateProfileMutation, useUpdatePasswordMutation } = authApi;



