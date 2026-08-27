// src/components/messaging/MessageInput.tsx
import { useRef, useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useUploadFileMutation } from "@/redux/api/messageApi";
import { useSocketContext } from "@/socket/SocketProvider";

export function MessageInput({ chatId }: { chatId: string }) {
  const { socket } = useSocketContext();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [isSending, setIsSending] = useState(false);

  const handleTyping = () => {
    socket?.emit("typing", { chatId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stopTyping", { chatId });
    }, 1500);
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!text.trim() && files.length === 0) return;
    if (!socket) return;

    setIsSending(true);
    try {
      let imagePaths: string[] = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append("images", f));
        const res = await uploadFile(formData).unwrap();
        imagePaths = res.data ?? [];
      }

      socket.emit("send-message", {
        chatId,
        text: text.trim(),
        images: imagePaths,
      });
      socket.emit("stopTyping", { chatId });

      setText("");
      setFiles([]);
      setPreviews([]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Couldn't send that message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border p-3">
      {previews.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={src} className="relative">
              <img
                src={src}
                alt="Attachment preview"
                className="h-16 w-16 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
                aria-label="Remove attachment"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesSelected}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          aria-label="Attach image"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" />
        </Button>
        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Write a message…"
          rows={1}
          className="min-h-10 flex-1 resize-none"
        />
        <Button
          type="button"
          size="icon"
          className="shrink-0"
          aria-label="Send"
          onClick={handleSend}
          disabled={
            isSending || isUploading || (!text.trim() && files.length === 0)
          }
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
