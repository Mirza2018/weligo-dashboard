// src/types/messaging.ts

export interface ChatUserRef {
  _id: string;
  fullName?: string;
  name?: string; // some socket payloads use "name" instead of "fullName"
  email?: string;
  profileImage?: string;
}

export interface Chat {
  _id: string;
  users: ChatUserRef[];
  createdBy: string;
  unreadCounts: number;
  blockedUsers: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatListEntry {
  chat: Chat;
  lastMessage: string;
  lastMessageSender: string;
  unreadMessageCount: number;
  lastMessageCreatedAt: string;
}

export interface ChatListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ChatListEntry[];
}

export interface CreateChatPayload {
  users: string[];
}

export interface CreateChatResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Chat;
}

export interface Message {
  _id: string;
  text: string;
  images: string[];
  readBy: string[];
  seen: boolean;
  sender: ChatUserRef;
  chat: string;
  approvalStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface SingleChatResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Message[];
}

export interface UploadFileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: string[] | null;
}

export type CallType = "audio" | "video";
export type CallStatus =
  | "missed"
  | "completed"
  | "rejected"
  | "answered"
  | string;

export interface CallHistoryEntry {
  _id: string;
  caller: ChatUserRef;
  receiver: ChatUserRef;
  type: CallType;
  status: CallStatus;
  duration: number;
  createdAt: string;
  updatedAt: string;
  endedAt?: string;
}

export interface CallHistoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: { page: number; limit: number; total: number; totalPage: number };
  data: CallHistoryEntry[];
}

/* ---------------- Socket payloads ---------------- */

export interface SendMessagePayload {
  chatId: string;
  text: string;
  images?: string[];
}

export interface NewMessageEvent {
  success: boolean;
  chatId: string;
  sender: { _id: string; name: string; email: string; role: string };
  text: string;
  time?: string;
  images?: string[];
}

export interface OnlineUserEntry {
  socketID: string;
}
export type OnlineUsersPayload = [string, OnlineUserEntry][];

export interface CallIncomingPayload {
  callId: string;
  type: CallType;
  caller: { _id: string; name: string; email: string };
}

export interface CallSdpPayload {
  callId: string;
  sdp: RTCSessionDescriptionInit;
}

export interface CallIceCandidatePayload {
  callId: string;
  candidate: RTCIceCandidateInit;
}

// Shared shape for every "just a callId" event: call:accepted, call:rejected,
// call:cancelled, call:ended, call:missed, call:peer-disconnected.
export interface CallIdPayload {
  callId: string;
}

export interface CallAckResponse {
  success: boolean;
  callId?: string;
  message?: string;
}
