import { useMemo, useState, useEffect } from "react";
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
import { formatCHF } from "../../../lib/format";
import { useI18n } from "../../../lib/i18n";
import { useGetAllTransactionsQuery } from "../../../redux/api/websiteApi"; // adjust path

// --- API-facing types (matches /payments) ---
type ApiPaymentStatus =
  | "pending"
  | "authorized"
  | "processing"
  | "captured"
  | "failed"
  | "voided"
  | "refunded"
  | "cancelled";

type ApiPaymentMethod = "card" | "apple_pay";

const PAYMENT_STATUSES: ApiPaymentStatus[] = [
  "pending",
  "authorized",
  "processing",
  "captured",
  "failed",
  "voided",
  "refunded",
  "cancelled",
];

interface TransactionUser {
  _id: string;
  fullName: string;
  email: string;
  profileImage: string;
  phone: string;
}

interface TransactionBooking {
  _id: string;
  customer: string;
  serviceProvider: TransactionUser;
  bookingDate: string;
  status: string;
  bookingReference: string;
}

interface Transaction {
  _id: string;
  booking: TransactionBooking | null;
  payer: TransactionUser;
  amount: number;
  commissionAmount: number;
  providerEarning: number;
  currency: string;
  paymentMethod: ApiPaymentMethod;
  paymentStatus: ApiPaymentStatus;
  gatewayReference: string;
  refundedAmount: number;
  createdAt: string;
  updatedAt: string;
  transactionId?: string;
}

interface TransactionsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: { page: number; limit: number; total: number; totalPage: number };
  data: Transaction[];
}

// "pending" -> "Pending", "apple_pay" -> not touched here (handled separately)
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const methodToUi = (method: ApiPaymentMethod): string =>
  method === "apple_pay" ? "Apple Pay" : "Card";

export function AdminTransactionsPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [status, setStatus] = useState<"all" | ApiPaymentStatus>("all");
  const [method, setMethod] = useState<"all" | ApiPaymentMethod>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, status, method]);

  const { data, isLoading, isFetching, isError } = useGetAllTransactionsQuery({
    page,
    limit: 10,
    ...(status !== "all" ? { paymentStatus: status } : {}),
    ...(method !== "all" ? { paymentMethod: method } : {}),
    ...(debouncedQuery ? { searchTerm: debouncedQuery } : {}),
  }) as {
    data?: TransactionsResponse;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
  };

  const rows = useMemo(() => {
    return (data?.data ?? []).map((tx) => ({
      id: tx?.transactionId || tx?._id,
      type: tx?.booking ? tx?.booking?.bookingReference : "Direct Payment",
      userName: tx?.payer?.fullName,
      amount: tx?.amount,
      method: methodToUi(tx?.paymentMethod),
      status: capitalize(tx?.paymentStatus), // "authorized" -> "Authorized", matches Pill's t("admin.pill.Authorized") lookup
      date: new Date(tx?.createdAt).toLocaleDateString(),
    }));
  }, [data]);

  const totalPages = data?.meta.totalPage ?? 1;
  const totalCount = data?.meta.total ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-serif text-3xl font-medium">
        {t("admin.transactions.title")}
      </h2>

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
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as typeof status)}
        >
          <SelectTrigger className="w-44 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.common.allStatus")}</SelectItem>
            {PAYMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {capitalize(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={method}
          onValueChange={(v) => setMethod(v as typeof method)}
        >
          <SelectTrigger className="w-40 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("admin.transactions.allMethods")}
            </SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="apple_pay">Apple Pay</SelectItem>
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-sm text-destructive"
                >
                  Failed to load transactions.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((tx) => (
                <TableRow key={tx?.id} className="hover:bg-muted-bg">
                  <TableCell className="font-medium">{tx?.id}</TableCell>
                  <TableCell>
                    <Pill value={tx?.type} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{tx?.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("admin.common.family")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {formatCHF(tx?.amount)}
                  </TableCell>
                  <TableCell className="text-sm">{tx?.method}</TableCell>
                  <TableCell>
                    <Pill value={tx?.status} />
                  </TableCell>
                  <TableCell className="text-sm">{tx?.date}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages} · {totalCount} transactions
          </span>
          <div className="flex gap-2">
            <button
              className="rounded-md border border-border px-3 py-1 disabled:opacity-40"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="rounded-md border border-border px-3 py-1 disabled:opacity-40"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
