// src/socket/SocketProvider.tsx
//
// Call event contract (from the backend):
//
// Client emits (all with ack callbacks):
//   call:initiate      { receiverId, type }              -> ack { success, callId, message? }
//   call:offer         { callId, sdp }
//   call:answer        { callId, sdp }
//   call:ice-candidate { callId, candidate }
//   call:reject        { callId }   - receiver declines a ringing (not yet answered) call
//   call:cancel        { callId }   - caller cancels before the receiver answers
//   call:end           { callId }   - either side ends an already-connected call
//
// Server emits (listen-only):
//   call:incoming, call:missed, call:offer, call:answer, call:accepted,
//   call:ice-candidate, call:rejected, call:cancelled, call:ended,
//   call:peer-disconnected
//
// The important distinction: declining, cancelling, and hanging up an
// active call are three DIFFERENT client emits depending on where the call
// is in its lifecycle - and the server's "it's over" notification is
// `call:ended`, not `call:end` (that's a client emit name, never sent back).

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import type { RootState } from "@/redux/store";
import { getSocket, disconnectSocket } from "./socketClient";
import { messageApi } from "@/redux/api/messageApi";
import { tagTypes } from "@/redux/tagTypes";
import { IncomingCallModal } from "@/components/messaging/IncomingCallModal";
import { ActiveCallOverlay } from "@/components/messaging/ActiveCallOverlay";
import type {
  CallAckResponse,
  CallIceCandidatePayload,
  CallIdPayload,
  CallIncomingPayload,
  CallSdpPayload,
  CallType,
  NewMessageEvent,
  OnlineUsersPayload,
} from "@/types/messaging";

type CallPhase =
  | "idle"
  | "outgoing-ringing"
  | "incoming-ringing"
  | "connecting"
  | "connected"
  | "ended";

export interface ActiveCallState {
  phase: CallPhase;
  callId: string | null;
  type: CallType;
  isCaller: boolean;
  peerId: string;
  peerName: string;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

const IDLE_CALL: ActiveCallState = {
  phase: "idle",
  callId: null,
  type: "audio",
  isCaller: false,
  peerId: "",
  peerName: "",
  localStream: null,
  remoteStream: null,
};

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  onlineUserIds: Set<string>;
  call: ActiveCallState;
  startCall: (receiverId: string, receiverName: string, type: CallType) => void;
  acceptCall: () => void;
  /** Decline a call that's ringing but not yet answered (either side). */
  rejectCall: () => void;
  /** Hang up - cancels if still ringing (caller), ends if connected. */
  endCall: () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [call, setCall] = useState<ActiveCallState>(IDLE_CALL);

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const pendingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  // Mirrors `call` so the beforeunload/unmount cleanup effect (which only
  // runs once) can always see the latest phase/callId without re-binding.
  const callRef = useRef(call);
  useEffect(() => {
    callRef.current = call;
  }, [call]);

