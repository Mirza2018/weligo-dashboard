import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar";
// import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { AppHeader } from "../components/Dashboard/AppHeader";
import { useI18n } from "../lib/i18n";
import { AdminSidebar } from "../components/Dashboard/AdminSidebar";
function keyForPath(path: string) {
  if (path.includes("/admin/overview")) return "admin.nav.overview";
  if (path.includes("/admin/families")) return "admin.nav.families";
  if (path.includes("/admin/providers/all")) return "admin.nav.allProviders";
  if (path.includes("/admin/providers/pendings"))
    return "admin.nav.pendingProviders";
  if (path.includes("/admin/bookings")) return "admin.nav.bookings";
  if (path.includes("/admin/transactions")) return "admin.nav.transactions";
  if (path.includes("/admin/categories")) return "admin.nav.categories";
  if (path.includes("/admin/support")) return "admin.nav.support";
  if (path.includes("/admin/messages")) return "admin.nav.messages";
  if (path.includes("/admin/earnings")) return "admin.nav.earnings";
  if (path.includes("/admin/profile")) return "admin.nav.profile";
  return "admin.nav.admin";
}

export function AdminDashboardLayout() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AppHeader title={t(keyForPath(pathname))} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
