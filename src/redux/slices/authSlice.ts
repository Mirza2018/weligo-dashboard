// src/redux/slices/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  role: string;
  // Add other user fields as needed
}
interface PendingRegistration {
  token: string | null; // createUserToken from /users/create
  email: string | null;
}
const initialState = {
  accessToken: null as string | null,
  refreshToken: null as string | null,
  pendingRegistration: null as PendingRegistration | null,
  signUpToken: null as string | null,
  resendSignUpToken: null as string | null,
  forgotPasswordToken: null as string | null,
  resendForgotPasswordToken: null as string | null,
  resetPasswordToken: null as string | null,
  userInfo: null as UserInfo | null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setSignUpToken: (state, action: PayloadAction<string>) => {
      state.signUpToken = action.payload;
    },
    setPendingRegistration: (
      state,
      action: PayloadAction<{ token: string; email: string }>,
    ) => {
      state.pendingRegistration = action.payload;
    },
    clearPendingRegistration: (state) => {
      state.pendingRegistration = null;
    },

    setRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refreshToken = action.payload;
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userInfo = null;
      state.pendingRegistration = null;
    },
    setResendSignUpToken: (state, action: PayloadAction<string>) => {
      state.resendSignUpToken = action.payload;
    },
    setForgotPasswordToken: (state, action: PayloadAction<string>) => {
      state.forgotPasswordToken = action.payload;
    },
    setResendForgotPasswordToken: (state, action: PayloadAction<string>) => {
      state.resendForgotPasswordToken = action.payload;
    },
    setResetPasswordToken: (state, action: PayloadAction<string>) => {
      state.resetPasswordToken = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
    },
    clearSignUpToken: (state) => {
      state.signUpToken = null;
    },
    clearResendSignUpToken: (state) => {
      state.resendSignUpToken = null;
    },
    clearResetPasswordToken: (state) => {
      state.resetPasswordToken = null;
    },
    clearForgotPasswordToken: (state) => {
      state.forgotPasswordToken = null;
    },
    clearResendForgotPasswordToken: (state) => {
      state.resendForgotPasswordToken = null;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.userInfo = null;
      state.signUpToken = null;
      state.resendSignUpToken = null;
      state.forgotPasswordToken = null;
      state.resetPasswordToken = null;
    },
  },
});

export const {
  setAccessToken,
  clearAuth,
  setUserInfo,
  clearAccessToken,
  setSignUpToken,
  setForgotPasswordToken,
  setResendForgotPasswordToken,
  setResendSignUpToken,
  setResetPasswordToken,
  clearResetPasswordToken,
  clearSignUpToken,
  clearResendSignUpToken,
  clearResendForgotPasswordToken,
  clearForgotPasswordToken,
  setPendingRegistration,
  clearPendingRegistration,
  setRefreshToken,
  logout,

} = authSlice.actions;

export default authSlice.reducer;
