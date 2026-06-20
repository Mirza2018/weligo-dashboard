import { useMemo, useState } from "react";
import { Search } from "lucide-react";

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
import { UserAvatar } from "../../../components/common/UserAvatar";
import { Pill } from "../../../components/Dashboard/Admin/Pill";
import {
  adminBookings,
  type AdminBookingStatus,
} from "../../../assets/data/admin";
import { formatCHF } from "../../../lib/format";
import { useI18n } from "../../../lib/i18n";
import { Input } from "../../../components/ui/input";

export function AdminBookingsPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | AdminBookingStatus>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adminBookings.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (!q) return true;
      return (
        b.family.toLowerCase().includes(q) ||
        b.provider.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    });
  }, [query, status]);

  return (
    <div className=" flex flex-col gap-5">
      <h2 className="font-serif text-3xl font-medium">{t("admin.bookings.title")}</h2>

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
            <SelectItem value="Completed">{t("admin.pill.Completed")}</SelectItem>
            <SelectItem value="Cancelled">{t("admin.pill.Cancelled")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
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
            {filtered.map((b) => (
              <TableRow key={b.id} className="hover:bg-muted-bg">
                <TableCell className="font-medium">{b.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={b.family} size={28} />
                    <span className="text-sm">{b.family}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={b.provider} size={28} />
                    <span className="text-sm">{b.provider}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{b.service}</TableCell>
                <TableCell className="text-sm">
                  {b.date} · {b.time}
                </TableCell>
                <TableCell>
                  <Pill value={b.status} />
                </TableCell>
                <TableCell className="text-sm font-medium">{formatCHF(b.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
