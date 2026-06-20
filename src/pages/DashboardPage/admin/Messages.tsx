import { useState } from "react";
import {
  Phone,
  Video,
  Paperclip,
  Send,
  Search,
  Check,
  CheckCheck,
  FileText,
} from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { UserAvatar } from "@/components/common/UserAvatar";
// import { chatThreads, type ChatThread } from "@/assets/data/chats";
// import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { chatThreads, type ChatThread } from "../../../assets/data/chats";
import { Input } from "../../../components/ui/input";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { cn } from "../../../lib/utils";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";

export function AdminMessagesPage() {
  const [activeId, setActiveId] = useState(chatThreads[4].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const active = chatThreads.find((c) => c.id === activeId)!;
  const filtered = chatThreads.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  const send = () => {
    if (!draft.trim()) return;
    toast.success("Message sent");
    setDraft("");
  };

  return (
    <div className="grid h-[calc(100vh-7rem)] grid-cols-1 gap-4 md:grid-cols-[360px_1fr]">
      <aside className="flex min-h-0 flex-col rounded-2xl border border-border bg-card">
        <div className="p-5">
          <h2 className="font-serif text-3xl font-medium text-foreground">
            Message
          </h2>
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {filtered.map((t) => (
            <ThreadItem
              key={t.id}
              thread={t}
              active={t.id === activeId}
              onClick={() => setActiveId(t.id)}
            />
          ))}
        </div>
      </aside>

      <section className="flex min-h-0 flex-col rounded-2xl border border-border bg-card">
        <header className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <UserAvatar name={active.name} size={40} />
            <div>
              <p className="font-medium text-foreground">{active.name}</p>
              <p className="text-xs text-muted-foreground">{active.handle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconBtn label="Call">
              <Phone className="h-4 w-4" />
            </IconBtn>
            <IconBtn label="Video">
              <Video className="h-4 w-4" />
            </IconBtn>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {active.messages.map((m) => (
            <div key={m.id} className="mb-4">
              {m.dayLabel && (
                <div className="my-3 text-center text-xs text-muted-foreground">
                  {m.dayLabel}
                </div>
              )}
              <div
                className={cn(
                  "flex",
                  m.fromMe ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-3 text-sm",
                    m.fromMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.attachment ? (
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-card text-primary">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-medium">{m.attachment.name}</p>
                        <p className="text-xs opacity-70">
                          {m.attachment.size} · {m.attachment.ext}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  )}
                  <div
                    className={cn(
                      "mt-1 flex items-center justify-end gap-1 text-[10px]",
                      m.fromMe ? "opacity-80" : "text-muted-foreground",
                    )}
                  >
                    {m.time}
                    <CheckCheck className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2 rounded-xl border border-border bg-muted/30 p-2">
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-foreground"
              aria-label="Attach"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <Textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Send a message..."
              className="min-h-9 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button onClick={send} className="gap-2">
              Send <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function IconBtn({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-secondary/80"
    >
      {children}
    </button>
  );
}

function ThreadItem({
  thread,
  active,
  onClick,
}: {
  thread: ChatThread;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl p-3 text-left transition",
        active ? "bg-secondary" : "hover:bg-muted",
      )}
    >
      <div className="relative">
        <UserAvatar name={thread.name} size={40} />
        {thread.online && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate font-medium text-foreground">{thread.name}</p>
          <span className="text-xs text-muted-foreground">{thread.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="truncate text-sm text-muted-foreground">
            {thread.lastMessage}
          </p>
          {thread.unread ? (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground">
              {thread.unread > 99 ? "999" : thread.unread}
            </span>
          ) : (
            <Check className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </div>
    </button>
  );
}
