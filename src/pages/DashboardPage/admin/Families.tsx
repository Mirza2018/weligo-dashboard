import { useMemo, useState } from "react";
import { MoreHorizontal, Eye, Ban, CheckCircle2, Search } from "lucide-react";
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
import { UserAvatar } from "../../../components/common/UserAvatar";
import { Pill } from "../../../components/Dashboard/Admin/Pill";
import { UserDetailsDialog } from "../../../components/Dashboard/Admin/UserDetailsDialog";
import { ConfirmDialog } from "../../../components/Dashboard/Admin/ConfirmDialog";
import { adminFamilies, type Family } from "../../../assets/data/admin";
import { formatCHF } from "../../../lib/format";
import { toast } from "sonner";
import { useI18n } from "../../../lib/i18n";

export function AdminFamiliesPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Family[]>(adminFamilies);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "Active" | "Suspended">("all");
  const [viewing, setViewing] = useState<Family | null>(null);
  const [confirming, setConfirming] = useState<Family | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((f) => {
      if (status !== "all" && f.status !== status) return false;
      if (!q) return true;
      return f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q);
    });
  }, [items, query, status]);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: f.status === "Active" ? "Suspended" : "Active" } : f,
      ),
    );
  };

  return (
    <div className=" flex flex-col gap-5">
      <h2 className="font-serif text-3xl font-medium">{t("admin.nav.families")}</h2>

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
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-40 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.common.allStatus")}</SelectItem>
            <SelectItem value="Active">{t("admin.pill.Active")}</SelectItem>
            <SelectItem value="Suspended">{t("admin.pill.Suspended")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
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
              <TableHead className="text-right">{t("admin.common.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((f) => (
              <TableRow key={f.id} className="hover:bg-muted-bg">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={f.name} size={32} />
                    <span className="font-medium text-foreground">{f.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{f.email}</TableCell>
                <TableCell className="text-sm">{f.city}</TableCell>
                <TableCell className="text-sm">{f.joined}</TableCell>
                <TableCell className="text-sm">{f.totalBookings}</TableCell>
                <TableCell className="text-sm font-medium">{formatCHF(f.totalSpent)}</TableCell>
                <TableCell>
                  <Pill value={f.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-md p-1.5 hover:bg-secondary">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewing(f)}>
                        <Eye className="mr-2 h-4 w-4" /> {t("admin.common.viewDetails")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setConfirming(f)}>
                        {f.status === "Active" ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" /> {t("admin.common.suspend")}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> {t("admin.common.activate")}
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserDetailsDialog
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        user={
          viewing && {
            name: viewing.name,
            email: viewing.email,
            phone: viewing.phone,
            completed: viewing.totalBookings,
            earnings: viewing.totalSpent,
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
          confirming?.status === "Active"
            ? t("admin.dialog.confirmSuspendFamily")
            : t("admin.dialog.confirmActivateFamily")
        }
        onConfirm={() => {
          if (confirming) {
            toggle(confirming.id);
            toast.success(
              confirming.status === "Active"
                ? t("admin.dialog.familySuspended")
                : t("admin.dialog.familyActivated"),
            );
            setConfirming(null);
          }
        }}
      />
    </div>
  );
}
