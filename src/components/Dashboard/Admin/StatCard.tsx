import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="mt-3 font-serif text-3xl font-medium text-foreground">{value}</p>
    </div>
  );
}
