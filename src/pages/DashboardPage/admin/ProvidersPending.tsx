import { useMemo, useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Search,
  Check,
  X,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { Input } from "../../../components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { toast } from "sonner";
import { useI18n } from "../../../lib/i18n";
import {
  useGetPendingProvidersQuery,
  useApproveProviderMutation,
  useRejectProviderMutation,
} from "@/redux/api/websiteApi";

type ViewingProvider = {
  id: string;
  name: string;
  email: string;
  phone: string;
  registered: string;
};

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

export function AdminProvidersPendingPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<ViewingProvider | null>(null);
  const [decidingId, setDecidingId] = useState<string | null>(null);

  const {
    data: res,
    isFetching,
    isLoading,
    isError,
  } = useGetPendingProvidersQuery({ page, limit: 10 });

  const [approveProvider, { isLoading: isApproving }] =
    useApproveProviderMutation();
  const [rejectProvider, { isLoading: isRejecting }] =
    useRejectProviderMutation();
  const isDeciding = isApproving || isRejecting;

  const providers = res?.data ?? [];
  const meta = res?.meta;
  const showSkeleton = isLoading || (isFetching && providers.length === 0);

  // NOTE: /users/pending-providers only documents page/limit params (no searchTerm),
  // so filtering here is client-side against the currently loaded page only.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter(
      (p) =>
        p?.fullName?.toLowerCase().includes(q) ||
        p?.email?.toLowerCase().includes(q),
    );
  }, [providers, query]);

  const decide = async (id: string, accepted: boolean) => {
    if (!id) return;
    setDecidingId(id);
    try {
      if (accepted) {
        await approveProvider(id).unwrap();
        toast.success(t("admin.pending.accepted"));
      } else {
        await rejectProvider(id).unwrap();
        toast.success(t("admin.pending.rejected"));
      }
      setViewing(null);
    } catch {
      toast.error(
        t("admin.common.somethingWentWrong") ??
          "Couldn't update this application. Try again.",
      );
    } finally {
      setDecidingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-serif text-3xl font-medium">
        {t("admin.pending.title")}
      </h2>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("admin.common.searchByNameEmail")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead>{t("admin.common.provider")}</TableHead>
                <TableHead>{t("admin.common.email")}</TableHead>
                <TableHead>{t("admin.common.services")}</TableHead>
                <TableHead>{t("admin.common.city")}</TableHead>
                <TableHead>{t("admin.common.registered")}</TableHead>
                <TableHead className="text-right">
                  {t("admin.common.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showSkeleton ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-destructive"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      {t("admin.common.failedToLoad") ??
                        "Failed to load pending providers."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-5 w-5" />
                      {t("admin.pending.noResults") ??
                        "No pending applications."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => {
                  const id = p?._id ?? "";
                  const rowBusy = isDeciding && decidingId === id;
                  const selected: ViewingProvider = {
                    id,
                    name: p?.fullName ?? "-",
                    email: p?.email ?? "-",
                    phone: p?.phone ?? "-",
                    registered: formatDate(p?.createdAt),
                  };

                  return (
                    <TableRow
                      key={id || p?.email}
                      className="hover:bg-muted-bg"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserAvatar name={p?.fullName ?? ""} size={32} />
                          <span className="font-medium">
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
                        {formatDate(p?.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="rounded-md p-1.5 hover:bg-secondary"
                              disabled={rowBusy}
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

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.pending.application")}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="flex flex-col items-center gap-4 py-2">
              <UserAvatar name={viewing.name} size={88} />
              <div className="w-full space-y-2 text-sm">
                <Row label={t("admin.common.name")} value={viewing.name} />
                <Row label={t("admin.common.email")} value={viewing.email} />
                <Row label={t("admin.common.phone")} value={viewing.phone} />
                <Row
                  label={t("admin.pending.registrationDate")}
                  value={viewing.registered}
                />
              </div>
              <div className="mt-2 flex w-full gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={isDeciding}
                  onClick={() => decide(viewing.id, false)}
                >
                  <X className="mr-1 h-4 w-4" /> {t("admin.common.reject")}
                </Button>
                <Button
                  className="flex-1"
                  disabled={isDeciding}
                  onClick={() => decide(viewing.id, true)}
                >
                  <Check className="mr-1 h-4 w-4" /> {t("admin.common.accept")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
