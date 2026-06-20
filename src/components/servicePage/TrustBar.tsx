import { ShieldCheck, BadgeCheck, CreditCard, Headphones } from "lucide-react";
import { useI18n } from "../../lib/i18n";


export function TrustBar() {
  const { t } = useI18n();
  const items = [
    { icon: BadgeCheck, title: t("trust.verified"), sub: t("trust.verifiedSub") },
    { icon: ShieldCheck, title: t("trust.background"), sub: t("trust.backgroundSub") },
    { icon: CreditCard, title: t("trust.payments"), sub: t("trust.paymentsSub") },
    { icon: Headphones, title: t("trust.support"), sub: t("trust.supportSub") },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.title} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-muted text-primary">
            <it.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{it.title}</p>
            <p className="text-xs text-muted-foreground">{it.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
