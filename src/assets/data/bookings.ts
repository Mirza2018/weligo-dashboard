export type BookingStatus =
  | "upcoming"
  | "awaitingConfirmation"
  | "awaitingPayment"
  | "inProgress"
  | "completed"
  | "requested"
  | "pending"
  | "cancelled";


export type Review = {
  rating: number;
  date: string;
  text: string;
  providerReply?: string;
};

export type Booking = {
  id: string;
  code: string;
  providerName: string;
  service: string;
  serviceKey: "tutoring" | "childcare";
  date: string;
  time: string;
  duration: string;
  location: string;
  address: string;
  notes?: string;
  hourlyRate: number;
  hours: number;
  serviceFee: number;
  total: number;
  currency: string;
  status: BookingStatus;
  verified: boolean;
  paymentMethod: "TWINT" | "Card" | "Bank";
  paid: boolean;
  providerLocation: string;
  providerDistanceKm: number;
  providerRating: number;
  providerReviewCount: number;
  reviews?: Review[];
};

const BASE_HOURLY = 30;
const BASE_HOURS = 2;
const BASE_FEE = 3;
const BASE_TOTAL = BASE_HOURLY * BASE_HOURS + BASE_FEE;

function make(
  i: number,
  status: BookingStatus,
  overrides: Partial<Booking> = {},
): Booking {
  return {
    id: `wl-${10240 + i}`,
    code: `WL-${10240 + i}`,
    providerName: "Simon Keller",
    service: "Tutoring",
    serviceKey: "tutoring",
    date: "Sun, 2 Jun 2024",
    time: "10:00 – 12:00",
    duration: "2 hours",
    location: "At our home",
    address: "Musterstrasse 12, 8001 Zürich",
    hourlyRate: BASE_HOURLY,
    hours: BASE_HOURS,
    serviceFee: BASE_FEE,
    total: BASE_TOTAL,
    currency: "CHF",
    status,
    verified: true,
    paymentMethod: "TWINT",
    paid: true,
    providerLocation: "Zürich, 8001",
    providerDistanceKm: 0.8,
    providerRating: 5,
    providerReviewCount: 128,
    ...overrides,
  };
}

export const bookings: Booking[] = [
  make(1, "awaitingConfirmation"),
  make(2, "awaitingConfirmation"),
  make(3, "upcoming"),
  make(4, "upcoming"),
  make(5, "inProgress"),
  make(6, "inProgress"),
  make(7, "inProgress"),
  make(8, "inProgress"),
  make(9, "completed", {
    reviews: [
      {
        rating: 5,
        date: "13 Apr 2026",
        text: '"Laura was fantastic as always. Our daughter absolutely adores her."',
      },
      {
        rating: 5,
        date: "13 Apr 2026",
        text: '"Laura was fantastic as always. Our daughter absolutely adores her."',
        providerReply: '"Thank you Anna, it is always such a joy!"',
      },
    ],
  }),
  make(10, "completed"),
  make(11, "completed"),
  make(12, "requested"),
  make(13, "requested"),
  make(14, "cancelled"),
  make(15, "cancelled"),
];

export const nextBooking: Booking = bookings[2];

export function getBooking(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id || b.code.toLowerCase() === id.toLowerCase());
}
