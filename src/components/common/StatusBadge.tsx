import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { BookingStatus } from "@/assets/data/bookings";

const styles: Record<BookingStatus, string> = {
  upcoming: "bg-sky-50 text-sky-700 border border-sky-200",
  awaitingConfirmation: "bg-pink-50 text-pink-700 border border-pink-200",
  awaitingPayment: "bg-pink-50 text-pink-700 border border-pink-200",
  inProgress: "bg-amber-50 text-amber-700 border border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  requested: "bg-violet-50 text-violet-700 border border-violet-200",
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  cancelled: "bg-rose-50 text-rose-700 border border-rose-200",
};


export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[status],
        className,
      )}
    >
      {t(`bookingStatus.${status}`)}
    </span>
  );
}
