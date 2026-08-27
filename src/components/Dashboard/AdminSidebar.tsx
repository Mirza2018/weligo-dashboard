import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Briefcase,
  UserPlus,
  CalendarCheck,
  Receipt,
  Layers,
  LifeBuoy,
  MessageSquare,
  Wallet,
  Settings,
  type LucideIcon,
  LogOut,
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
import AllImages from "../../assets/AllImages";
import { clearAuth } from "@/redux/slices/authSlice";
import { getImageUrl } from "@/redux/getBaseUrl";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

type NavItem = { labelKey: string; to: string; icon: LucideIcon };

const items: NavItem[] = [
  {
    labelKey: "admin.nav.overview",
    to: "/dashboard/admin/overview",
    icon: LayoutGrid,
  },
  {
    labelKey: "admin.nav.families",
    to: "/dashboard/admin/families",
    icon: Users,
  },
  {
    labelKey: "admin.nav.allProviders",
    to: "/dashboard/admin/providers/all",
    icon: Briefcase,
  },
  {
    labelKey: "admin.nav.pendingProviders",
    to: "/dashboard/admin/providers/pendings",
    icon: UserPlus,
  },
  {
    labelKey: "admin.nav.bookings",
    to: "/dashboard/admin/bookings",
    icon: CalendarCheck,
  },
  {
    labelKey: "admin.nav.transactions",
    to: "/dashboard/admin/transactions",
    icon: Receipt,
  },
  {
    labelKey: "admin.nav.categories",
    to: "/dashboard/admin/categories",
    icon: Layers,
  },
  {
    labelKey: "admin.nav.support",
    to: "/dashboard/admin/support",
    icon: LifeBuoy,
  },
  {
    labelKey: "admin.nav.messages",
    to: "/dashboard/admin/messages",
    icon: MessageSquare,
  },
  {
    labelKey: "admin.nav.earnings",
    to: "/dashboard/admin/earnings",
    icon: Wallet,
  },
  {
    labelKey: "admin.nav.profile",
    to: "/dashboard/admin/profile",
    icon: Settings,
  },
];
 
export function AdminSidebar() {
  const { t } = useI18n();
  const location = useLocation();
  const pathname = location.pathname;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const fullName =
    userInfo?.fullName ||
    `${userInfo?.firstName ?? ""} ${userInfo?.lastName ?? ""}`.trim() ||
    "User";

  const avatarSrc =
    userInfo?.profileImage && userInfo.profileImage.trim() !== ""
      ? getImageUrl(userInfo.profileImage)
      : undefined;

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/sign-in");
  };
 
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/dashboard/admin/overview" className="h-16">
          <img src={AllImages.logo} alt="" className="h-12.5" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {items.map((item) => {
            const active = pathname.startsWith(item.to);
            const Icon = item.icon;
            const label = t(item.labelKey);
            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={label}
                  className="h-10 !bg-transparent hover:!bg-[var(--sidebar-accent)] hover:!text-[var(--sidebar-accent-foreground)] data-[active=true]:!bg-[var(--sidebar-accent)] data-[active=true]:!text-[var(--sidebar-accent-foreground)]"
                >
                  <Link to={item.to}>
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-xl bg-card p-2">
          <UserAvatar name={fullName} src={avatarSrc} size={36} />
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-foreground">
              {fullName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {userInfo?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
