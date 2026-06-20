import { Link } from "react-router-dom";
import AllImages from "../../assets/AllImages";
import { useI18n } from "../../lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-430 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <img src={AllImages.footerLogo} alt="" className="w-56" />
            <p className="mt-4 text-lg font-semibold text-primary-foreground/80">
              {t("footer.tagline")}
            </p>
          </div>
          <FooterCol
            title={t("footer.platform")}
            links={[
              { label: t("footer.howItWorks"), to: "/how-it-works" },
              { label: t("footer.aboutUs"), to: "/about-us" },
              { label: t("footer.trust"), to: "/waitlist" },
              { label: t("footer.contact"), to: "/waitlist" },
            ]}
          />
          <FooterCol
            title={t("footer.families")}
            links={[
              { label: t("footer.forFamilies"), to: "/for-families" },
              { label: t("footer.findChild"), to: "/services" },
              { label: t("footer.findSenior"), to: "/services" },
            ]}
          />
          <FooterCol
            title={t("footer.providers")}
            links={[
              { label: t("footer.forProviders"), to: "/for-providers" },
              { label: t("footer.become"), to: "/sign-up" },
              { label: t("footer.help"), to: "/waitlist" },
            ]}
          />
          <FooterCol
            title={t("footer.legal")}
            links={[
              { label: t("footer.terms"), to: "/waitlist" },
              { label: t("footer.privacy"), to: "/waitlist" },
              { label: t("footer.cookies"), to: "/waitlist" },
            ]}
          />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4  pt-6 text-xs text-primary-foreground/70 sm:flex-row sm:items-center">
          <p>© 2026 Weligo. {t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <img src={AllImages.tiktok} alt="" className="w-5" />
            <img src={AllImages.instragram} alt="" className="w-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <h4 className=" text-sm font-semibold">{title}</h4>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-base transition-colors hover:text-primary-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
