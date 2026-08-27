// src/pages/DashboardPage/message_page/MessagePage.tsx
import { useSearchParams } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChatList } from "@/components/messaging/ChatList";
import { ConversationView } from "@/components/messaging/ConversationView";
import { CallHistoryList } from "@/components/messaging/CallHistoryList";
// import { CallHistoryList } from "../../../components/messaging/CallHistoryList";

export function MessagePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get("chatId");

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <Tabs defaultValue="messages" className="flex h-full flex-col">
        <TabsList className="w-fit">
          <TabsTrigger value="messages" className="gap-1.5">
            <MessageCircle className="h-4 w-4" /> Messages
          </TabsTrigger>
          <TabsTrigger value="calls" className="gap-1.5">
            <Phone className="h-4 w-4" /> Calls
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="flex-1 overflow-hidden">
          <div className="grid h-full grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[320px_1fr]">
            <div className={chatId ? "hidden md:block" : "block"}>
              <ChatList
                activeChatId={chatId}
                onSelect={(id) => setSearchParams({ chatId: id })}
              />
            </div>
            <div
              className={
                chatId
                  ? "block"
                  : "hidden md:flex md:items-center md:justify-center"
              }
            >
              {chatId ? (
                <ConversationView chatId={chatId} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a conversation to start chatting.
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calls" className="flex-1 overflow-y-auto">
          <CallHistoryList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
