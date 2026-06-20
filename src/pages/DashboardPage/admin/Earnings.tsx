import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { adminEarnings } from "../../../assets/data/admin";
import { formatCHF } from "../../../lib/format";
import { useI18n } from "../../../lib/i18n";

export function AdminEarningsPage() {
  const { t } = useI18n();
  const total = adminEarnings.reduce((s, e) => s + e.commissionAmount, 0);

  return (
    <div className=" flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <h2 className="font-serif text-3xl font-medium">{t("admin.earnings.title")}</h2>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{t("admin.earnings.totalCommission")}</p>
          <p className="font-serif text-2xl font-medium">{formatCHF(total)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead>{t("admin.earnings.bookingId")}</TableHead>
              <TableHead>{t("admin.common.service")}</TableHead>
              <TableHead>{t("admin.common.family")}</TableHead>
              <TableHead>{t("admin.earnings.gross")}</TableHead>
              <TableHead>{t("admin.earnings.commissionPct")}</TableHead>
              <TableHead>{t("admin.earnings.commission")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminEarnings.map((e) => (
              <TableRow key={e.id} className="hover:bg-muted-bg">
                <TableCell className="font-medium">{e.id}</TableCell>
                <TableCell className="text-sm">{e.service}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={e.family} size={28} />
                    <span className="text-sm">{e.family}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{formatCHF(e.gross)}</TableCell>
                <TableCell className="text-sm">{e.commissionPct}%</TableCell>
                <TableCell className="text-sm font-medium">
                  {formatCHF(e.commissionAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
