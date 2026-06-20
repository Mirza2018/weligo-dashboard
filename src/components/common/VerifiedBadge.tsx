import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <BadgeCheck
      className={cn("h-4 w-4 fill-primary text-primary-foreground", className)}
      aria-label="Verified"
    />
  );
}
