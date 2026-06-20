import { useMemo, useState } from "react";
import { MoreHorizontal, Eye, Search, Check, X } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { pendingProviders, type PendingProvider } from "../../../assets/data/admin";
import { toast } from "sonner";
import { useI18n } from "../../../lib/i18n";

export function AdminProvidersPendingPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<PendingProvider[]>(pendingProviders);
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<PendingProvider | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (p) =>
        !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q),
    );
  }, [items, query]);

  const decide = (id: string, accepted: boolean) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    toast.success(accepted ? t("admin.pending.accepted") : t("admin.pending.rejected"));
    setViewing(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-serif text-3xl font-medium">{t("admin.pending.title")}</h2>

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
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead>{t("admin.common.provider")}</TableHead>
              <TableHead>{t("admin.common.email")}</TableHead>
              <TableHead>{t("admin.common.services")}</TableHead>
              <TableHead>{t("admin.common.city")}</TableHead>
              <TableHead>{t("admin.common.registered")}</TableHead>
              <TableHead className="text-right">{t("admin.common.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} className="hover:bg-muted-bg">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={p.name} size={32} />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {p.services.map((s) => (
                      <span
                        key={s}
                        className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{p.city}</TableCell>
                <TableCell className="text-sm">{p.registered}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-md p-1.5 hover:bg-secondary">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewing(p)}>
                        <Eye className="mr-2 h-4 w-4" /> {t("admin.common.viewDetails")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  {t("admin.pending.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                <Row label={t("admin.pending.registrationDate")} value={viewing.registered} />
              </div>
              <div className="mt-2 flex w-full gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => decide(viewing.id, false)}
                >
                  <X className="mr-1 h-4 w-4" /> {t("admin.common.reject")}
                </Button>
                <Button className="flex-1" onClick={() => decide(viewing.id, true)}>
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
