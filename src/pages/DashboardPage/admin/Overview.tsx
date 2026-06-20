import { Users, Briefcase, CalendarCheck, Wallet, UserPlus } from "lucide-react";
// import { StatCard } from "@/components/Dashboard/Admin/StatCard";
// import { BookingsChart, EarningsChart } from "@/components/Dashboard/Admin/AdminCharts";
// import { SectionCard } from "@/components/common/SectionCard";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { UserAvatar } from "@/components/common/UserAvatar";
// import { Pill } from "@/components/Dashboard/Admin/Pill";
// import { adminProviders, adminTotals } from "@/assets/data/admin";
// import { formatCHF } from "@/lib/format";
import { Star, MoreHorizontal } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Eye, Ban, CheckCircle2 } from "lucide-react";
import { useState } from "react";
// import { UserDetailsDialog } from "@/components/Dashboard/Admin/UserDetailsDialog";
// import { ConfirmDialog } from "@/components/Dashboard/Admin/ConfirmDialog";
import { toast } from "sonner";
import { useI18n } from "../../../lib/i18n";
import { adminProviders, adminTotals, type Provider } from "../../../assets/data/admin";
import { StatCard } from "../../../components/Dashboard/Admin/StatCard";
import { BookingsChart, EarningsChart } from "../../../components/Dashboard/Admin/AdminCharts";
import { SectionCard } from "../../../components/common/SectionCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { formatCHF } from "../../../lib/format";
import { Pill } from "../../../components/Dashboard/Admin/Pill";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { UserDetailsDialog } from "../../../components/Dashboard/Admin/UserDetailsDialog";
import { ConfirmDialog } from "../../../components/Dashboard/Admin/ConfirmDialog";
// import type { Provider } from "@/assets/data/admin";
// import { useI18n } from "@/lib/i18n";

export function AdminOverviewPage() {
  const { t } = useI18n();
  const [providers, setProviders] = useState<Provider[]>(
    [...adminProviders].sort((a, b) => b.earnings - a.earnings).slice(0, 8),
  );
  const [viewing, setViewing] = useState<Provider | null>(null);
  const [confirming, setConfirming] = useState<Provider | null>(null);

  const toggleStatus = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "Active" ? "Suspended" : "Active" } : p,
      ),
    );
  };

  return (
    <div className="flex  flex-col gap-5">
      <h2 className="font-serif text-3xl font-medium">{t("admin.overview.title")}</h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label={t("admin.overview.totalFamilies")} value={String(adminTotals.families)} icon={Users} />
        <StatCard label={t("admin.overview.totalProviders")} value={String(adminTotals.providers)} icon={Briefcase} />
        <StatCard label={t("admin.overview.activeBookings")} value={String(adminTotals.activeBookings)} icon={CalendarCheck} />
        <StatCard label={t("admin.overview.monthRevenue")} value={formatCHF(adminTotals.monthRevenue)} icon={Wallet} />
        <StatCard label={t("admin.overview.pendingApprovals")} value={String(adminTotals.pending)} icon={UserPlus} />
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
                <TableHead className="text-right">{t("admin.common.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted-bg">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={p.name} size={32} />
                      <span className="font-medium text-foreground">{p.name}</span>
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
                  <TableCell className="text-sm">{p.completed}</TableCell>
                  <TableCell className="text-sm font-medium">{formatCHF(p.earnings)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {p.rating.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Pill value={p.status} />
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => setConfirming(p)}>
                          {p.status === "Active" ? (
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
          confirming?.status === "Active"
            ? t("admin.dialog.confirmSuspendProvider")
            : t("admin.dialog.confirmActivateProvider")
        }
        onConfirm={() => {
          if (confirming) {
            toggleStatus(confirming.id);
            toast.success(
              confirming.status === "Active"
                ? t("admin.dialog.providerSuspended")
                : t("admin.dialog.providerActivated"),
            );
            setConfirming(null);
          }
        }}
      />
    </div>
  );
}