  const cleanupCall = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    pendingOfferRef.current = null;
    pendingIceRef.current = [];
    setCall((c) => {
      c.localStream?.getTracks().forEach((t) => t.stop());
      return IDLE_CALL;
    });
  }, []);

  const createPeerConnection = useCallback((callId: string) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current?.emit("call:ice-candidate", {
          callId,
          candidate: e.candidate.toJSON(),
        });
      }
    };
    pc.ontrack = (e) => {
      setCall((c) => ({ ...c, remoteStream: e.streams[0] }));
    };
    pcRef.current = pc;
    return pc;
  }, []);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      socketRef.current = null;
      setIsConnected(false);
      return;
    }

    const socket = getSocket(token);
    socketRef.current = socket;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleOnlineUsers = (payload: OnlineUsersPayload) => {
      setOnlineUserIds(new Set(payload.map(([id]) => id)));
    };

    // Messages arrive over the socket, not via RTK Query - invalidating the
    // shared "chat" tag refetches both the chat list and any open
    // conversation automatically (they both provide that same tag).
    const handleNewMessage = (_payload: NewMessageEvent) => {
      dispatch(messageApi.util.invalidateTags([tagTypes.chat]));
    };

    const handleCallIncoming = (payload: CallIncomingPayload) => {
      setCall({
        phase: "incoming-ringing",
        callId: payload.callId,
        type: payload.type,
        isCaller: false,
        peerId: payload.caller._id,
        peerName: payload.caller.name,
        localStream: null,
        remoteStream: null,
      });
    };

    // Stash the offer - we don't touch the mic/camera until the person
    // actually accepts, so declining a call never prompts for permissions.
    const handleCallOffer = (payload: CallSdpPayload) => {
      pendingOfferRef.current = payload.sdp;
    };

    const handleCallAnswer = async (payload: CallSdpPayload) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(payload.sdp),
      );
      setCall((c) => (c.phase === "idle" ? c : { ...c, phase: "connected" }));
    };

    const handleCallIceCandidate = async (payload: CallIceCandidatePayload) => {
      if (pcRef.current?.remoteDescription) {
        await pcRef.current.addIceCandidate(payload.candidate).catch(() => {});
      } else {
        pendingIceRef.current.push(payload.candidate);
      }
    };

    const handleCallAccepted = () => {
      setCall((c) =>
        c.phase === "outgoing-ringing" ? { ...c, phase: "connecting" } : c,
      );
    };

    // Receiver declined our outgoing call.
    const handleCallRejected = () => {
      toast.info("Call declined");
      cleanupCall();
    };

    // Caller cancelled before we (the receiver) answered.
    const handleCallCancelled = () => {
      toast.info("Call cancelled");
      cleanupCall();
    };

    // The other side ended an already-connected call. This is the event
    // that was missing before - without it, hangups from the other side
    // never reached us and the call UI just stayed open.
    const handleCallEnded = () => {
      toast.info("Call ended");
      cleanupCall();
    };

    const handleCallMissed = () => {
      toast.info("Missed call");
      cleanupCall();
    };

    const handlePeerDisconnected = () => {
      toast.info("The other person disconnected");
      cleanupCall();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("onlineUser", handleOnlineUsers);
    socket.on("newMessage", handleNewMessage);
    socket.on("call:incoming", handleCallIncoming);
    socket.on("call:offer", handleCallOffer);
    socket.on("call:answer", handleCallAnswer);
    socket.on("call:ice-candidate", handleCallIceCandidate);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("call:rejected", handleCallRejected);
    socket.on("call:cancelled", handleCallCancelled);
    socket.on("call:ended", handleCallEnded);
    socket.on("call:missed", handleCallMissed);
    socket.on("call:peer-disconnected", handlePeerDisconnected);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("onlineUser", handleOnlineUsers);
      socket.off("newMessage", handleNewMessage);
      socket.off("call:incoming", handleCallIncoming);
      socket.off("call:offer", handleCallOffer);
      socket.off("call:answer", handleCallAnswer);
      socket.off("call:ice-candidate", handleCallIceCandidate);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("call:rejected", handleCallRejected);
      socket.off("call:cancelled", handleCallCancelled);
      socket.off("call:ended", handleCallEnded);
      socket.off("call:missed", handleCallMissed);
      socket.off("call:peer-disconnected", handlePeerDisconnected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const startCall = useCallback(
    (receiverId: string, receiverName: string, type: CallType) => {
      const socket = socketRef.current;
      if (!socket) return;

      socket.emit(
        "call:initiate",
        { receiverId, type },
        async (ack: CallAckResponse) => {
          if (!ack?.success || !ack.callId) {
            toast.error(ack?.message || "Couldn't start the call.");
            return;
          }
          const callId = ack.callId;
          setCall({
            phase: "outgoing-ringing",
            callId,
            type,
            isCaller: true,
            peerId: receiverId,
            peerName: receiverName,
            localStream: null,
            remoteStream: null,
          });

          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: type === "video",
            });
            setCall((c) =>
              c.callId === callId ? { ...c, localStream: stream } : c,
            );
            const pc = createPeerConnection(callId);
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("call:offer", { callId, sdp: offer });
          } catch {
            toast.error("Couldn't access your camera/microphone.");
            socket.emit("call:cancel", { callId });
            cleanupCall();
          }
        },
      );
    },
    [createPeerConnection, cleanupCall],
  );

  const acceptCall = useCallback(() => {
    const socket = socketRef.current;
    const callId = call.callId;
    const type = call.type;
    if (!socket || !callId) return;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: type === "video",
        });
        const pc = createPeerConnection(callId);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        if (pendingOfferRef.current) {
          await pc.setRemoteDescription(
            new RTCSessionDescription(pendingOfferRef.current),
          );
          for (const candidate of pendingIceRef.current) {
            await pc.addIceCandidate(candidate).catch(() => {});
          }
          pendingIceRef.current = [];
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        // `call:accepted` is a server->client notification, not something we
        // emit - sending `call:answer` is what tells the server we picked up.
        socket.emit("call:answer", { callId, sdp: answer });

        setCall((c) =>
          c.callId === callId
            ? { ...c, phase: "connected", localStream: stream }
            : c,
        );
      } catch {
        toast.error("Couldn't access your camera/microphone.");
        // We were still ringing (never answered) when this failed, so this
        // is a decline, not a hangup.
        socket.emit("call:reject", { callId });
        cleanupCall();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.callId, call.type, createPeerConnection, cleanupCall]);

  // Decline a call that's ringing but not yet answered - works for either
  // side: the receiver declining an incoming call, sent as `call:reject`.
  const rejectCall = useCallback(() => {
    if (call.callId)
      socketRef.current?.emit("call:reject", { callId: call.callId });
    cleanupCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.callId, cleanupCall]);

  // Hang up. Which event this sends depends on where the call is in its
  // lifecycle: still ringing and we're the caller -> cancel; already
  // connected (or past the ringing stage) -> end.
  const endCall = useCallback(() => {
    if (call.callId) {
      if (call.isCaller && call.phase === "outgoing-ringing") {
        socketRef.current?.emit("call:cancel", { callId: call.callId });
      } else {
        socketRef.current?.emit("call:end", { callId: call.callId });
      }
    }
    cleanupCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.callId, call.isCaller, call.phase, cleanupCall]);

  // Safety net: if the tab closes or this provider unmounts mid-call, make
  // sure the server hears about it too, using whichever event fits the
  // call's phase at that moment.
  useEffect(() => {
    const endActiveCallIfAny = () => {
      const c = callRef.current;
      if (!c.callId) return;
      const event =
        c.isCaller && c.phase === "outgoing-ringing"
          ? "call:cancel"
          : c.phase === "incoming-ringing"
            ? "call:reject"
            : "call:end";
      socketRef.current?.emit(event, {
        callId: c.callId,
      } satisfies CallIdPayload);
    };
    window.addEventListener("beforeunload", endActiveCallIfAny);
    return () => {
      window.removeEventListener("beforeunload", endActiveCallIfAny);
      endActiveCallIfAny();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        onlineUserIds,
        call,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
      <IncomingCallModal />
      <ActiveCallOverlay />
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx)
    throw new Error("useSocketContext must be used within <SocketProvider>");
  return ctx;
}
