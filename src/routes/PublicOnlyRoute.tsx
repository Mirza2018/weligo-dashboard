import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/redux/store";

export function PublicOnlyRoute() {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  if (accessToken) {
    return <Navigate to="/dashboard/admin/overview" replace />;
  }

  return <Outlet />;
}
