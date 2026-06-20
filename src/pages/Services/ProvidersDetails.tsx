import React from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AllImages from "../../assets/AllImages";

const profileTags = [
  "6 years experience",
  "32 years old",
  "German, English",
  "Non-smoker",
];

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Experience & Qualifications", href: "#experience" },
  { label: "Reviews (128)", href: "#reviews" },
  { label: "Availability", href: "#availability" },
  { label: "Location", href: "#location" },
];

const glanceItems = [
  ["Age", "32 years"],
  ["Experience", "6 years"],
  ["Languages", "German, English"],
  ["Smoker", "No"],
  ["Has Children", "No"],
  ["Drives", "Yes"],
  ["Comfortable with Pets", "Yes"],
];

const qualifications = [
  {
    title: "Six years of childcare experience",
    text: "Worked with 24 Swiss families, children aged 6 months to 12 years.",
  },
  {
    title: "First aid certificate (current)",
    text: "Swiss Red Cross certification, renewed March 2024. Valid through March 2026.",
  },
  {
    title: "Babysitting course (SRK)",
    text: "Swiss Red Cross babysitting programme completed 2019.",
  },
  {
    title: "Experience with infants and toddlers",
    text: "Specialised care for newborns through pre-school age.",
  },
  {
    title: "Creative & educational activities",
    text: "Crafts, music, outdoor games, age-appropriate learning.",
  },
];

const reviews = [
  {
    name: "Anna K.",
    date: "2 days ago",
    text: "Laura is incredible. Our daughter is always thrilled when Laura arrives. Super reliable and absolutely loving.",
    meta: "Booked childcare • 8 hours",
    reply: "Thank you Anna, it is a joy to spend time with your daughter every week!",
  },
  {
    name: "Markus H.",
    date: "7 days ago",
    text: "Our two boys absolutely love Laura. She is creative, punctual and very empathetic. Absolute recommendation.",
    meta: "Booked childcare • 6 hours",
  },
  {
    name: "Sophie T.",
    date: "14 days ago",
    text: "Very friendly and professional. She immediately built a bond with our baby. We book her every week.",
    meta: "Booked childcare • 10 hours",
  },
  {
    name: "Julia M.",
    date: "21 days ago",
    text: "Finally found a childminder I fully trust. Laura is warm, responsible and my kids adore her.",
    meta: "Booked childcare • 4 hours",
    reply: "Thank you Julia, your kids are an absolute delight!",
  },
  {
    name: "Thomas W.",
    date: "30 days ago",
    text: "Professional, reliable, and genuinely caring. Exactly what we needed for our 3-year-old. Highly recommend.",
    meta: "Booked childcare • 12 hours",
  },
  {
    name: "Lisa F.",
    date: "45 days ago",
    text: "Great experience overall. Laura is very warm and attentive. My son was a bit shy at first but opened up quickly.",
    meta: "Booked childcare • 6 hours",
  },
];

const weeklyHours = [
  ["Monday", "08:00 - 18:00", "available"],
  ["Tuesday", "08:00 - 18:00", "available"],
  ["Wednesday", "08:00 - 18:00", "available"],
  ["Thursday", "08:00 - 18:00", "available"],
  ["Friday", "08:00 - 16:00", "available"],
  ["Saturday", "By arrangement", "partial"],
  ["Sunday", "Unavailable", "booked"],
];

const calendarDays = [
  ...Array.from({ length: 13 }, (_, index) => ({
    day: index + 1,
    status: "empty",
  })),
  { day: 14, status: "available" },
  { day: 15, status: "booked" },
  { day: 16, status: "available" },
  { day: 17, status: "available" },
  { day: 18, status: "booked" },
  { day: 19, status: "available" },
  { day: 20, status: "available" },
  { day: 21, status: "booked" },
  { day: 22, status: "available" },
  { day: 23, status: "available" },
  { day: 24, status: "booked" },
  { day: 25, status: "available" },
  { day: 26, status: "available" },
  { day: 27, status: "booked" },
  { day: 28, status: "available" },
  { day: 29, status: "available" },
  { day: 30, status: "booked" },
  { day: 31, status: "available" },
];

