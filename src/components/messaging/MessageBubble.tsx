// src/components/messaging/MessageBubble.tsx
import { getImageUrl } from "@/redux/getBaseUrl";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/messaging";

export function MessageBubble({
  message,
  isMine,
}: {
  message: Message;
  isMine: boolean;
}) {
  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
          isMine
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted text-foreground",
        )}
      >
        {message.images.length > 0 && (
          <div className="mb-1.5 grid grid-cols-2 gap-1.5">
            {message.images.map((img) => (
              <img
                key={img}
                src={getImageUrl(img) ?? undefined}
                alt="Attachment"
                className="h-28 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}
        {message.text && (
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        )}
        <p
          className={cn(
            "mt-1 text-[10px]",
            isMine ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {isMine && (message.seen ? " · Seen" : "")}
        </p>
      </div>
    </div>
  );
}
