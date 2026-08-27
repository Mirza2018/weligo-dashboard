// src/components/messaging/ChatListItem.tsx
import { getImageUrl } from "@/redux/getBaseUrl";
import { cn } from "@/lib/utils";

import type { ChatListEntry } from "@/types/messaging";
import { OnlineDot } from "./OnlineDot";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function ChatListItem({
  entry,
  active,
  onClick,
}: {
  entry: ChatListEntry;
  active: boolean;
  onClick: () => void;
}) {
  const other = entry.chat.users[0];
  const name = other?.fullName ?? other?.name ?? "Unknown";
  const avatarUrl = other?.profileImage
    ? getImageUrl(other.profileImage)
    : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted",
        active && "bg-primary/10",
      )}
    >
      <div className="relative shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
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

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {name}
          </p>
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {timeAgo(entry.lastMessageCreatedAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs text-muted-foreground">
            {entry.lastMessage || "No messages yet"}
          </p>
          {entry.unreadMessageCount > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {entry.unreadMessageCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
