import { useState } from "react";
import { MoreHorizontal, Eye } from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Pill } from "../../../components/Dashboard/Admin/Pill";
import { supportTickets, type SupportTicket, type SupportStatus } from "../../../assets/data/admin";
import { toast } from "sonner";
import { useI18n } from "../../../lib/i18n";

export function AdminSupportPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<SupportTicket[]>(supportTickets);
  const [viewing, setViewing] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");

  const updateStatus = (id: string, status: SupportStatus) => {
    setItems((prev) => prev.map((tk) => (tk.id === id ? { ...tk, status } : tk)));
    setViewing((v) => (v ? { ...v, status } : v));
    toast.success(`${t("admin.support.markedAs")} ${t(`admin.pill.${status}`)}`);
  };

  const sendReply = () => {
    if (!reply.trim()) return;
    toast.success(t("admin.support.replySent"));
    setReply("");
  };

  return (
    <div className=" flex flex-col gap-5">
      <h2 className="font-serif text-3xl font-medium">{t("admin.support.title")}</h2>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead>{t("admin.support.ticketNo")}</TableHead>
              <TableHead>{t("admin.common.dateTime")}</TableHead>
              <TableHead>{t("admin.support.category")}</TableHead>
              <TableHead>{t("admin.support.subject")}</TableHead>
              <TableHead>{t("admin.common.name")}</TableHead>
              <TableHead>{t("admin.common.status")}</TableHead>
              <TableHead className="text-right">{t("admin.common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((tk) => (
              <TableRow key={tk.id} className="hover:bg-muted-bg">
                <TableCell className="font-medium">{tk.number}</TableCell>
                <TableCell className="text-sm">{tk.datetime}</TableCell>
                <TableCell className="text-sm">{tk.category}</TableCell>
                <TableCell className="max-w-xs truncate text-sm">{tk.subject}</TableCell>
                <TableCell className="text-sm">{tk.name}</TableCell>
                <TableCell>
                  <Pill value={tk.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-md p-1.5 hover:bg-secondary">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewing(tk)}>
                        <Eye className="mr-2 h-4 w-4" /> {t("admin.common.view")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("admin.support.details")}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <Row label={t("admin.common.name")} value={viewing.name} />
              <Row label={t("admin.support.ticketNumber")} value={viewing.number} />
              <Row label={t("admin.common.dateTime")} value={viewing.datetime} />
              <Row label={t("admin.support.category")} value={viewing.category} />
              <Row label={t("admin.support.subject")} value={viewing.subject} />
              <div>
                <p className="mb-1 text-muted-foreground">{t("admin.common.description")}</p>
                <p className="rounded-lg border border-border bg-muted-bg p-3">
                  {viewing.description}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reply">{t("admin.support.reply")}</Label>
                <Textarea
                  id="reply"
                  rows={3}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={t("admin.support.writeReply")}
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={sendReply}>
                    {t("admin.support.sendReply")}
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {viewing && (
              <>
                <Button variant="outline" onClick={() => updateStatus(viewing.id, "Open")}>
                  {t("admin.support.open")}
                </Button>
                <Button variant="outline" onClick={() => updateStatus(viewing.id, "In Progress")}>
                  {t("admin.support.inProgress")}
                </Button>
                <Button onClick={() => updateStatus(viewing.id, "Closed")}>{t("admin.support.close")}</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
