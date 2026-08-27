// src/components/messaging/MessageList.tsx
import { useEffect, useRef } from "react";
import { Skeleton } from "../ui/skeleton";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "@/types/messaging";

export function MessageList({
  messages,
  isLoading,
  currentUserId,
}: {
  messages: Message[];
  isLoading: boolean;
  currentUserId: string | undefined;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        <Skeleton className="h-12 w-2/3 rounded-2xl" />
        <Skeleton className="ml-auto h-12 w-2/3 rounded-2xl" />
        <Skeleton className="h-12 w-1/2 rounded-2xl" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Say hello 👋</p>
      </div>
    );
  }

  // Oldest first for display - the API returns newest first (`sort=-created`).
  const ordered = [...messages].reverse();

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-4">
      {ordered.map((m) => (
        <MessageBubble
          key={m._id}
          message={m}
          isMine={m.sender._id === currentUserId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
