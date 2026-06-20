export type TxStatus = "paid" | "refunded" | "pending";

export type Transaction = {
  id: string;
  bookingId: string;
  date: string;
  providerName: string;
  amount: number;
  status: TxStatus;
};

export const transactions: Transaction[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `tx-${i + 1}`,
  bookingId: "2345",
  date: "2nd June , 2016",
  providerName: "Nina Collin",
  amount: 63,
  status: i === 2 ? "refunded" : "paid",
}));
