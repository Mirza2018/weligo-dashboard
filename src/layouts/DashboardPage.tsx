import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { useI18n } from "../lib/i18n";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "../components/Dashboard/AppSidebar";
import { AppHeader } from "../components/Dashboard/AppHeader";

function titleKeyForPath(path: string): string {
  if (path.startsWith("/dashboard/family/bookings")) return "nav.bookings";
  if (path.startsWith("/dashboard/family/message")) return "nav.message";
  if (path.startsWith("/dashboard/family/favorites")) return "nav.favorites";
  if (path.startsWith("/dashboard/family/transactions")) return "nav.transactions";
  if (path.startsWith("/dashboard/family/reviews")) return "nav.reviews";
  if (path.startsWith("/dashboard/family/help")) return "nav.helpSupport";
  if (path.startsWith("/dashboard/family/settings")) return "nav.profileSettings";
  return "nav.overview";
}

export function DashboardLayout() {
  const { t } = useI18n();
const { pathname } = useLocation();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={t(titleKeyForPath(pathname))} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
