export type AccountStatus = "Active" | "Suspended";

export type Family = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joined: string;
  totalBookings: number;
  totalSpent: number;
  status: AccountStatus;
};

export type Provider = {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  city: string;
  completed: number;
  earnings: number;
  rating: number;
  status: AccountStatus;
};

export type Certificate = {
  _id: string;
  type: string;
  description: string;
  imgUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProviderPreferences = {
  nonSmoker: boolean;
  driverLicense: boolean;
  ownVehicle: boolean;
  comfortableWithPets: boolean;
  hasChildren: boolean;
};

export type ProviderProfile = {
  _id: string;
  shortBioTitle?: string;
  shortBio?: string;
  longBioTitle?: string;
  longBio?: string;
  preferences: ProviderPreferences;
  certificates: Certificate[];
  createdAt?: string;
  updatedAt?: string;
};

// Matches the actual `useGetPendingProvidersQuery` API response shape -
// this used to be a flat mock-only shape (name/services/registered) with
// no certificates, bio, or preferences data at all.
export type PendingProvider = {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  profileImage: string;
  city: string;
  postalCode: string;
  address: string;
  referralSource: string;
  dateOfBirth: string | null;
  categoryId: { _id: string; name: string } | null;
  hourlyRate: number;
  experience: number;
  lenguages: string[];
  totalReview: number;
  averageRating: number;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  providerProfileId: ProviderProfile;
  rejectionReason: string;
  status: string;
  isDeleted: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
};

export type AdminBookingStatus = "Active" | "Completed" | "Cancelled";
export type AdminBooking = {
  id: string;
  family: string;
  provider: string;
  service: string;
  date: string;
  time: string;
  status: AdminBookingStatus;
  amount: number;
};

export type AdminTxStatus = "Success" | "Pending" | "Failed";
export type AdminTxType = "Payment" | "Refund" | "Payout";
export type AdminTxMethod = "TWINT" | "Card";
export type AdminTxUserRole = "Family" | "Provider";

export type AdminTransaction = {
  id: string;
  type: AdminTxType;
  userName: string;
  userRole: AdminTxUserRole;
  amount: number;
  method: AdminTxMethod;
  status: AdminTxStatus;
  date: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  active: boolean;
};

export type SupportStatus = "Resolved" | "In Progress" | "Closed";
export type SupportTicket = {
  id: string;
  number: string;
  datetime: string;
  category: string;
  subject: string;
  name: string;
  description: string;
  status: SupportStatus;
};

export type AdminEarning = {
  id: string;
  service: string;
  family: string;
  gross: number;
  commissionPct: number;
  commissionAmount: number;
};

const cities = ["Zürich", "Bern", "Geneva", "Basel", "Lausanne", "Lucerne"];
const serviceList = [
  "Tutoring",
  "Childcare",
  "Cleaning",
  "Cooking",
  "Eldercare",
];
const familyFirst = [
  "Anna",
  "Marco",
  "Lea",
  "Sofia",
  "Luca",
  "Mia",
  "Noah",
  "Elena",
  "Tim",
  "Sara",
  "Jonas",
  "Lisa",
];
const lastNames = [
  "Müller",
  "Keller",
  "Weber",
  "Fischer",
  "Meier",
  "Huber",
  "Schmid",
  "Brunner",
  "Zimmermann",
  "Berger",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export const adminFamilies: Family[] = Array.from({ length: 28 }).map(
  (_, i) => ({
    id: `fam-${i + 1}`,
    name: `${pick(familyFirst, i)} ${pick(lastNames, i + 1)}`,
    email: `family${i + 1}@example.com`,
    phone: `+41 79 ${100 + i} ${(20 + i).toString().padStart(2, "0")} ${(11 + i).toString().padStart(2, "0")}`,
    city: pick(cities, i),
    joined: `${(i % 28) + 1} Jan 2025`,
    totalBookings: 3 + (i % 14),
    totalSpent: 200 + i * 47,
    status: i % 7 === 0 ? "Suspended" : "Active",
  }),
);

export const adminProviders: Provider[] = Array.from({ length: 24 }).map(
  (_, i) => ({
    id: `pro-${i + 1}`,
    name: `${pick(familyFirst, i + 3)} ${pick(lastNames, i)}`,
    email: `provider${i + 1}@example.com`,
    phone: `+41 78 ${200 + i} ${(15 + i).toString().padStart(2, "0")} ${(33 + i).toString().padStart(2, "0")}`,
    services: [pick(serviceList, i), pick(serviceList, i + 2)],
    city: pick(cities, i + 1),
    completed: 5 + (i % 40),
    earnings: 800 + i * 137,
    rating: 4 + ((i * 13) % 10) / 10,
    status: i % 9 === 0 ? "Suspended" : "Active",
  }),
);

// Mock data updated to match the real PendingProvider shape above, so any
// screen still wired to this mock array (rather than
// useGetPendingProvidersQuery) keeps working with certificates/bio/
// preferences included.
const mockPreferences: ProviderPreferences[] = [
  {
    nonSmoker: true,
    driverLicense: true,
    ownVehicle: false,
    comfortableWithPets: true,
    hasChildren: false,
  },
  {
    nonSmoker: true,
    driverLicense: false,
    ownVehicle: false,
    comfortableWithPets: false,
    hasChildren: true,
  },
  {
    nonSmoker: false,
    driverLicense: true,
    ownVehicle: true,
    comfortableWithPets: true,
    hasChildren: true,
  },
];

const mockCertificateTemplates: Omit<Certificate, "_id">[] = [
  {
    type: "First Aid Certificate",
    description: "Certified in pediatric first aid and CPR.",
    imgUrl: "",
  },
  {
    type: "Background Check Cleared",
    description: "Passed a full criminal background check.",
    imgUrl: "",
  },
];

export const pendingProviders: PendingProvider[] = Array.from({
  length: 9,
}).map((_, i) => {
  const firstName = pick(familyFirst, i + 5);
  const lastName = pick(lastNames, i + 3);
  return {
    _id: `pend-${i + 1}`,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: `pending${i + 1}@example.com`,
    phone: `+41 76 ${300 + i} 12 34`,
    profileImage: "",
    city: pick(cities, i + 2),
    postalCode: "",
    address: "",
    referralSource: "Family",
    dateOfBirth: null,
    categoryId: {
      _id: `cat-${(i % serviceList.length) + 1}`,
      name: pick(serviceList, i + 1),
    },
    hourlyRate: 25 + (i % 10),
    experience: 1 + (i % 6),
    lenguages: ["English"],
    totalReview: 0,
    averageRating: 0,
    location: { type: "Point", coordinates: [0, 0] },
    providerProfileId: {
      _id: `pp-${i + 1}`,
      shortBioTitle: "",
      shortBio: "",
      longBioTitle: "",
      longBio: "",
      preferences: pick(mockPreferences, i),
      certificates: mockCertificateTemplates.map((c, ci) => ({
        ...c,
        _id: `pend-${i + 1}-cert-${ci + 1}`,
      })),
    },
    rejectionReason: "",
    status: "active",
    isDeleted: false,
    approvalStatus: "pending",
    createdAt: `2026-05-${((i % 28) + 1).toString().padStart(2, "0")}T00:00:00.000Z`,
    updatedAt: `2026-05-${((i % 28) + 1).toString().padStart(2, "0")}T00:00:00.000Z`,
  };
});

const adminStatuses: AdminBookingStatus[] = [
  "Active",
  "Completed",
  "Cancelled",
];
export const adminBookings: AdminBooking[] = Array.from({ length: 30 }).map(
  (_, i) => ({
    id: `BKG-${2300 + i}`,
    family: adminFamilies[i % adminFamilies.length].name,
    provider: adminProviders[i % adminProviders.length].name,
    service: pick(serviceList, i),
    date: `${(i % 28) + 1} Jun 2026`,
    time: "10:00 – 12:00",
    status: pick(adminStatuses, i),
    amount: 60 + i * 7,
  }),
);

const txTypes: AdminTxType[] = ["Payment", "Refund", "Payout"];
const txStatuses: AdminTxStatus[] = ["Success", "Pending", "Failed"];
const txMethods: AdminTxMethod[] = ["TWINT", "Card"];

export const adminTransactions: AdminTransaction[] = Array.from({
  length: 26,
}).map((_, i) => ({
  id: `TXN-${5000 + i}`,
  type: pick(txTypes, i),
  userName:
    i % 2 === 0
      ? adminFamilies[i % adminFamilies.length].name
      : adminProviders[i % adminProviders.length].name,
  userRole: i % 2 === 0 ? "Family" : "Provider",
  amount: 50 + i * 11,
  method: pick(txMethods, i),
  status: pick(txStatuses, i),
  date: `${(i % 28) + 1} Jun 2026`,
}));

export const initialCategories: Category[] = serviceList.map((s, i) => ({
  id: `cat-${i + 1}`,
  name: s,
  description: `${s} services across Switzerland.`,
  icon: "🧩",
  image: "",
  active: true,
}));

const supportCategories = ["Payment Issue", "Account", "Booking", "Other"];
const supportStatuses: SupportStatus[] = ["Resolved", "In Progress", "Closed"];
export const supportTickets: SupportTicket[] = Array.from({ length: 12 }).map(
  (_, i) => ({
    id: `tkt-${i + 1}`,
    number: `TKT-${1200 + i}`,
    datetime: `${(i % 28) + 1} Jun 2026, 10:${(10 + i).toString().padStart(2, "0")}`,
    category: pick(supportCategories, i),
    subject: `Issue regarding ${pick(["payout", "booking", "login", "refund"], i)}`,
    name: adminFamilies[i % adminFamilies.length].name,
    description:
      "I'm experiencing a problem with my recent booking. Could the team please look into this and reply?",
    status: pick(supportStatuses, i),
  }),
);

export const adminEarnings: AdminEarning[] = Array.from({ length: 24 }).map(
  (_, i) => {
    const gross = 80 + i * 9;
    const pct = 15;
    return {
      id: `BKG-${2300 + i}`,
      service: pick(serviceList, i),
      family: adminFamilies[i % adminFamilies.length].name,
      gross,
      commissionPct: pct,
      commissionAmount: Math.round((gross * pct) / 100),
    };
  },
);

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function yearStats(year: number) {
  const seed = year % 100;
  return months.map((m, i) => ({
    month: m,
    bookings: 40 + ((i * 7 + seed) % 80),
    earnings: 2000 + ((i * 311 + seed * 50) % 5000),
  }));
}

export const adminTotals = {
  families: adminFamilies.length,
  providers: adminProviders.length,
  activeBookings: adminBookings.filter((b) => b.status === "Active").length,
  monthRevenue: 18450,
  pending: pendingProviders.length,
};
