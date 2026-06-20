export type EarningStatus = "pending" | "paidOut";

export type Earning = {
  id: string;
  clientName: string;
  date: string;
  gross: number;
  commission: number;
  netPayout: number;
  status: EarningStatus;
};

export const earnings: Earning[] = Array.from({ length: 32 }).map((_, i) => ({
  id: `${2345 + i}`,
  clientName: "Nina Collin",
  date: "2nd June, 2016",
  gross: 120,
  commission: -18,
  netPayout: 102,
  status: i < 4 ? "pending" : "paidOut",
}));

export const totalEarned = earnings.reduce((s, e) => s + e.netPayout, 0);
export const pendingPayout = earnings
  .filter((e) => e.status === "pending")
  .reduce((s, e) => s + e.netPayout, 0);
