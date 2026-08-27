import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  Eye,
  AlertCircle,
  Inbox,
  Paperclip,
  X,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Pill } from "../../../components/Dashboard/Admin/Pill";
import { toast } from "sonner";
import { useI18n } from "../../../lib/i18n";

import {
  useGetAllTicketsQuery,
  useUpdateTicketMutation,
  useReplyTicketMutation,
} from "@/redux/api/websiteApi";
import { getImageUrl } from "@/redux/getBaseUrl";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

type TicketMessage = {
  sender?: string;
  message?: string;
  attachment?: string;
  createdAt?: string;
};

type ApiTicket = {
  _id?: string;
  user?: {
    _id?: string;
    fullName?: string;
    email?: string;
    profileImage?: string;
    role?: string;
  };
  subject?: string;
  title?: string;
  description?: string;
  status?: TicketStatus;
  messages?: TicketMessage[];
  ticketNumber?: string;
  createdAt?: string;
};

const PAGE_LIMIT = 10;
const STATUS_OPTIONS: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

function statusPillLabel(status?: string) {
  switch (status) {
    case "OPEN":
      return "Open";
    case "IN_PROGRESS":
      return "In Progress";
    case "RESOLVED":
      return "Success"; // reuses the green "Success" style until Pill gets a dedicated "Resolved" entry
    case "CLOSED":
      return "Closed";
    default:
      return status ?? "-";
  }
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminSupportPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"all" | TicketStatus>("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<ApiTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyAttachment, setReplyAttachment] = useState<File | null>(null);
  const attachmentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const {
    data: res,
    isFetching,
    isLoading,
    isError,
  } = useGetAllTicketsQuery({
    page,
    limit: PAGE_LIMIT,
    ...(status !== "all" ? { status } : {}),
  });

  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();
  const [replyTicket, { isLoading: isReplying }] = useReplyTicketMutation();

  const tickets = res?.data ?? [];
  const meta = res?.meta;
  const showSkeleton = isLoading || (isFetching && tickets.length === 0);

  const updateStatus = async (id?: string, next?: TicketStatus) => {
    if (!id || !next) return;
    try {
      const result = await updateTicket({
        id,
        data: { status: next },
      }).unwrap();
      setViewing((v) => (v ? { ...v, status: next } : v));
      toast.success(
        `${t("admin.support.markedAs")} ${t(`admin.pill.${statusPillLabel(next)}`) ?? next}`,
      );
      void result;
    } catch {
      toast.error(
        t("admin.common.somethingWentWrong") ??
          "Couldn't update the ticket. Try again.",
      );
    }
  };

  const openTicket = (tk: ApiTicket) => {
    setViewing(tk);
    setReplyText("");
    setReplyAttachment(null);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setReplyAttachment(file);
  };

  const sendReply = async () => {
    if (!viewing?._id || !replyText.trim() || viewing?.status === "CLOSED")
      return;
    const formData = new FormData();
    formData.append("data", JSON.stringify({ message: replyText.trim() }));
    if (replyAttachment) formData.append("attachment", replyAttachment);

    try {
      const res = await replyTicket({
        id: viewing._id,
        data: formData,
      }).unwrap();
      setViewing(res?.data ?? viewing);
      setReplyText("");
      setReplyAttachment(null);
      if (attachmentRef.current) attachmentRef.current.value = "";
      toast.success(t("admin.support.replySent") ?? "Reply sent.");
    } catch {
      toast.error(
        t("admin.common.somethingWentWrong") ??
          "Couldn't send the reply. Try again.",
      );
    }
  };

  const isClosed = viewing?.status === "CLOSED";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-3xl font-medium">
          {t("admin.support.title")}
        </h2>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as typeof status)}
        >
          <SelectTrigger className="w-44 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.common.allStatus")}</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {statusPillLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead>{t("admin.support.ticketNo")}</TableHead>
                <TableHead>{t("admin.common.dateTime")}</TableHead>
                <TableHead>{t("admin.support.category")}</TableHead>
                <TableHead>{t("admin.support.subject")}</TableHead>
                <TableHead>{t("admin.common.name")}</TableHead>
                <TableHead>{t("admin.common.status")}</TableHead>
                <TableHead className="text-right">
                  {t("admin.common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showSkeleton ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-destructive"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      {t("admin.common.failedToLoad") ??
                        "Failed to load support tickets."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-5 w-5" />
                      {t("admin.support.noResults") ?? "No tickets found."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((tk: ApiTicket) => (
                  <TableRow key={tk?._id} className="hover:bg-muted-bg">
                    <TableCell className="font-medium">
                      {tk?.ticketNumber ?? "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateTime(tk?.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {tk?.subject ?? "-"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {tk?.title ?? "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {tk?.user?.fullName ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Pill value={statusPillLabel(tk?.status)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="rounded-md p-1.5 hover:bg-secondary">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openTicket(tk)}>
                            <Eye className="mr-2 h-4 w-4" />{" "}
                            {t("admin.common.view")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
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

      <Dialog
        open={!!viewing}
        onOpenChange={(o) => {
          if (!o) {
            setViewing(null);
            setReplyText("");
            setReplyAttachment(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("admin.support.details")}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <Row
                label={t("admin.common.name")}
                value={viewing?.user?.fullName ?? "-"}
              />
              <Row
                label={t("admin.support.ticketNumber")}
                value={viewing?.ticketNumber ?? "-"}
              />
              <Row
                label={t("admin.common.dateTime")}
                value={formatDateTime(viewing?.createdAt)}
              />
              <Row
                label={t("admin.support.category")}
                value={viewing?.subject ?? "-"}
              />
              <Row
                label={t("admin.support.subject")}
                value={viewing?.title ?? "-"}
              />
              <Row
                label={t("admin.common.status")}
                value={statusPillLabel(viewing?.status)}
              />

              <div>
                <p className="mb-1 text-muted-foreground">
                  {t("admin.common.description")}
                </p>
                <p className="rounded-lg border border-border bg-muted-bg p-3">
                  {viewing?.description || "-"}
                </p>
              </div>

              {(viewing?.messages?.length ?? 0) > 0 && (
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    {t("admin.support.messages") ?? "Messages"}
                  </p>
                  <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
                    {viewing?.messages?.map((m, i) => (
                      <div
                        key={i}
                        className="rounded-md bg-muted-bg p-2 text-xs"
                      >
                        <p className="text-foreground">{m?.message ?? "-"}</p>
                        <div className="mt-1 flex items-center justify-between text-muted-foreground">
                          <span>{formatDateTime(m?.createdAt)}</span>
                          {m?.attachment && (
                            <a
                              href={getImageUrl(m.attachment)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <Paperclip className="h-3 w-3" />{" "}
                              {t("admin.support.attachment") ?? "Attachment"}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="reply">{t("admin.support.reply")}</Label>
                {isClosed ? (
                  <p className="rounded-lg border border-border bg-muted-bg p-3 text-xs text-muted-foreground">
                    {t("admin.support.closedNoReply") ??
                      "This ticket is closed. Reopen it to send a reply."}
                  </p>
                ) : (
                  <>
                    <Textarea
                      id="reply"
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={t("admin.support.writeReply")}
                      disabled={isReplying}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => attachmentRef.current?.click()}
                          disabled={isReplying}
                        >
                          <Paperclip className="mr-1 h-4 w-4" />
                          {replyAttachment
                            ? (t("admin.common.change") ?? "Change file")
                            : (t("admin.common.attachFile") ?? "Attach file")}
                        </Button>
                        <input
                          ref={attachmentRef}
                          type="file"
                          className="hidden"
                          onChange={handleAttachmentChange}
                        />
                        {replyAttachment && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                            {replyAttachment.name}
                            <button
                              type="button"
                              onClick={() => {
                                setReplyAttachment(null);
                                if (attachmentRef.current)
                                  attachmentRef.current.value = "";
                              }}
                              className="hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={sendReply}
                        disabled={isReplying || !replyText.trim()}
                      >
                        {isReplying
                          ? (t("admin.common.sending") ?? "Sending…")
                          : t("admin.support.sendReply")}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {viewing && (
              <div className="w-full">
                <h1 className="m-2">{t("admin.common.status")}</h1>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={isUpdating || viewing?.status === "IN_PROGRESS"}
                    onClick={() => updateStatus(viewing?._id, "IN_PROGRESS")}
                  >
                    {t("admin.support.inProgress")}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isUpdating || viewing?.status === "RESOLVED"}
                    onClick={() => updateStatus(viewing?._id, "RESOLVED")}
                  >
                    {t("admin.support.resolved")}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isUpdating || viewing?.status === "CLOSED"}
                    onClick={() => updateStatus(viewing?._id, "CLOSED")}
                  >
                    {t("admin.support.close")}
                  </Button>
                  {/* NOTE: the docs only list IN_PROGRESS / RESOLVED / CLOSED as valid
                      updateTicket targets — OPEN isn't documented as settable, so once a
                      ticket is CLOSED there's currently no supported way to reopen it here. */}
                </div>
              </div>
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
