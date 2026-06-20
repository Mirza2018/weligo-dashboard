import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

// interface Filter {
//   page?: number;
//   limit?: number;
//   search?: string;
// }
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
    userRegister: build.mutation({
      query: (body) => ({
        url: `/users/register`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    userVerifyOTP: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/verify-otp`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    userResendVerifyOTP: build.mutation<Response, any>({
      query: () => ({
        url: `/auth/resend-otp`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.user],
    }),

    userForgotPassword: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/forget-password`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    userResetPassword: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    userGetProfile: build.query<Response, any>({
      query: (params) => ({
        url: `/auth/my-profile`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.user],
    }),
    userUpdateProfile: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/update-profile`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    userChangePassword: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    ///Contact
    addContact: build.mutation<Response, any>({
      query: (body) => ({
        url: `/contact`,
        method: "POST",
        body,
      }),
      // invalidatesTags: [tagTypes.user],
    }),

    //End
  }),
});

export const {
  useUserLoginMutation,
  useUserRegisterMutation,
  useUserVerifyOTPMutation,
  useUserResendVerifyOTPMutation,
  useUserForgotPasswordMutation,
  useUserResetPasswordMutation,
  useUserGetProfileQuery,
  useUserUpdateProfileMutation,
  useUserChangePasswordMutation,
  useAddContactMutation,
} = authApi;
