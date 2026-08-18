import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle2,
  Search,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { Input } from "../../../components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { Pill } from "../../../components/Dashboard/Admin/Pill";
import { UserDetailsDialog } from "../../../components/Dashboard/Admin/UserDetailsDialog";
import { ConfirmDialog } from "../../../components/Dashboard/Admin/ConfirmDialog";
import { formatCHF } from "../../../lib/format";
import { toast } from "sonner";
import { useI18n } from "../../../lib/i18n";
import {
  useGetAllFammiliesQuery,
  useUserBlockUnBlockMutation,
} from "@/redux/api/websiteApi";
import { useDebouncedValue } from "../../../lib/useDebouncedValue";

type StatusFilter = "all" | "active" | "block";
type SelectedFamily = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

const PAGE_LIMIT = 10;

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

export function AdminFamiliesPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<SelectedFamily | null>(null);
  const [confirming, setConfirming] = useState<SelectedFamily | null>(null);

  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, status]);

  const {
    data: res,
    isFetching,
    isLoading,
    isError,
  } = useGetAllFammiliesQuery({
    page,
    limit: PAGE_LIMIT,
    ...(status !== "all" ? { status } : {}),
    ...(debouncedQuery.trim() ? { searchTerm: debouncedQuery.trim() } : {}),
  });

  const [blockUnblock, { isLoading: isToggling }] =
    useUserBlockUnBlockMutation();

  const families = res?.data ?? [];
  const meta = res?.meta;
  const showSkeleton = isLoading || (isFetching && families.length === 0);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-serif text-3xl font-medium">
        {t("admin.nav.families")}
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
          onValueChange={(v) => setStatus(v as StatusFilter)}
        >
          <SelectTrigger className="w-40 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.common.allStatus")}</SelectItem>
            <SelectItem value="active">{t("admin.pill.Active")}</SelectItem>
            <SelectItem value="block">{t("admin.pill.Suspended")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead>{t("admin.common.family")}</TableHead>
                <TableHead>{t("admin.common.email")}</TableHead>
                <TableHead>{t("admin.common.city")}</TableHead>
                <TableHead>{t("admin.common.joined")}</TableHead>
                <TableHead>{t("admin.common.bookings")}</TableHead>
                <TableHead>{t("admin.common.totalSpent")}</TableHead>
                <TableHead>{t("admin.common.status")}</TableHead>
                <TableHead className="text-right">
                  {t("admin.common.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showSkeleton ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={8}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-destructive"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      {t("admin.common.failedToLoad") ??
                        "Failed to load families."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : families.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-5 w-5" />
                      {t("admin.common.noData") ?? "No families found."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                families.map((f) => {
                  const id = f?._id ?? "";
                  const isBlocked =
                    f?.status === "block" || f?.status === "inactive";
                  const selected: SelectedFamily = {
                    id,
                    name: f?.fullName ?? "-",
                    email: f?.email ?? "-",
                    phone: f?.phone ?? "-",
                  };

                  return (
                    <TableRow
                      key={id || f?.email}
                      className="hover:bg-muted-bg"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserAvatar name={f?.fullName ?? ""} size={32} />
                          <span className="font-medium text-foreground">
                            {f?.fullName ?? "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {f?.email ?? "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {f?.city ?? "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(f?.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {f?.totalReview ?? 0}
                      </TableCell>
                      {/* Total spent isn't returned by /users/all-families yet; shown as "-" until the API adds it */}
                      <TableCell className="text-sm font-medium">
                        {f?.totalSpent != null ? formatCHF(f.totalSpent) : "-"}
                      </TableCell>
                      <TableCell>
                        <Pill value={isBlocked ? "Suspended" : "Active"} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="rounded-md p-1.5 hover:bg-secondary"
                              disabled={isToggling}
                            >
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
                              {isBlocked ? (
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

      <UserDetailsDialog
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        user={
          viewing && {
            name: viewing.name,
            email: viewing.email,
            phone: viewing.phone,
            completed: 0,
            earnings: 0,
            earningsLabel: t("admin.dialog.totalSpent"),
          }
        }
      />
      <ConfirmDialog
        open={!!confirming}
        onOpenChange={(o) => !o && setConfirming(null)}
        confirmLabel={t("admin.common.yes")}
        cancelLabel={t("admin.common.no")}
        title={
          t("admin.dialog.confirmSuspendFamily") ??
          "Change this family's status?"
        }
        onConfirm={async () => {
          if (!confirming?.id) return;
          try {
            await blockUnblock(confirming.id).unwrap();
            toast.success(
              t("admin.dialog.familyStatusUpdated") ?? "Family status updated.",
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
