import { useI18n } from "../../../lib/i18n";
import { cn } from "../../../lib/utils";


const styles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Suspended: "bg-rose-50 text-rose-700 border-rose-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  Success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Failed: "bg-rose-50 text-rose-700 border-rose-200",
  Open: "bg-sky-50 text-sky-700 border-sky-200",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
  Closed: "bg-zinc-100 text-zinc-700 border-zinc-200",
  Payment: "bg-violet-50 text-violet-700 border-violet-200",
  Refund: "bg-rose-50 text-rose-700 border-rose-200",
  Payout: "bg-sky-50 text-sky-700 border-sky-200",
  Authorized: "bg-sky-50 text-sky-700 border-sky-200",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Captured: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Voided: "bg-zinc-100 text-zinc-700 border-zinc-200",
  Refunded: "bg-orange-50 text-orange-700 border-orange-200",
};

export function Pill({ value, className }: { value: string; className?: string }) {
  const { t } = useI18n();
  const label = t(`admin.pill.${value}`);
  const display = label === `admin.pill.${value}` ? value : label;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[value] ?? "bg-secondary text-secondary-foreground border-border",
        className,
      )}
    >
      {display}
    </span>
  );
}
