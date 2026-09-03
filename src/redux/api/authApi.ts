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
    forgotPassword: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/forgot-password-otpByEmail`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    forgotPasswordOTP: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/forgot-password-otp-match`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    forgotPasswordReset: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/forgot-password-reset`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    userVerifyOTPResend: build.mutation<Response, any>({
      query: (body) => ({
        url: `/otp/resend-otp`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    //End
  }),
});

export const {
  useUserLoginMutation,
  useMyProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useForgotPasswordOTPMutation,
  useForgotPasswordResetMutation,
  useUserVerifyOTPResendMutation,
} = authApi;
