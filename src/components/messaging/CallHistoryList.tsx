// src/components/messaging/CallHistoryList.tsx
import { Phone, PhoneMissed, Video } from "lucide-react";
import { getImageUrl } from "@/redux/getBaseUrl";
// import { useCurrentUser } from "@/lib/currentUser";
import { Skeleton } from "../ui/skeleton";
import { useGetCallsQuery } from "@/redux/api/messageApi";
import { useCurrentUser } from "@/redux/lib/currentUser";

function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function CallHistoryList() {
  const currentUser = useCurrentUser();
  const { data, isLoading, isError } = useGetCallsQuery({});
  const calls = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError)
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Couldn&apos;t load call history.
      </p>
    );
  if (calls.length === 0)
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No calls yet.
      </p>
    );

  return (
    <div className="flex flex-col gap-2">
      {calls.map((call) => {
        const isOutgoing = call.caller._id === currentUser?.userId;
        const other = isOutgoing ? call.receiver : call.caller;
        const name = other.fullName ?? other.name ?? "Unknown";
        const avatarUrl = other.profileImage
          ? getImageUrl(other.profileImage)
          : null;
        const missed = call.status === "missed";

        return (
          <div
            key={call._id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
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
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {name}
              </p>
              <p
                className={`flex items-center gap-1 text-xs ${missed ? "text-destructive" : "text-muted-foreground"}`}
              >
                {missed ? (
                  <PhoneMissed className="h-3.5 w-3.5" />
                ) : (
                  <Phone className="h-3.5 w-3.5" />
                )}
                {isOutgoing ? "Outgoing" : "Incoming"} {call.type}{" "}
                {missed
                  ? "· Missed"
                  : call.duration
                    ? `· ${formatDuration(call.duration)}`
                    : ""}
              </p>
            </div>
            <div className="shrink-0 text-right">
              {call.type === "video" ? (
                <Video className="ml-auto h-4 w-4 text-muted-foreground" />
              ) : (
                <Phone className="ml-auto h-4 w-4 text-muted-foreground" />
              )}
              <p className="mt-1 text-[10px] text-muted-foreground">
                {new Date(call.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
