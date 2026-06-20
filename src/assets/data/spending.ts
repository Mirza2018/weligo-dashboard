export type SpendingSlice = { category: string; amount: number; color: string };

export const spending: SpendingSlice[] = [
  { category: "Childcare", amount: 840, color: "#6d5df6" },
  { category: "Childcare", amount: 200, color: "#8a7df8" },
  { category: "Childcare", amount: 100, color: "#a99ffb" },
  { category: "Childcare", amount: 60, color: "#c4bcfc" },
  { category: "Childcare", amount: 48, color: "#dcd7fd" },
];

export const totalSpending = spending.reduce((s, x) => s + x.amount, 0);
