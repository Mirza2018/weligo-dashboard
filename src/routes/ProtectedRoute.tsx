import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "@/redux/store";

export function ProtectedRoute() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
