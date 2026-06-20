import { Link, useLocation } from "react-router-dom";

import {
  LayoutGrid,
  CalendarCheck,
  CalendarDays,
  MessageSquare,
  Wallet,
  Star,
  LifeBuoy,
  Settings,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { useI18n } from "../../lib/i18n";
import { UserAvatar } from "../common/UserAvatar";

type NavItem = { key: string; to: string; icon: LucideIcon };

const items: NavItem[] = [
  { key: "overview", to: "/dashboard/provider/overview", icon: LayoutGrid },
  { key: "bookings", to: "/dashboard/provider/bookings", icon: CalendarCheck },
  { key: "calendar", to: "/dashboard/provider/calendar", icon: CalendarDays },
  { key: "message", to: "/dashboard/provider/message", icon: MessageSquare },
  { key: "earnings", to: "/dashboard/provider/earnings", icon: Wallet },
  { key: "reviews", to: "/dashboard/provider/reviews", icon: Star },
  { key: "helpSupport", to: "/dashboard/provider/help", icon: LifeBuoy },
  {
    key: "profileSettings",
    to: "/dashboard/provider/settings",
    icon: Settings,
  },
];

export function ProviderSidebar() {
  const { t } = useI18n();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          to="/dashboard/provider/overview"
          className="flex items-center gap-2 px-2 py-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <span className="font-serif text-lg font-semibold">W</span>
          </div>
          <span className="font-serif text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            Weligo
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {items.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={t(`navbar.${item.key}`)}
                  className="h-10"
                >
                  <Link to={item.to}>
                    <Icon className="h-4 w-4" />
                    <span>{t(`navbar.${item.key}`)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-xl bg-card p-2">
          <UserAvatar name="Simon Keller" size={36} />
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-foreground">
              Simon Keller
            </p>
            <p className="truncate text-xs text-muted-foreground">
              simonkeller0@example.com
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
