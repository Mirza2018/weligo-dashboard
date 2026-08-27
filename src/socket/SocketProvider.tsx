// src/socket/SocketProvider.tsx
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
// import { IncomingCallModal } from "@/components/messaging/IncomingCallModal";
// import { ActiveCallOverlay } from "@/components/messaging/ActiveCallOverlay";
import type {
  CallIceCandidatePayload,
  CallIncomingPayload,
  CallInitiateAck,
  CallSdpPayload,
  CallType,
  NewMessageEvent,
  OnlineUsersPayload,
} from "@/types/messaging";
import { IncomingCallModal } from "@/components/messaging/IncomingCallModal";
import { ActiveCallOverlay } from "@/components/messaging/ActiveCallOverlay";

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
  rejectCall: () => void;
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

    const handleCallRejected = () => {
      toast.info("Call declined");
      cleanupCall();
    };

    const handleCallEnd = () => {
      toast.info("Call ended");
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
    socket.on("call:end", handleCallEnd);

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
      socket.off("call:end", handleCallEnd);
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
        async (ack: CallInitiateAck) => {
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
            socket.emit("call:end", { callId });
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
        socket.emit("call:answer", { callId, sdp: answer });
        socket.emit("call:accepted", { callId });

        setCall((c) =>
          c.callId === callId
            ? { ...c, phase: "connected", localStream: stream }
            : c,
        );
      } catch {
        toast.error("Couldn't access your camera/microphone.");
        socket.emit("call:rejected", { callId });
        cleanupCall();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.callId, call.type, createPeerConnection, cleanupCall]);

  const rejectCall = useCallback(() => {
    if (call.callId)
      socketRef.current?.emit("call:rejected", { callId: call.callId });
    cleanupCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.callId, cleanupCall]);

  const endCall = useCallback(() => {
    if (call.callId)
      socketRef.current?.emit("call:end", { callId: call.callId });
    cleanupCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.callId, cleanupCall]);

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
