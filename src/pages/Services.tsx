



import AllImages from "../assets/AllImages";
import { ServiceCard } from "../components/servicePage/ServiceCard";
import { TrustBar } from "../components/servicePage/TrustBar";
import { useI18n } from "../lib/i18n";

export function Services() {
  const { t } = useI18n();
  const cards = [
    {
      title: t("services.childcare"),
      desc: t("services.childcareDesc"),
      image: AllImages.s1,
      available: true,
      count: 1245,
      price: 22,
    },
    {
      title: t("services.tutoring"),
      desc: t("services.tutoringDesc"),
      image: AllImages.s2,
      available: true,
      count: 312,
      price: 28,
    },
    { title: t("services.senior"),desc: t("services.seniorDesc"), image: AllImages.s3 },
    { title: t("services.cleaning"),desc: t("services.cleaningDesc"),   image: AllImages.s4 },
    { title: t("services.pet"), desc: t("services.petDesc"),  image: AllImages.s5 },
    { title: t("services.everyday"), desc: t("services.everydayDesc"), image: AllImages.s6 },
  ];
  return (
    <div>
      <section className="bg-primary-muted">
        <div className="mx-auto max-w-430 px-4 py-20 text-center sm:px-6 lg:px-8 fade-up">
          <p className="eyebrow">{t("services.eyebrow")}</p>
          <h1 className="mt-3 text-5xl leading-tight tracking-tight sm:text-6xl font-semibold">
            {t("services.titleA")}
            <br />
            <span className="font-serif-italic">{t("services.titleB")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            {t("services.sub")}
          </p>
        </div>
      </section>
      <section className="mx-auto  px-4 py-12 sm:px-6 lg:px-8 max-w-430">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {cards.map((c, i) => (
            <ServiceCard key={i} {...c} />
          ))}
        </div>
        <div className="mt-10">
          <TrustBar />
        </div>
      </section>
    </div>
  );
}
