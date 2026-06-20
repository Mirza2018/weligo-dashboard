import { useI18n, type Lang } from "../../lib/i18n";
import { cn } from "../../lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const next: Lang = lang === "en" ? "de" : "en";
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={`Switch language to ${next.toUpperCase()}`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground transition hover:opacity-90",
        className,
      )}
    >
      {lang === "en" ? "En" : "De"}
    </button>
  );
}
