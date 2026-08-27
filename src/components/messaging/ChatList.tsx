// src/components/messaging/ChatList.tsx
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { useGetChatListQuery } from "@/redux/api/messageApi";
import { ChatListItem } from "./ChatListItem";


export function ChatList({
  activeChatId,
  onSelect,
}: {
  activeChatId: string | null;
  onSelect: (chatId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError } = useGetChatListQuery({});
  const entries = data?.data ?? [];

  const filtered = entries.filter((e) => {
    if (!query.trim()) return true;
    const other = e.chat.users[0];
    const name = other?.fullName ?? other?.name ?? "";
    return name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex h-full flex-col border-r border-border">
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}

        {!isLoading && isError && (
          <p className="p-4 text-center text-sm text-muted-foreground">
            Couldn&apos;t load your chats.
          </p>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <p className="p-4 text-center text-sm text-muted-foreground">
            No conversations yet.
          </p>
        )}

        {!isLoading &&
          !isError &&
          filtered.map((entry) => (
            <ChatListItem
              key={entry.chat._id}
              entry={entry}
              active={entry.chat._id === activeChatId}
              onClick={() => onSelect(entry.chat._id)}
            />
          ))}
      </div>
    </div>
  );
}
