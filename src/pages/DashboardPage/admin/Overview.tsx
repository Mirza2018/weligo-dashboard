import {
  Users,
  Briefcase,
  CalendarCheck,
  Wallet,
  UserPlus,
} from "lucide-react";
import { Star, MoreHorizontal, AlertCircle, Inbox } from "lucide-react";
import { Eye, Ban, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "../../../lib/i18n";
import { StatCard } from "../../../components/Dashboard/Admin/StatCard";
import {
  BookingsChart,
  EarningsChart,
} from "../../../components/Dashboard/Admin/AdminCharts";
import { SectionCard } from "../../../components/common/SectionCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Skeleton } from "../../../components/ui/skeleton";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { formatCHF } from "../../../lib/format";
import { Pill } from "../../../components/Dashboard/Admin/Pill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { UserDetailsDialog } from "../../../components/Dashboard/Admin/UserDetailsDialog";
import { ConfirmDialog } from "../../../components/Dashboard/Admin/ConfirmDialog";
import {
  useGetOverviewQuery,
  useGetTopProvidersQuery,
  useUserBlockUnBlockMutation,
} from "@/redux/api/websiteApi";

type SelectedProvider = {
  id: string;
  name: string;
  email: string;
  phone: string;
  completed: number;
  earnings: number;
};

export function AdminOverviewPage() {
  const { t } = useI18n();

  const {
    data: overviewRes,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
  } = useGetOverviewQuery();

  const {
    data: topProvidersRes,
    isLoading: isProvidersLoading,
    isError: isProvidersError,
  } = useGetTopProvidersQuery({ limit: 10, page: 1 });
  const [blockUnblock, { isLoading: isToggling }] =
    useUserBlockUnBlockMutation();

  const [viewing, setViewing] = useState<SelectedProvider | null>(null);
  const [confirming, setConfirming] = useState<SelectedProvider | null>(null);
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set());

  const overview = overviewRes?.data;
  const providers = topProvidersRes?.data ?? [];

  const toggleStatus = (id?: string) => {
    if (!id) return;
    setSuspendedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const statCards = [
    {
      label: t("admin.overview.totalFamilies"),
      value: overview?.totalFamilies,
      icon: Users,
      currency: false,
    },
    {
      label: t("admin.overview.totalProviders"),
      value: overview?.totalProviders,
      icon: Briefcase,
      currency: false,
    },
    {
      label: t("admin.overview.activeBookings"),
      value: overview?.totalActiveBookings,
      icon: CalendarCheck,
      currency: false,
    },
    {
      label: t("admin.overview.monthRevenue"),
      value: overview?.totalRevenue,
      icon: Wallet,
      currency: true,
    },
    {
      label: t("admin.overview.pendingApprovals"),
      value: overview?.totalPendingProviderApprovals,
      icon: UserPlus,
      currency: false,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-serif text-3xl font-medium">
        {t("admin.overview.title")}
      </h2>

      {/* Stat cards: skeleton / error / data */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {isOverviewLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-7 rounded-full" />
              </div>
              <Skeleton className="mt-3 h-8 w-16" />
            </div>
          ))
        ) : isOverviewError ? (
          <div className="col-span-2 flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive lg:col-span-5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {t("admin.common.failedToLoad") ?? "Failed to load overview stats."}
          </div>
        ) : (
          statCards.map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={
                card.currency
                  ? formatCHF(card.value ?? 0)
                  : String(card.value ?? 0)
              }
              icon={card.icon}
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BookingsChart />
        <EarningsChart />
      </div>

      <SectionCard title={t("admin.overview.topProviders")}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead>{t("admin.common.provider")}</TableHead>
                <TableHead>{t("admin.common.email")}</TableHead>
                <TableHead>{t("admin.common.services")}</TableHead>
                <TableHead>{t("admin.common.city")}</TableHead>
                <TableHead>{t("admin.common.bookings")}</TableHead>
                <TableHead>{t("admin.common.earnings")}</TableHead>
                <TableHead>{t("admin.common.rating")}</TableHead>
                <TableHead>{t("admin.common.status")}</TableHead>
                <TableHead className="text-right">
                  {t("admin.common.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isProvidersLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={9}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isProvidersError ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-10 text-center text-sm text-destructive"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      {t("admin.common.failedToLoad") ??
                        "Failed to load top providers."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : providers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-5 w-5" />
                      {t("admin.common.noData") ?? "No providers found."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                providers.map((p) => {
                  const id = p?._id ?? "";
                  const isSuspended =
                    suspendedIds.has(id) || p?.status === "inactive";
                  const selected: SelectedProvider = {
                    id,
                    name: p?.fullName ?? "-",
                    email: p?.email ?? "-",
                    phone: p?.phone ?? "-",
                    completed: p?.totalReview ?? 0,
                    earnings: p?.hourlyRate ?? 0,
                  };

                  return (
                    <TableRow
                      key={id || p?.email}
                      className="hover:bg-muted-bg"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserAvatar name={p?.fullName ?? ""} size={32} />
                          <span className="font-medium text-foreground">
                            {p?.fullName ?? "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p?.email ?? "-"}
                      </TableCell>
                      <TableCell>
                        {p?.categoryId?.name ? (
                          <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                            {p.categoryId.name}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {p?.city ?? "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {p?.totalReview ?? 0}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatCHF(p?.hourlyRate ?? 0)}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {(p?.averageRating ?? 0).toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Pill value={isSuspended ? "Suspended" : "Active"} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="rounded-md p-1.5 hover:bg-secondary">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setViewing(selected)}
                            >
                              <Eye className="mr-2 h-4 w-4" />{" "}
                              {t("admin.common.viewDetails")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setConfirming(selected)}
                            >
                              {isSuspended ? (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />{" "}
                                  {t("admin.common.activate")}
                                </>
                              ) : (
                                <>
                                  <Ban className="mr-2 h-4 w-4" />{" "}
                                  {t("admin.common.suspend")}
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <UserDetailsDialog
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        user={
          viewing && {
            name: viewing.name,
            email: viewing.email,
            phone: viewing.phone,
            completed: viewing.completed,
            earnings: viewing.earnings,
          }
        }
      />
      <ConfirmDialog
        open={!!confirming}
        onOpenChange={(o) => !o && setConfirming(null)}
        confirmLabel={t("admin.common.yes")}
        cancelLabel={t("admin.common.no")}
        title={
          suspendedIds.has(confirming?.id ?? "")
            ? t("admin.dialog.confirmActivateProvider")
            : t("admin.dialog.confirmSuspendProvider")
        }
        // onConfirm={() => {
        //   if (!confirming?.id) return;
        //   const wasSuspended = suspendedIds.has(confirming.id);
        //   toggleStatus(confirming.id);
        //   toast.success(
        //     wasSuspended
        //       ? t("admin.dialog.providerActivated")
        //       : t("admin.dialog.providerSuspended"),
        //   );
        //   setConfirming(null);
        // }}
        onConfirm={async () => {
          if (!confirming?.id) return;
          try {
            await blockUnblock(confirming.id).unwrap();
            toast.success(
              t("admin.dialog.providerStatusUpdated") ??
                "Provider status updated.",
            );
          } catch {
            toast.error(
              t("admin.common.somethingWentWrong") ??
                "Couldn't update status. Try again.",
            );
          } finally {
            setConfirming(null);
          }
        }}
      />
    </div>
  );
}
