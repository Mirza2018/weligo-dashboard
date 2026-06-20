import { useNavigate } from "react-router-dom";
import { useI18n } from "../../lib/i18n";


export function ServiceCard({
  title,
  desc,
  image,
  available = false,
  count,
  price,
}: {
    title: string;
  desc: string;
  image: string;
  available?: boolean;
  count?: number;
  price?: number;
}) {
  const { t } = useI18n();
  const router=useNavigate()
  return (
    <article onClick={() => { router("123/providers");}}  className="group relative aspect-[16/10] overflow-hidden rounded-3xl shadow-sm transition-transform duration-500 hover:-translate-y-1 hover:shadow-xl pointer-cursor">
      {!available && <div className="absolute inset-0 z-10 bg-black/60" />}
      <img
        src={image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 "
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
      {!available && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="font-serif italic text-3xl text-white drop-shadow-lg sm:text-6xl font-bold">
            {t("services.comingSoon")}
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="text-4xl font-bold">{title}</h3>
        <p className="mt-2 max-w-md text-sm font-medium">
          {desc}
        </p>
        {available && count && price && (
          <p className="mt-3 uppercase tracking-wider text-white/90 font-bold">
            {count.toLocaleString()} {t("services.providers")} ·{" "}
            {t("services.from")} {price}
            {t("services.perHr")}
          </p>
        )}
      </div>
    </article>
  );
}
