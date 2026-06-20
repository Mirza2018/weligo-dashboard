import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useI18n } from "../../../lib/i18n";
import { UserAvatar } from "../../common/UserAvatar";
import { formatCHF } from "../../../lib/format";


export type UserDetails = {
  name: string;
  email: string;
  phone: string;
  completed: number;
  earnings: number;
  earningsLabel?: string;
};

export function UserDetailsDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  user: UserDetails | null;
}) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("admin.dialog.accountDetails")}</DialogTitle>
        </DialogHeader>
        {user && (
          <div className="flex flex-col items-center gap-4 py-2">
            <UserAvatar name={user.name} size={88} />
            <div className="w-full space-y-2 text-sm">
              <Row label={t("admin.common.name")} value={user.name} />
              <Row label={t("admin.common.email")} value={user.email} />
              <Row label={t("admin.common.phone")} value={user.phone} />
              <Row label={t("admin.dialog.completedJobs")} value={String(user.completed)} />
              <Row
                label={user.earningsLabel ?? t("admin.dialog.accumulatedEarnings")}
                value={formatCHF(user.earnings)}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
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
