// src/redux/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../getBaseUrl";
import type { RootState } from "../store";
import { tagTypesList } from "../tagTypes";

const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    const signUpToken = state.auth.signUpToken;
    // const resendSignUpToken = state.auth.resendSignUpToken;
    // const forgotPassToken = state.auth.forgotPasswordToken;
    // const resendForgotPasswordToken = state.auth.resendForgotPasswordToken;
    const resetPasswordToken = state.auth.resetPasswordToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    // if (forgotPassToken) {
    //   headers.set("signUpToken", `signUpToken ${forgotPassToken}`);
    // }
    // if (resendForgotPasswordToken) {
    //   headers.set("signUpToken", `signUpToken ${resendForgotPasswordToken}`);
    // }
    if (signUpToken) {
      headers.set("authorization", `Bearer ${signUpToken}`);
    }
    // if (resendSignUpToken) {
    //   headers.set("authorization", `Bearer ${resendSignUpToken}`);
    // }

    if (resetPasswordToken) {
      headers.set("Forget-password", `Forget-password ${resetPasswordToken}`);
    }

    return headers;
  },
});


const baseQueryWithAutoLogout = async (
  args: any,
  api: any,
  extraOptions: any,
) => {
  const result = await baseQuery(args, api, extraOptions);

  // if (result?.error?.status === 404) {
  //   const cookies = new Cookies();

  //   // Clear Redux state
  //   api.dispatch(clearAuth());

  //   // Clear cookie
  //   cookies.remove("aura_website", { path: "/" });

  //   // Redirect to login
  //   if (typeof window !== "undefined") {
  //     window.location.replace("/"); // 👈 /login not /
  //   }
  // }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAutoLogout,
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
