import { useState } from "react";
import {
  AlertCircle,
  Inbox,
  Wallet,
  TrendingUp,
  Clock,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { formatCHF } from "../../../lib/format";
import { useI18n } from "../../../lib/i18n";
import { useGetAllEarningsQuery } from "@/redux/api/websiteApi";



function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {/* <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-primary">
          <Icon className="h-3.5 w-3.5" />
        </span> */}
      </div>
      <p className="mt-3 font-serif text-2xl font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

export function AdminEarningsPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);

  const {
    data: res,
    isFetching,
    isLoading,
    isError,
  } = useGetAllEarningsQuery({ page, limit: 10});

  const summary = res?.data?.summary;
  const history = res?.data?.history ?? [];
  const meta = res?.meta;
  const showSkeleton = isLoading || (isFetching && history.length === 0);

  const summaryCards = [
    {
      label: t("admin.earnings.totalRevenue") ?? "Total revenue",
      value: formatCHF(summary?.totalRevenue ?? 0),
      icon: Wallet,
    },
    {
      label: t("admin.earnings.totalCommission"),
      value: formatCHF(summary?.totalCommission ?? 0),
      icon: TrendingUp,
    },
    {
      label: t("admin.earnings.providerEarnings") ?? "Provider earnings",
      value: formatCHF(summary?.totalProviderEarning ?? 0),
      icon: CheckCircle2,
    },
    {
      label: t("admin.earnings.pending") ?? "Pending earnings",
      value: formatCHF(summary?.pendingEarnings ?? 0),
      icon: Clock,
    },
    {
      label: t("admin.earnings.thisMonth") ?? "This month",
      value: formatCHF(summary?.thisMonthRevenue ?? 0),
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <h2 className="font-serif text-3xl font-medium">
          {t("admin.earnings.title")}
        </h2>
        {!isLoading && !isError && (
          <div className="text-right text-sm text-muted-foreground">
            {summary?.completedBookings ?? 0} / {summary?.totalBookings ?? 0}{" "}
            {t("admin.earnings.completedOfTotal") ?? "completed bookings"}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-7 rounded-full" />
              </div>
              <Skeleton className="mt-3 h-7 w-20" />
            </div>
          ))
        ) : isError ? (
          <div className="col-span-2 flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive lg:col-span-5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {t("admin.common.failedToLoad") ??
              "Failed to load earnings summary."}
          </div>
        ) : (
          summaryCards.map((card) => (
            <SummaryCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={card.icon}
            />
          ))
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead>{t("admin.earnings.bookingId")}</TableHead>
                <TableHead>{t("admin.common.provider")}</TableHead>
                <TableHead>{t("admin.common.family")}</TableHead>
                <TableHead>{t("admin.earnings.gross")}</TableHead>
                <TableHead>{t("admin.earnings.commissionPct")}</TableHead>
                <TableHead>{t("admin.earnings.commission")}</TableHead>
                <TableHead>
                  {t("admin.earnings.providerEarning") ?? "Provider earning"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showSkeleton ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-destructive"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      {t("admin.common.failedToLoad") ??
                        "Failed to load earnings history."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-5 w-5" />
                      {t("admin.common.noData") ?? "No earnings recorded yet."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                history.map((e) => {
                  const gross = e?.paymentAmount ?? 0;
                  const commission = e?.commissionAmount ?? 0;
                  const commissionPct =
                    gross > 0 ? (commission / gross) * 100 : 0;

                  return (
                    <TableRow key={e?._id} className="hover:bg-muted-bg">
                      <TableCell className="font-medium">
                        {e?.bookingReference ?? "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            name={e?.serviceProvider?.fullName ?? ""}
                            size={28}
                          />
                          <span className="text-sm">
                            {e?.serviceProvider?.fullName ?? "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            name={e?.customer?.fullName ?? ""}
                            size={28}
                          />
                          <span className="text-sm">
                            {e?.customer?.fullName ?? "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatCHF(gross)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {commissionPct.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatCHF(commission)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatCHF(e?.providerEarning ?? 0)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {!isError && (meta?.totalPage ?? 0) > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
            <span>
              {t("admin.common.page") ?? "Page"} {meta?.page ?? page} /{" "}
              {meta?.totalPage ?? 1}
              {" · "}
              {meta?.total ?? 0} {t("admin.common.total") ?? "total"}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={(meta?.page ?? page) <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {t("admin.common.previous") ?? "Previous"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={
                  (meta?.page ?? page) >= (meta?.totalPage ?? 1) || isFetching
                }
                onClick={() => setPage((p) => p + 1)}
              >
                {t("admin.common.next") ?? "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
