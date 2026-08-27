import { createBrowserRouter, Navigate } from "react-router-dom";

import { AdminDashboardLayout } from "../layouts/AdminDashboardPage";
import { SignIn } from "../pages/auth/sign-in";
import { AdminBookingsPage } from "../pages/DashboardPage/admin/Bookings";
import { AdminCategoriesPage } from "../pages/DashboardPage/admin/Categories";
import { AdminEarningsPage } from "../pages/DashboardPage/admin/Earnings";
import { AdminFamiliesPage } from "../pages/DashboardPage/admin/Families";
import { AdminMessagesPage } from "../pages/DashboardPage/admin/Messages";
import { AdminOverviewPage } from "../pages/DashboardPage/admin/Overview";
import { AdminProfilePage } from "../pages/DashboardPage/admin/Profile";
import { AdminProvidersAllPage } from "../pages/DashboardPage/admin/ProvidersAll";
import { AdminProvidersPendingPage } from "../pages/DashboardPage/admin/ProvidersPending";
import { AdminSupportPage } from "../pages/DashboardPage/admin/Support";
import { AdminTransactionsPage } from "../pages/DashboardPage/admin/Transactions";
import { MessagePage } from "@/pages/DashboardPage/admin/MessagePage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard/admin/overview" />,
  },

  {
    path: "/dashboard/admin",
    element: <AdminDashboardLayout />,
    children: [
      {
        path: "overview",
        element: <AdminOverviewPage />,
      },
      {
        path: "families",
        element: <AdminFamiliesPage />,
      },
      {
        path: "providers/all",
        element: <AdminProvidersAllPage />,
      },
      {
        path: "providers/pendings",
        element: <AdminProvidersPendingPage />,
      },
      {
        path: "bookings",
        element: <AdminBookingsPage />,
      },
      {
        path: "transactions",
        element: <AdminTransactionsPage />,
      },
      {
        path: "categories",
        element: <AdminCategoriesPage />,
      },
      {
        path: "support",
        element: <AdminSupportPage />,
      },
      {
        path: "messages",
        element: <MessagePage />,
      },
      {
        path: "earnings",
        element: <AdminEarningsPage />,
      },
      {
        path: "profile",
        element: <AdminProfilePage />,
      },
    ],
  },

  {
    path: "/sign-in",
    element: <SignIn />,
  },
  // {
  //   path: "/sign-up",
  //   element: <SignUp />,
  // },
  {
    path: "*",
    element: <Navigate to="/dashboard/admin/overview" />,
  },
]);
export default router;
