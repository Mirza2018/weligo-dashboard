import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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
import { Pill } from "../../../components/Dashboard/Admin/Pill";
import {
  adminTransactions,
  type AdminTxMethod,
  type AdminTxStatus,
} from "../../../assets/data/admin";
import { formatCHF } from "../../../lib/format";
import { useI18n } from "../../../lib/i18n";

export function AdminTransactionsPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | AdminTxStatus>("all");
  const [method, setMethod] = useState<"all" | AdminTxMethod>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adminTransactions.filter((tx) => {
      if (status !== "all" && tx.status !== status) return false;
      if (method !== "all" && tx.method !== method) return false;
      if (!q) return true;
      return tx.id.toLowerCase().includes(q) || tx.userName.toLowerCase().includes(q);
    });
  }, [query, status, method]);

  return (
    <div className=" flex flex-col gap-5">
      <h2 className="font-serif text-3xl font-medium">{t("admin.transactions.title")}</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("admin.transactions.searchByTxOrUser")}
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
            <SelectItem value="Success">{t("admin.pill.Success")}</SelectItem>
            <SelectItem value="Pending">{t("admin.pill.Pending")}</SelectItem>
            <SelectItem value="Failed">{t("admin.pill.Failed")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={method} onValueChange={(v) => setMethod(v as typeof method)}>
          <SelectTrigger className="w-40 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.transactions.allMethods")}</SelectItem>
            <SelectItem value="TWINT">TWINT</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead>{t("admin.transactions.transactionId")}</TableHead>
              <TableHead>{t("admin.common.type")}</TableHead>
              <TableHead>{t("admin.transactions.user")}</TableHead>
              <TableHead>{t("admin.common.amount")}</TableHead>
              <TableHead>{t("admin.common.method")}</TableHead>
              <TableHead>{t("admin.common.status")}</TableHead>
              <TableHead>{t("admin.common.date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-muted-bg">
                <TableCell className="font-medium">{tx.id}</TableCell>
                <TableCell>
                  <Pill value={tx.type} />
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-medium">{tx.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.userRole === "Family" ? t("admin.common.family") : t("admin.common.provider")}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium">{formatCHF(tx.amount)}</TableCell>
                <TableCell className="text-sm">{tx.method}</TableCell>
                <TableCell>
                  <Pill value={tx.status} />
                </TableCell>
                <TableCell className="text-sm">{tx.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
