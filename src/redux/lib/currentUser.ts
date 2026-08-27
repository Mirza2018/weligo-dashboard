import { useMemo } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import type { RootState } from "@/redux/store";

interface DecodedToken {
  fullName: string;
  email: string;
  phone?: string;
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const useCurrentUser = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  return useMemo<DecodedToken | null>(() => {
    if (!accessToken) return null;
    try {
      return jwtDecode<DecodedToken>(accessToken);
    } catch {
      return null;
    }
  }, [accessToken]);
};
