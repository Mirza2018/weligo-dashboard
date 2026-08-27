// src/components/messaging/CallButton.tsx
import { Phone, Video } from "lucide-react";
import { Button } from "../ui/button";
import { useSocketContext } from "@/socket/SocketProvider";
import type { CallType } from "@/types/messaging";

interface CallButtonProps {
  receiverId: string;
  receiverName: string;
  type: CallType;
  className?: string;
}

export function CallButton({
  receiverId,
  receiverName,
  type,
  className,
}: CallButtonProps) {
  const { call, startCall } = useSocketContext();
  const busy = call.phase !== "idle";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={className}
      disabled={busy}
      aria-label={type === "video" ? "Start video call" : "Start voice call"}
      onClick={() => startCall(receiverId, receiverName, type)}
    >
      {type === "video" ? (
        <Video className="h-4 w-4" />
      ) : (
        <Phone className="h-4 w-4" />
      )}
    </Button>
  );
}
