// src/components/messaging/OnlineDot.tsx
import { cn } from "@/lib/utils";
import { useSocketContext } from "@/socket/SocketProvider";

export function OnlineDot({
  userId,
  className,
}: {
  userId: string;
  className?: string;
}) {
  const { onlineUserIds } = useSocketContext();
  const online = onlineUserIds.has(userId);

  return (
    <span
      className={cn(
        "block h-2.5 w-2.5 rounded-full border-2 border-white",
        online ? "bg-emerald-500" : "bg-muted-foreground/40",
        className,
      )}
      aria-label={online ? "Online" : "Offline"}
    />
  );
}
