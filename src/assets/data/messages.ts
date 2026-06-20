export type Message = {
  id: string;
  sender: string;
  snippet: string;
  date: string;
  unread: number;
  verified: boolean;
};

export const recentMessages: Message[] = [
  { id: "m1", sender: "Simon Keller", snippet: "Sounds good- see you Saturday at 9", date: "15 may", unread: 2, verified: true },
  { id: "m2", sender: "Simon Keller", snippet: "Sounds good- see you Saturday at 9", date: "15 may", unread: 2, verified: true },
  { id: "m3", sender: "Simon Keller", snippet: "Sounds good- see you Saturday at 9", date: "15 may", unread: 2, verified: true },
];
