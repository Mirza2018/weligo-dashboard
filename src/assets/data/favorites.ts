export type Favorite = {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  location: string;
  distanceKm: number;
  service: string;
  hourlyRate: number;
  availableToday: boolean;
};

export const favorites: Favorite[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `f${i + 1}`,
  name: "Simon Keller",
  rating: 5,
  reviewCount: 128,
  verified: true,
  location: "Zürich, 8001",
  distanceKm: 0.8,
  service: "Childcare",
  hourlyRate: 30,
  availableToday: true,
}));
