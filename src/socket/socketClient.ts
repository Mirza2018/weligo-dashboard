// src/socket/socketClient.ts
import { io, type Socket } from "socket.io-client";
import { getSocketUrl } from "@/redux/getBaseUrl";

let socketInstance: Socket | null = null;

/** Reuses the existing connection when possible; reconnects with a fresh
 * token otherwise (e.g. after login/logout). */
export function getSocket(token: string): Socket {
  if (socketInstance?.connected) return socketInstance;
  if (socketInstance) socketInstance.disconnect();

  socketInstance = io(getSocketUrl(), {
    auth: { token },
    transports: ["websocket"],
  });
  return socketInstance;
}

export function disconnectSocket() {
  socketInstance?.disconnect();
  socketInstance = null;
}
