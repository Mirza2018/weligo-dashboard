// src/components/messaging/ConversationView.tsx
import {
  useGetChatListQuery,
  useGetSingleChatQuery,
} from "@/redux/api/messageApi";
// import { useCurrentUser } from "@/lib/currentUser";
import { ConversationHeader } from "./Conversationheader";
import { useCurrentUser } from "@/redux/lib/currentUser";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Skeleton } from "../ui/skeleton";

export function ConversationView({ chatId }: { chatId: string }) {
  const currentUser = useCurrentUser();
  const { data: chatListData } = useGetChatListQuery({});
  const { data: messagesData, isLoading } = useGetSingleChatQuery(chatId);

  const entry = chatListData?.data.find((e) => e.chat._id === chatId);
  const other = entry?.chat.users[0];
  const messages = messagesData?.data?.data ?? [];

  return (
    <div className="flex h-full flex-col">
      {entry ? (
        <ConversationHeader other={other} />
      ) : (
        <div className="border-b border-border px-4 py-3">
          <Skeleton className="h-10 w-40" />
        </div>
      )}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        currentUserId={currentUser?.userId}
      />
      <MessageInput chatId={chatId} />
    </div>
  );
}
