import type { ReactNode } from "react";
import { cn } from "../../lib/utils";


export function SectionCard({
  title,
  action,
  children,
  className,
  contentClassName,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between">
          {typeof title === "string" ? (
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          ) : (
            title
          )}
          {action}
        </header>
      )}
      <div className={cn(contentClassName)}>{children}</div>
    </section>
  );
}
