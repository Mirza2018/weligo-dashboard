// src/components/messaging/IncomingCallModal.tsx
import { Phone, PhoneOff, Video } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useSocketContext } from "@/socket/SocketProvider";

export function IncomingCallModal() {
  const { call, acceptCall, rejectCall } = useSocketContext();

  if (call.phase !== "incoming-ringing") return null;

  return (
    <Dialog open onOpenChange={(open) => !open && rejectCall()}>
      <DialogContent
        className="max-w-sm text-center"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            Incoming {call.type === "video" ? "video" : "voice"} call
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
            {call.peerName?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <p className="font-serif text-xl font-medium">
            {call.peerName || "Unknown caller"}
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="destructive"
            size="icon"
            className="h-14 w-14 rounded-full"
            aria-label="Decline call"
            onClick={rejectCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600"
            aria-label="Accept call"
            onClick={acceptCall}
          >
            {call.type === "video" ? (
              <Video className="h-6 w-6" />
            ) : (
              <Phone className="h-6 w-6" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
