import {
  // ArrowLeft,
  ArrowRight,
  Baby,
  CalendarDays,
  GraduationCap,
  MapPin,
  Minus,
  PawPrint,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  // Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import AllImages from "../assets/AllImages";
import { useI18n } from "../lib/i18n";
import { Link, useNavigate } from "react-router-dom";
import { MasonryRail } from "../components/homePage/MasonryRail";

// export const Route = createFileRoute("/")({
//   component: Home,
// });

export function Home() {
  return (
    <div>
      <Hero />
      <ServicesStrip />
      {/* <CaregiverPreview /> */}
      {/* <Testimonial /> */}
      <HowItWorks />
      <FAQ />
      <ProviderCTA />
    </div>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="bg-background">
      <div className="mx-auto   pt-12 sm:px-6 ">
        <div className="mx-auto max-w-4xl text-center fade-up">
          <h1 className="text-5xl leading-[1.05] tracking-tight sm:text-[72px] font-bold">
            {t("home.titleA")}
            <br />
            <span className="">
              {t("home.titleB").split(" ").slice(0, -1).join(" ")}{" "}
              <span className="font-serif-italic ">
                {t("home.titleB").split(" ").slice(-1)}
              </span>
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-[#313233] font-medium">
            {t("home.sub")}
          </p>
          <SearchBar />
        </div>
        <div className="mt-10">
          <MasonryRail />
        </div>
      </div>
    </section>
  );
}

function SearchBar() {
  const router=useNavigate()
  return (
    <div className="mx-auto mt-8 flex flex-col max-w-4xl gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm lg:flex-row lg:items-center ">
      <Field label="What are you looking for?" icon={Baby} divider>
        Childcare
      </Field>

      <Field label="Location" icon={MapPin} divider>
        Zürich, 8001
      </Field>

      <Field label="Date & Time" icon={CalendarDays}>
        Sat, 18 May, 09:00
      </Field>

      <button
        onClick={() => {
          router("/sign-up");
        }}
        className="cursor-pointer shrink-0 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] whitespace-nowrap"
      >
        <Search className="h-4 w-4" /> Search
      </button>
    </div>
  );
}
function Field({
  label,
  icon: Icon,
  divider,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  divider?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-1 items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted-bg ! ${divider ? "sm:rounded-none sm:border-r sm:border-border" : ""}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-muted">
        <Icon className="h-5 w-5 text-primary" />
      </span>
      <div className="min-w-0 w-42">
        <p className="text-sm text-[#313233] font-semibold">{label}</p>
        <p className="truncate text-lg font-bold text-foreground">
          {children}
        </p>
      </div>
    </div>
  );
}

function ServicesStrip() {
  const { t } = useI18n();
  const items = [
    {
      key: "services.childcare",
      tint: "bg-primary-muted",
      icon: Baby,
      iconColor: "text-primary",
      ring: "ring-primary/40",
      descKey: "home.svcChildDesc",
      available: true,
    },
    {
      key: "services.tutoring",
      tint: "bg-[color:var(--tint-yellow)]",
      icon: GraduationCap,
      iconColor: "text-amber-500",
      descKey: "home.svcTutorDesc",
      available: true,
    },
    {
      key: "services.senior",
      tint: "bg-[color:var(--tint-blue)]",
      icon: Users,
      iconColor: "text-sky-500",
      descKey: "home.svcSeniorDesc",
      badge: "text-sky-600 bg-[#D3E6FA]!",
    },
    {
      key: "services.pet",
      tint: "bg-[color:var(--tint-green)]!",
      icon: PawPrint,
      iconColor: "text-emerald-500",
      descKey: "home.svcPetDesc",
      badge: "text-emerald-600 bg-[#CCEBDC]!",
    },
    {
      key: "services.cleaning",
      tint: "bg-[color:var(--tint-red)]",
      icon: Sparkles,
      iconColor: "text-rose-500",
      descKey: "home.svcCleanDesc",
      badge: "text-rose-600 bg-[#F6CFD4]!",
    },
    {
      key: "services.everyday",
      tint: "bg-primary-muted",
      icon: ShoppingBag,
      iconColor: "text-primary",
      descKey: "home.svcEverydayDesc",
      badge: "text-primary bg-[#DCD2F2]!",
    },
  ];
  return (
    <section className="mx-auto max-w-430 px-4 py-20 sm:px-6 lg:px-8">
      <p className="eyebrow">{t("home.servicesEyebrow")}</p>
      <h2 className="mt-2 text-3xl font-semibold sm:text-[48px]">
        {t("home.servicesTitleA")}
        <span className="font-serif-italic">{t("home.servicesTitleB")}</span>
        {t("home.servicesTitleC")}
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((it) => {
          const Icon = it.icon;
          const title = t(it.key).replace(/\.$/, "");
          return (
            <Link
              key={it.key}
              to="/services"
              className={`group flex flex-col items-center justify-start gap-4 rounded-3xl ${it.tint} ${it.available ? "ring-2 ring-primary/40" : ""} p-6 text-center transition-transform hover:-translate-y-1`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Icon className={`h-7 w-7 ${it.iconColor}`} />
              </span>
              <h3 className=" xl:text-xl text-foreground font-semibold">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[#5E6062]">
                {t(it.descKey)}
              </p>
              {!it.available && (
                <span
                  className={`mt-auto inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-medium ${it.badge}`}
                >
                  {t("services.comingSoon")}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// function CaregiverPreview() {
//   const { t } = useI18n();
//   return (
//     <section className="mx-auto max-w-430 px-4 py-20 sm:px-6 lg:px-8">
//       <p className="eyebrow">{t("home.providersEyebrow")}</p>
//       <h2 className="mt-2 text-3xl sm:text-4xl">
//         {t("home.providersTitleA")}
//         <span className="font-serif-italic">{t("home.providersTitleB")}</span>
//       </h2>
//       <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
//         {[0, 1, 2].map((i) => (
//           <div
//             key={i}
//             className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-sm transition-transform hover:-translate-y-1"
//           >
//             <img
//               src={AllImages.hc1}
//               alt=""
//               loading="lazy"
//               className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
//             <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-foreground">
//               <Star className="h-3 w-3 fill-primary text-primary" /> 5.0 (52)
//             </div>
//             <div className="absolute inset-x-0 bottom-0 p-5 text-white">
//               <p className="font-serif text-xl">Simon Keller</p>
//               <p className="text-xs text-white/80">Childcare · Zürich 8001</p>
//               <span className="mt-3 inline-flex rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-wider">
//                 CHF 28 / hr
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// function Testimonial() {
//   const { t } = useI18n();
//   const reviews = [
//     {
//       quote: t("home.quote"),
//       name: "Elena V.",
//       city: "Genève",
//       avatar: AllImages.hr4,
//     },
//     {
//       quote:
//         t("home.quote2") === "home.quote2"
//           ? "“Booking a tutor for our son took minutes. He's already more confident at school.”"
//           : t("home.quote2"),
//       name: "Marco R.",
//       city: "Zürich",
//       avatar: AllImages.hr1,
//     },
//     {
//       quote:
//         t("home.quote3") === "home.quote3"
//           ? "“Our cleaner is reliable, kind and thorough. Weligo simply works.”"
//           : t("home.quote3"),
//       name: "Sophie L.",
//       city: "Basel",
//       avatar: AllImages.ht1,
//     },
//   ];
//   const [idx, setIdx] = useState(0);
//   const r = reviews[idx];
//   const prev = () => setIdx((i) => (i - 1 + reviews.length) % reviews.length);
//   const next = () => setIdx((i) => (i + 1) % reviews.length);

//   return (
//     <section className="bg-muted-bg">
//       <div className="mx-auto max-w-430 px-4 py-20 sm:px-6 lg:px-8">
//         <div className="text-center">
//           <p className="eyebrow">{t("home.familiesEyebrow")}</p>
//           <h2 className="mt-3 font-serif text-4xl text-foreground font-semibold sm:text-[48px]">
//             {t("home.familiesTitleA")}
//             <span className="font-serif-italic text-primary">
//               {t("home.familiesTitleB")}
//             </span>
//           </h2>
//         </div>

//         <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
//           {/* Quote + navigation on the left */}
//           <div key={idx} className="fade-up">
//             <div className="flex gap-1 text-amber-400">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <Star key={i} className="h-5 w-5 fill-current" />
//               ))}
//             </div>
//             <p className="mt-6 font-serif text-5xl font-semibold leading-snug text-foreground sm:text-4xl">
//               {r.quote}
//             </p>
//             <div className="mt-10 flex items-center gap-6">
//               <div className="flex items-center gap-3">
//                 <img
//                   src={r.avatar}
//                   alt=""
//                   className="h-11 w-11 rounded-full object-cover"
//                 />
//                 <div className="text-left">
//                   <p className="text-sm font-semibold">{r.name}</p>
//                   <p className="text-xs text-muted-foreground">{r.city}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={prev}
//                   aria-label="Previous review"
//                   className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={next}
//                   aria-label="Next review"
//                   className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
//                 >
//                   <ArrowRight className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Static asymmetric collage on the right */}
//           <div className="relative mx-auto h-[460px] w-full  sm:h-[520px]">
//             <div className="absolute left-[6%] top-[2%] h-[36%] w-[34%] overflow-hidden  shadow-md">
//               <img
//                 src={AllImages.hr1}
//                 alt=""
//                 loading="lazy"
//                 className="h-full w-full object-cover"
//               />
//             </div>
//             <div className="absolute right-[4%] top-0 h-[44%] w-[40%] overflow-hidden  shadow-md">
//               <img
//                 src={AllImages.hr2}
//                 alt=""
//                 loading="lazy"
//                 className="h-full w-full object-cover"
//               />
//             </div>
//             <div className="absolute left-0 bottom-[6%] h-[32%] w-[28%] overflow-hidden  shadow-md">
//               <img
//                 src={AllImages.hr3}
//                 alt=""
//                 loading="lazy"
//                 className="h-full w-full object-cover"
//               />
//             </div>
//             <div className="absolute left-[30%] bottom-0 h-[44%] w-[34%] overflow-hidden shadow-md">
//               <img
//                 src={AllImages.hr4}
//                 alt=""
//                 loading="lazy"
//                 className="h-full w-full object-cover"
//               />
//             </div>
//             <div className="absolute right-0 bottom-[12%] h-[30%] w-[30%] overflow-hidden  shadow-md">
//               <img
//                 src={AllImages.hr5}
//                 alt=""
//                 loading="lazy"
//                 className="h-full w-full object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    {
      n: "01",
      title: t("home.step1Title"),
      desc: t("home.step1Desc"),
      img: AllImages.ht1,
    },
    {
      n: "02",
      title: t("home.step2Title"),
      desc: t("home.step2Desc"),
      img: AllImages.ht2,
    },
    {
      n: "03",
      title: t("home.step3Title"),
      desc: t("home.step3Desc"),
      img: AllImages.ht3,
    },
  ];
  return (
    <section className="mx-auto max-w-430 px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="eyebrow">{t("home.howEyebrow")}</p>
        <h2 className="mt-2 text-3xl font-semibold sm:text-[48px]">
          <span className="font-serif-italic">{t("home.howTitleA")}</span>
          {t("home.howTitleB")}
        </h2>
      </div>
      <div className="mt-12 space-y-8">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
          >
            <div>
              <p className="font-mono text-primary text-4xl font-bold">{s.n}</p>
              <p className="mt-2 text-4xl font-bold">{s.title}</p>
              <p className="mt-3  text-xl font-medium  ">{s.desc}</p>
            </div>
            <div className="aspect-20/10 overflow-hidden rounded-3xl">
              <img
                src={s.img}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const { t } = useI18n();
  const items = [
    {
      q: "How are providers verified?",
      a: "Every provider on Weligo undergoes a strict vetting process. This includes identity verification, a criminal background check (strafregisterauszug), a review of certifications, and a personal interview. We only accept about 15% of applicants to ensure highest quality care.",
    },
    {
      q: "How do payments work?",
      a: "Secure payments via TWINT, credit card or invoice. Caregivers are paid automatically each week.",
    },
    {
      q: "Are the services insured?",
      a: "Yes, all bookings are covered by Weligo's liability insurance.",
    },
    // {
    //   q: "Do I need to declare AHV / social security?",
    //   a: "Weligo handles all the paperwork for compliant Swiss employment.",
    // },
    {
      q: "What if I need to cancel?",
      a: "Free cancellation up to 24h before the booking.",
    },
    {
      q: "Is Weligo available across all of Switzerland?",
      a: "We launch in Zürich, Genève, Basel, Bern and expand quickly.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-muted-bg">
      <div className="mx-auto grid max-w-430 gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_2fr] lg:px-8">
        <div>
          <p className="eyebrow">{t("home.faqEyebrow")}</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight font-semibold sm:text-[48px]">
            {t("home.faqTitleA")}
            <span className="font-serif-italic text-primary">
              {t("home.faqTitleB")}
            </span>
          </h2>
        </div>
        <div className="divide-y divide-border">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <button
                key={i}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <div className="flex-1">
                  <p className="text-base font-semibold text-foreground">
                    {it.q}
                  </p>
                  {isOpen && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground fade-up">
                      {it.a}
                    </p>
                  )}
                </div>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary text-primary transition-transform">
                  {isOpen ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProviderCTA() {
  const { t } = useI18n();
  return (
    <section className="">
      <div className="rounded-3xl bg-primary-muted p-8 md:p-14 flex flex-col justify-center items-center">
        <div className=" max-w-430 px-4 py-20 sm:px-6 lg:px-8 ">
          <div className="flex flex-col justify-center items-center">
            <h2 className="font-serif text-4xl leading-[1.1] text-foreground font-bold sm:text-6xl text-center">
              {t("home.earnTitle")}
              <br />
              {t("home.earnTitle2")}{" "}
              <span className="font-serif-italic text-primary">
                {" "}
                {t("home.earnTitle3")}
              </span>
            </h2>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              {t("home.earnDesc")}
            </p>
            <Link
              to="/sign-up"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              {t("common.joinWaitlist")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
//Main//
// function ProviderCTA() {
//   const { t } = useI18n();
//   return (
//     <section className="">
//       <div className="rounded-3xl bg-primary-muted p-8 md:p-14">
//         <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 mx-auto max-w-430 px-4 py-20 sm:px-6 lg:px-8">
//           <div>
//             <h2 className="font-serif text-4xl leading-[1.1] text-foreground font-bold sm:text-6xl">
//               {t("home.earnTitle")}
//               <br />
//               {t("home.earnTitle2")}
//             </h2>
//             <p className="mt-5 max-w-md text-base text-muted-foreground">
//               {t("home.earnDesc")}
//             </p>
//             <Link
//               to="/sign-up"
//               className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
//             >
//               {t("home.becomeProvider")} <ArrowRight className="h-4 w-4" />
//             </Link>
//           </div>
//           <div className="relative mx-auto h-64 w-full max-w-md">
//             <Stat
//               label={t("home.statRateLabel")}
//               value="CHF 20"
//               className="absolute left-0 top-2 w-44"
//             />
//             <Stat
//               label={t("home.statRatingLabel")}
//               value="4.9"
//               className="absolute right-0 top-0 w-40"
//             />
//             <Stat
//               label={t("home.statBookingsLabel")}
//               value="12k+"
//               className="absolute left-12 bottom-2 w-44"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
// function Stat({
//   label,
//   value,
//   className = "",
// }: {
//   label: string;
//   value: string;
//   className?: string;
// }) {
//   return (
//     <div
//       className={`rounded-2xl bg-[#1B164D] p-5 text-white shadow-md transition-transform hover:-translate-y-1 animate-[shake_3s_ease-in-out_infinite] ${className}`}
//     >
//       <p className="font-serif text-2xl font-semibold">{value}</p>
//       <p className="mt-1 text-xs text-white/75">{label}</p>
//     </div>
//   );
// }
