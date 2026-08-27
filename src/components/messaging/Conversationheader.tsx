// src/components/messaging/ConversationHeader.tsx
import { getImageUrl } from "@/redux/getBaseUrl";

import { CallButton } from "./CallButton";
import { useSocketContext } from "@/socket/SocketProvider";
import type { ChatUserRef } from "@/types/messaging";
import { OnlineDot } from "./OnlineDot";

export function ConversationHeader({
  other,
}: {
  other: ChatUserRef | undefined;
}) {
  const { onlineUserIds } = useSocketContext();
  const name = other?.fullName ?? other?.name ?? "Conversation";
  const avatarUrl = other?.profileImage
    ? getImageUrl(other.profileImage)
    : null;
  const online = other ? onlineUserIds.has(other._id) : false;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {other && (
            <OnlineDot
              userId={other._id}
              className="absolute -bottom-0.5 -right-0.5"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {name}
          </p>
          <p className="text-xs text-muted-foreground">
            {online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {other && (
        <div className="flex shrink-0 items-center gap-2">
          <CallButton receiverId={other._id} receiverName={name} type="audio" />
          <CallButton receiverId={other._id} receiverName={name} type="video" />
        </div>
      )}
    </div>
  );
}
