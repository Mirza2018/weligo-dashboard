import { useI18n } from "../../lib/i18n";


export function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === "de" ? "en" : "de")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-primary-muted text-xs font-mono  hover:text-primary border border-primary transition-colors delay-75 duration-75 bg-primary text-primary-foreground  font-bold"
      aria-label="Toggle language"
    >
      {lang === "de" ? "DE" : "EN"}
    </button>
  );
}
