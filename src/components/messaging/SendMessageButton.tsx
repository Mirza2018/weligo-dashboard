// src/components/messaging/SendMessageButton.tsx
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useCreateChatMutation } from "@/redux/api/messageApi";

interface SendMessageButtonProps {
  receiverId: string;
  label?: string;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}

export function SendMessageButton({
  receiverId,
  label = "Send Message",
  className,
  variant = "default",
  size = "default",
}: SendMessageButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [createChat, { isLoading }] = useCreateChatMutation();
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    try {
      const res = await createChat({ users: [receiverId] }).unwrap();
      // Land on the right dashboard's message page (/dashboard/family/message
      // or /dashboard/provider/message) regardless of where this button was
      // clicked from.
      const base =
        location.pathname.split("/").slice(0, 3).join("/") ||
        "/dashboard/family";
      navigate(`${base}/message?chatId=${res.data._id}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Couldn't start this conversation.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || pending}
      className={className}
      variant={variant}
      size={size}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </Button>
  );
}
