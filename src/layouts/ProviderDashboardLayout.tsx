import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar";
import { AppHeader } from "../components/Dashboard/AppHeader";
import { useI18n } from "../lib/i18n";
import { ProviderSidebar } from "../components/Dashboard/ProviderSidebar";

function titleKeyForPath(path: string): string {
  if (path.match(/\/dashboard\/provider\/bookings\/[^/]+/))
    return "details.bookingHeading";
  if (path.startsWith("/dashboard/provider/bookings")) return "nav.bookings";
  if (path.startsWith("/dashboard/provider/calendar")) return "nav.calendar";
  if (path.startsWith("/dashboard/provider/message")) return "nav.message";
  if (path.startsWith("/dashboard/provider/earnings")) return "nav.earnings";
  if (path.startsWith("/dashboard/provider/reviews")) return "nav.reviews";
  if (path.startsWith("/dashboard/provider/help")) return "nav.helpSupport";
  if (path.startsWith("/dashboard/provider/settings"))
    return "nav.profileSettings";
  return "nav.overview";
}

const ProviderDashboardLayout = () => {
  const { t } = useI18n();
const { pathname } = useLocation();

  return (
    <SidebarProvider>
      <ProviderSidebar />
      <SidebarInset>
        <AppHeader title={t(titleKeyForPath(pathname))} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProviderDashboardLayout;
