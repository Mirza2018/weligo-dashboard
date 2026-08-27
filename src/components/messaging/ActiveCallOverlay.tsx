// src/components/messaging/ActiveCallOverlay.tsx
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { Button } from "../ui/button";
import { useSocketContext } from "@/socket/SocketProvider";

export function ActiveCallOverlay() {
  const { call, endCall } = useSocketContext();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  useEffect(() => {
    if (localVideoRef.current)
      localVideoRef.current.srcObject = call.localStream;
  }, [call.localStream]);

  useEffect(() => {
    if (call.type === "video" && remoteVideoRef.current)
      remoteVideoRef.current.srcObject = call.remoteStream;
    if (call.type === "audio" && remoteAudioRef.current)
      remoteAudioRef.current.srcObject = call.remoteStream;
  }, [call.remoteStream, call.type]);

  if (
    call.phase === "idle" ||
    call.phase === "incoming-ringing" ||
    call.phase === "ended"
  )
    return null;

  const toggleMic = () => {
    call.localStream?.getAudioTracks().forEach((t) => (t.enabled = muted));
    setMuted((m) => !m);
  };

  const toggleCamera = () => {
    call.localStream?.getVideoTracks().forEach((t) => (t.enabled = cameraOff));
    setCameraOff((c) => !c);
  };

  const statusLabel =
    call.phase === "outgoing-ringing"
      ? "Ringing…"
      : call.phase === "connecting"
        ? "Connecting…"
        : "Connected";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0f1226] text-white">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {call.type === "video" && call.remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10 text-3xl font-semibold">
              {call.peerName?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <p className="font-serif text-2xl font-medium">{call.peerName}</p>
            <p className="text-sm text-white/70">{statusLabel}</p>
          </div>
        )}

        {call.type === "video" && (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-6 right-6 h-32 w-24 rounded-xl border border-white/20 object-cover shadow-lg sm:h-40 sm:w-32"
          />
        )}
        <audio ref={remoteAudioRef} autoPlay />
      </div>

      <div className="flex items-center justify-center gap-4 bg-black/30 py-6">
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-full"
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={toggleMic}
        >
          {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        {call.type === "video" && (
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full"
            aria-label={cameraOff ? "Turn camera on" : "Turn camera off"}
            onClick={toggleCamera}
          >
            {cameraOff ? (
              <VideoOff className="h-5 w-5" />
            ) : (
              <Video className="h-5 w-5" />
            )}
          </Button>
        )}
        <Button
          variant="destructive"
          size="icon"
          className="h-14 w-14 rounded-full"
          aria-label="End call"
          onClick={endCall}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