const ProvidersDetails = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#F8F9FC] text-[#202126]">
      <HeroSection onBack={() => navigate(-1)} />
      <DetailsNav />

      <div className="mx-auto grid max-w-430 gap-10 px-6 pb-16 pt-13 sm:px-10 lg:grid-cols-[1fr_377px] lg:px-16">
        <div className="min-w-0 space-y-18">
          <OverviewSection />
          <QualificationsSection />
          <ReviewsSection />
          <AvailabilitySection />
          <LocationSection />
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <BookingRequestCard />
        </aside>
      </div>
    </main>
  );
};

function HeroSection({ onBack }: { onBack: () => void }) {
  return (
    <section className="bg-[#EEF0FF]">
      <div className="mx-auto max-w-430 px-6 py-4 sm:px-10 lg:px-19.75">
        <div className="flex items-center justify-between">
          <IconButton
            label="Go back"
            icon={ChevronLeft}
            variant="solid"
            onClick={onBack}
          />
          <IconButton label="Report profile" icon={Flag} />
        </div>

        <div className="grid items-end gap-12 pt-3 lg:grid-cols-[1fr_1.02fr]">
          <ProfileSummary />
          <HeroImage />
        </div>
      </div>
    </section>
  );
}

function IconButton({
  label,
  icon: Icon,
  variant = "outline",
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "solid" | "outline";
  onClick?: () => void;
}) {
  const isSolid = variant === "solid";

  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 ${
        isSolid
          ? "bg-primary text-primary-foreground"
          : "border border-primary text-primary"
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function ProfileSummary() {
  return (
    <div className="max-w-[545px] pb-3">
      <ProfileAvatar src={AllImages.s1} alt="Simon Keller" />

      <div className="mt-5">
        <h1 className="max-w-[210px] font-serif text-[58px] font-semibold leading-[1.05] tracking-tight text-[#1E1E22] sm:text-[62px]">
          Simon
          <br />
          <span className="font-serif-italic">Keller</span>
          <span className="ml-1 inline-block h-2.5 w-2.5 rounded-full bg-primary align-middle" />
        </h1>

        <RatingRow rating="5" reviews="128 Reviews" />
        <LocationRow location={"Z\u00FCrich, 8001"} distance="0.8km away" />

        <h2 className="mt-8 font-serif text-[28px] font-semibold leading-tight text-[#1E1E22]">
          Loving and experienced child caretaker.
        </h2>

        <p className="mt-5 max-w-[530px] font-sans text-xl leading-[1.35] text-[#2F3037]">
          I have been caring for children for over six years and it is my
          passion to accompany them in their development and to create beautiful
          moments for them...
        </p>

        <div className="mt-4 flex flex-wrap gap-1">
          {profileTags.map((tag) => (
            <TagPill key={tag}>{tag}</TagPill>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-[166px] w-[166px]">
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded-full object-cover"
      />
      <span className="absolute bottom-2 right-3 h-6 w-6 rounded-full border-2 border-[#EEF0FF] bg-[#22C55E]" />
    </div>
  );
}

function RatingRow({
  rating,
  reviews,
}: {
  rating: string;
  reviews: string;
}) {
  return (
    <div className="mt-4 flex items-center gap-2 font-serif text-xl text-[#1E1E22]">
      <StarRating size="sm" />
      <span>
        {rating} ({reviews})
      </span>
    </div>
  );
}

function LocationRow({
  location,
  distance,
}: {
  location: string;
  distance: string;
}) {
  return (
    <div className="mt-3 flex items-center gap-2 font-sans text-lg font-semibold text-[#363842]">
      <MapPin className="h-5 w-5" />
      <span>
        {location} {"\u2022"} {distance}
      </span>
    </div>
  );
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-lg bg-primary px-4 py-3 font-sans text-sm font-bold text-primary-foreground">
      {children}
    </span>
  );
}

function HeroImage() {
  return (
    <div className="overflow-hidden rounded-bl-[18px] rounded-br-[80px] rounded-tl-[140px] rounded-tr-[18px]">
      <img
        src={AllImages.s2}
        alt="Caretaker with child"
        className="h-[615px] w-full object-cover"
      />
    </div>
  );
}

function DetailsNav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-transparent bg-[#F8F9FC]/95 backdrop-blur">
      <div className="mx-auto flex max-w-430 gap-7 overflow-x-auto px-6 pt-8 sm:px-10 lg:px-16">
        {navItems.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className={`shrink-0 border-b-3 pb-2 font-sans text-lg font-bold ${
              index === 0
                ? "border-primary text-[#303139]"
                : "border-transparent text-[#5E6068]"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function OverviewSection() {
  return (
    <section id="overview" className="scroll-mt-28">
      <SectionKicker>About Simon</SectionKicker>
      <div className="grid gap-9 lg:grid-cols-[1fr_310px]">
        <div>
          <SectionTitle>
            [Six years] caring for the kids of Z{"\u00FC"}rich.
          </SectionTitle>
          <div className="mt-8 max-w-[520px] space-y-5 font-sans text-xl leading-[1.18] text-[#2F3037]">
            <p>
              I have been caring for children for over six years and it is my
              passion to accompany them in their development and to create
              beautiful moments for them.
            </p>
            <p>
              I believe every child deserves a safe, warm, and stimulating
              environment.
            </p>
            <blockquote className=" py-2  font-serif-italic text-xl font-semibold leading-tight text-[#1E1E22]">
              What I love most is watching a child's confidence grow over weeks
              of working together.
            </blockquote>
            <p>
              In my free time I love hiking in the Alps, reading, and
              practising yoga.
            </p>
          </div>
        </div>
        <AtGlanceCard />
      </div>
    </section>
  );
}

function AtGlanceCard() {
  return (
    <InfoCard className="mt-24 bg-[#EEF0FF] p-4.5">
      <SectionKicker>At a glance</SectionKicker>
      <div className="mt-4 divide-y divide-border">
        {glanceItems.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-4">
            <span className="font-sans text-lg text-[#60616A]">{label}</span>
            <span className="font-sans text-lg font-bold text-[#202126]">
              {value}
            </span>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}

function BookingRequestCard() {
  return (
    <InfoCard className="bg-white p-4 sm:p-6">
      <div className="font-serif text-[44px] font-semibold leading-none text-primary">
        CHF 30 <span className="font-sans text-xl text-[#44454C]">/ hour</span>
      </div>

      <p className="mt-6 flex items-center gap-2 font-sans text-base font-bold text-[#22C55E]">
        <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
        Available Today
      </p>

      <button className="mt-5 flex h-11 w-full items-center justify-between rounded-lg border border-border bg-white px-3 font-sans text-sm font-bold text-[#303139]">
        <span className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5" />
          Pick your Dates
        </span>
        <ChevronRight className="h-5 w-5" />
      </button>

      <button className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary font-sans text-sm font-bold text-primary-foreground">
        Send booking request
        <ArrowRight className="h-5 w-5" />
      </button>

      <button className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-primary bg-white font-sans text-sm font-bold text-primary">
        <MessageCircle className="h-5 w-5" />
        Send message
      </button>

      <button className="mx-auto mt-5 flex items-center justify-center gap-2 font-sans text-sm font-bold text-[#24252A]">
        <Heart className="h-5 w-5" />
        Add to favorites
      </button>

      <div className="mt-7 space-y-4 border-t border-border pt-7">
        <TrustItem icon={ShieldCheck} label="Verified Profile" />
        <TrustItem icon={CreditCard} label="Secure payment" />
        <TrustItem icon={Check} label="Cancel 24h free" />
      </div>
    </InfoCard>
  );
}

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 font-sans text-sm font-bold">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D7FBE6] text-[#22C55E]">
        <Icon className="h-5 w-5" />
      </span>
      {label}
    </div>
  );
}

function QualificationsSection() {
  return (
    <section id="experience" className="scroll-mt-28">
      <SectionKicker>Experience & Qualifications</SectionKicker>
      <SectionTitle>Trained. Certified. Trusted.</SectionTitle>
      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_336px]">
        <InfoCard className="bg-white px-8 py-8">
          <div className="divide-y divide-border">
            {qualifications.map((item, index) => (
              <NumberedDetail key={item.title} index={index + 1} {...item} />
            ))}
          </div>
        </InfoCard>
        <CertificateCard />
      </div>
    </section>
  );
}

function NumberedDetail({
  index,
  title,
  text,
}: {
  index: number;
  title: string;
  text: string;
}) {
  return (
    <div className="grid grid-cols-[48px_1fr] gap-4 py-7 first:pt-0 last:pb-0">
      <span className="font-serif text-4xl text-[#C7C9CF]">
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <h3 className="font-serif text-xl font-semibold text-[#1E1E22]">
          {title}
        </h3>
        <p className="mt-2 font-sans text-base leading-relaxed text-[#555866]">
          {text}
        </p>
      </div>
    </div>
  );
}

function CertificateCard() {
  return (
    <InfoCard className="self-start bg-white p-8">
      <h3 className="font-serif text-2xl font-semibold">First Aid Certified</h3>
      <img
        src={AllImages.s3}
        alt="First aid certificate"
        className="mt-5 h-[205px] w-full rounded-xl object-cover"
      />
      <p className="mt-4 font-mono text-xs leading-relaxed text-[#9CA0AE]">
        Issued March 2024 {"\u2022"} Valid through March 2026
      </p>
    </InfoCard>
  );
}

function ReviewsSection() {
  return (
    <section id="reviews" className="scroll-mt-28">
      <SectionKicker>Reviews</SectionKicker>
      <h2 className="font-serif text-[32px] font-semibold leading-tight text-[#1E1E22]">
        [128 reviews,] 5 average.
      </h2>
      <div className="mt-8 grid gap-5 lg:grid-cols-[280px_1fr_1fr]">
        <ReviewStatsCard />
        <div className="space-y-4">
          {reviews
            .filter((_, index) => index % 2 === 0)
            .map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
        </div>
        <div className="space-y-4">
          {reviews
            .filter((_, index) => index % 2 === 1)
            .map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
        </div>
      </div>
    </section>
  );
}

function ReviewStatsCard() {
  const rows = [
    ["5 stars", "98%", "w-[98%]"],
    ["4 stars", "2%", "w-[18%]"],
    ["3 stars", "0%", "w-[0%]"],
    ["2 stars", "0%", "w-[0%]"],
    ["1 stars", "0%", "w-[0%]"],
  ];

  return (
    <InfoCard className="self-start bg-[#EEF0FF] p-7">
      <div className="font-serif text-[64px] font-semibold leading-none text-primary">
        5
      </div>
      <StarRating className="mt-7" />
      <p className="mt-4 font-mono text-[10px] leading-tight text-[#9CA0AE]">
        Based on 128 verified reviews
      </p>
      <div className="mt-5 space-y-2">
        {rows.map(([label, value, width]) => (
          <div key={label} className="grid grid-cols-[44px_1fr_30px] gap-2">
            <span className="font-sans text-xs">{label}</span>
            <span className="mt-1 h-2 rounded-full bg-[#DDE1EE]">
              <span
                className={`block h-full rounded-full bg-primary ${width}`}
              />
            </span>
            <span className="text-right font-sans text-xs">{value}</span>
          </div>
        ))}
      </div>
      <button className="mt-7 h-10 w-full rounded-full bg-primary font-sans text-xs font-bold text-primary-foreground">
        Give Review
      </button>
    </InfoCard>
  );
}

function ReviewCard({
  name,
  date,
  text,
  meta,
  reply,
}: {
  name: string;
  date: string;
  text: string;
  meta: string;
  reply?: string;
}) {
  return (
    <InfoCard className="bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="h-7 w-7 shrink-0 rounded-full bg-[#A92A2A]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-serif text-sm font-semibold">{name}</p>
            <span className="font-mono text-[10px] text-[#9CA0AE]">{date}</span>
          </div>
          <StarRating size="xs" />
        </div>
      </div>
      <p className="mt-3 font-serif-italic text-black text-sm font-semibold leading-relaxed">
        {text}
      </p>
      <p className="mt-4 font-mono text-[10px] text-[#9CA0AE]">{meta}</p>
      {reply ? (
        <div className="mt-4 border-l-3 border-primary bg-[#FAF9F6] px-3 py-3 font-sans text-[11px] leading-snug text-[#555866] rounded-e-sm">
          {reply}
        </div>
      ) : null}
    </InfoCard>
  );
}

function AvailabilitySection() {
  return (
    <section id="availability" className="scroll-mt-28">
      <SectionKicker>Availability</SectionKicker>
      <h2 className="font-serif text-[34px] font-semibold leading-tight">
        When <span className="font-serif-italic text-primary">Simon</span> is
        free.
      </h2>
      <div className="mt-5 grid gap-5 lg:grid-cols-[190px_274px]">
        <WeeklyHoursCard />
        <CalendarCard />
      </div>
    </section>
  );
}

function WeeklyHoursCard() {
  return (
    <InfoCard className="bg-white p-5">
      <SectionKicker className="text-[9px]">Weekly Hours</SectionKicker>
      <div className="mt-4 divide-y divide-border">
        {weeklyHours.map(([day, time, status]) => (
          <div key={day} className="flex items-center justify-between py-3">
            <span className="flex items-center gap-2 font-serif text-xs">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status === "available"
                    ? "bg-[#10B981]"
                    : status === "partial"
                      ? "bg-[#F59E0B]"
                      : "bg-[#A8ADB8]"
                }`}
              />
              {day}
            </span>
            <span className="font-mono text-[10px] text-[#4D5160]">
              {time}
            </span>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}

function CalendarCard() {
  return (
    <InfoCard className="bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="font-serif text-sm">May 2026</p>
        <div className="flex gap-4">
          <ChevronLeft className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-2 text-center">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span key={day} className="font-mono text-[8px] text-[#4D5160]">
            {day}
          </span>
        ))}
        {calendarDays.map(({ day, status }) => (
          <span
            key={day}
            className={`flex h-8 items-center justify-center rounded-md font-mono text-[10px] ${
              status === "available"
                ? "bg-[#22C55E] text-white"
                : status === "booked"
                  ? "bg-[#E5E8EF] text-[#8E94A1]"
                  : "bg-[#FAFBFD] text-[#D5D9E2]"
            }`}
          >
            {day}
          </span>
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-5 font-sans text-[10px]">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-[#22C55E]" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-[#E5E8EF]" />
          Booked
        </span>
      </div>
    </InfoCard>
  );
}

function LocationSection() {
  return (
    <section id="location" className="scroll-mt-28">
      <SectionKicker>Location</SectionKicker>
      <h2 className="font-serif text-[34px] font-semibold leading-tight">
        Where <span className="font-serif-italic text-primary">Simon</span>{" "}
        works.
      </h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-[190px_274px]">
        <LocationInfoCard />
        <img
          src={AllImages.map}
          alt="Provider service area map"
          className="h-[276px] w-full rounded-xl object-cover"
        />
      </div>
    </section>
  );
}

function LocationInfoCard() {
  return (
    <InfoCard className="bg-[#EEF0FF] p-5">
      <SectionKicker className="text-[9px]">Based in</SectionKicker>
      <h3 className="mt-3 font-serif text-xl font-semibold">
        Z{"\u00FC"}rich, 8001 {"\u2022"}
        <br />
        Aussersihl
      </h3>
      <p className="mt-4 font-sans text-[11px] leading-relaxed text-[#555866]">
        0.8km from the center. Works in the Z{"\u00FC"}rich metropolitan area
        within 10km.
      </p>
      <div className="mt-5 border-t border-border pt-5">
        <SectionKicker className="text-[9px]">Travels up to</SectionKicker>
        <p className="mt-3 font-serif text-lg">10 km</p>
      </div>
      <div className="mt-5 border-t border-border pt-5">
        <SectionKicker className="text-[9px]">Districts served</SectionKicker>
        <div className="mt-3 flex flex-wrap gap-2">
          {["8001", "8002", "8003", "8004", "8005"].map((zip) => (
            <span
              key={zip}
              className="rounded-full bg-white px-3 py-1 font-sans text-[10px]"
            >
              {zip}
            </span>
          ))}
        </div>
      </div>
    </InfoCard>
  );
}

function StarRating({
  size = "sm",
  className = "",
}: {
  size?: "xs" | "sm";
  className?: string;
}) {
  const iconClass = size === "xs" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className={`flex gap-0.5 text-[#F5A400] ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`${iconClass} fill-current`} />
      ))}
    </div>
  );
}

function SectionKicker({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-sm font-bold uppercase tracking-wider text-primary ${className}`}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-2 max-w-[680px] font-serif text-[46px] font-semibold leading-[1.15] tracking-tight text-[#1E1E22]">
      {children}
    </h2>
  );
}

function InfoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border shadow-sm ${className}`}>
      {children}
    </div>
  );
} 

export default ProvidersDetails;
