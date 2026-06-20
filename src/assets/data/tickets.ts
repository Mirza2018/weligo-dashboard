export type TicketStatus = "open" | "inProgress" | "resolved";

export type Ticket = {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  openedAt: string;
  updatedAt: string;
};

export const tickets: Ticket[] = [
  {
    id: "t1",
    subject: "Provider was 45 minutes late",
    description:
      "Laura S. arrived 45 minutes late for our booking on 18 May. My daughter was very upset and...",
    status: "inProgress",
    openedAt: "Opened 18 May 2024 · 14:32",
    updatedAt: "Updated 19 May 2024 · 09:15",
  },
  {
    id: "t2",
    subject: "Provider was 45 minutes late",
    description:
      "Laura S. arrived 45 minutes late for our booking on 18 May. My daughter was very upset and...",
    status: "open",
    openedAt: "Opened 18 May 2024 · 14:32",
    updatedAt: "Updated 19 May 2024 · 09:15",
  },
  {
    id: "t3",
    subject: "Provider was 45 minutes late",
    description:
      "Laura S. arrived 45 minutes late for our booking on 18 May. My daughter was very upset and...",
    status: "resolved",
    openedAt: "Opened 18 May 2024 · 14:32",
    updatedAt: "Updated 19 May 2024 · 09:15",
  },
];

export const issueTypes = [
  "Booking issue",
  "Payment problem",
  "Provider behavior",
  "Account & login",
  "Other",
];
