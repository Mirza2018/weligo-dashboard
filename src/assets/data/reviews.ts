export type Review = {
  id: string;
  providerName: string;
  rating: number;
  comment: string;
  providerReply?: string;
};

export const reviews: Review[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `rv-${i + 1}`,
  providerName: "Nina Collin",
  rating: 5,
  comment:
    "Lorem ipsum dolor sit amet consectetur. Ac leo egestas at risus, faucibus quis.",
  providerReply:
    i % 4 === 1
      ? undefined
      : "Lorem ipsum dolor sit amet consectetur. Ac leo egestas at risus.",
}));
