import { useI18n } from "@/lib/i18n";

export function scorePassword(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 10) score++;
  return Math.min(score, 4);
}

const colors = ["bg-border", "bg-destructive", "bg-[color:var(--tint-yellow)]", "bg-[color:var(--tint-blue)]", "bg-[#22c55e]"];

export function PasswordStrength({ password }: { password: string }) {
  const { t, lang } = useI18n();
  const score = scorePassword(password);
  if (!password) return null;
  const label = (
    {
      0: { de: "Zu schwach", en: "Too weak" },
      1: { de: "Schwach", en: "Weak" },
      2: { de: "Mittel", en: "Fair" },
      3: { de: "Gut", en: "Good" },
      4: { de: "Stark", en: "Strong" },
    } as Record<number, { de: string; en: string }>
  )[score][lang];
  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < score ? colors[score] : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {t("auth.password")} · {label}
      </p>
    </div>
  );
}
