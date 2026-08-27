import { useEffect, useState } from "react";
import { Search, AlertCircle, Inbox } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
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
import { Pill } from "../../../components/Dashboard/Admin/Pill";
import { formatCHF } from "../../../lib/format";
import { useI18n } from "../../../lib/i18n";
import { Input } from "../../../components/ui/input";
import { useGetAllBookingsQuery } from "@/redux/api/websiteApi";
import { useDebouncedValue } from "../../../lib/useDebouncedValue";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "provider_completed"
  | "completed"
  | "rejected"
  | "cancelled"
  | "expired"
  | "disputed";

const STATUS_OPTIONS: BookingStatus[] = [
  "pending",
  "confirmed",
  "in_progress",
  "provider_completed",
  "completed",
  "rejected",
  "cancelled",
  "expired",
  "disputed",
];


function statusLabel(status?: string) {
  if (!status) return "-";
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AdminBookingsPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | BookingStatus>("all");
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, status]);

  const {
    data: res,
    isFetching,
    isLoading,
    isError,
  } = useGetAllBookingsQuery({
    page,
    limit: 10,
    sort: "-bookingDate",
    ...(status !== "all" ? { status } : {}),
    ...(debouncedQuery.trim() ? { searchTerm: debouncedQuery.trim() } : {}),
  });

  const bookings = res?.data ?? [];
  const meta = res?.meta;
  const showSkeleton = isLoading || (isFetching && bookings.length === 0);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-serif text-3xl font-medium">
        {t("admin.bookings.title")}
      </h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("admin.common.searchByNameEmail")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as typeof status)}
        >
          <SelectTrigger className="w-48 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.common.allStatus")}</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead>{t("admin.bookings.bookingId")}</TableHead>
                <TableHead>{t("admin.common.family")}</TableHead>
                <TableHead>{t("admin.common.provider")}</TableHead>
                <TableHead>{t("admin.common.service")}</TableHead>
                <TableHead>{t("admin.common.dateTime")}</TableHead>
                <TableHead>{t("admin.common.status")}</TableHead>
                <TableHead>{t("admin.common.amount")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showSkeleton ? (
                Array.from({ length: 8 }).map((_, i) => (
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
                        "Failed to load bookings."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-5 w-5" />
                      {t("admin.common.noData") ?? "No bookings found."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((b) => (
                  <TableRow key={b?._id} className="hover:bg-muted-bg">
                    <TableCell className="font-medium">
                      {b?.bookingReference ?? "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          name={b?.customer?.fullName ?? ""}
                          size={28}
                        />
                        <span className="text-sm">
                          {b?.customer?.fullName ?? "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          name={b?.serviceProvider?.fullName ?? ""}
                          size={28}
                        />
                        <span className="text-sm">
                          {b?.serviceProvider?.fullName ?? "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      className="max-w-[220px] truncate text-sm"
                      title={b?.whatToExpect ?? ""}
                    >
                      {b?.whatToExpect || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(b?.bookingDate)}
                      {b?.timeSlot?.startTime && b?.timeSlot?.endTime
                        ? ` · ${b.timeSlot.startTime}-${b.timeSlot.endTime}`
                        : ""}
                    </TableCell>
                    <TableCell>
                      <Pill value={statusLabel(b?.status)} />
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {formatCHF(b?.paymentAmount ?? 0)}
                    </TableCell>
                  </TableRow>
                ))
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
