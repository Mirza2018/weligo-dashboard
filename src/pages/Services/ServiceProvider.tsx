import React, { useState } from "react";
import { useI18n } from "../../lib/i18n";
import { BadgeCheck, ChevronDown, MapPin, Search, Star } from "lucide-react";
import AllImages from "../../assets/AllImages";
import { useNavigate } from "react-router-dom";

const ServiceProvider = () => {
  const { t } = useI18n();
  const [searchValue, setSearchValue] = useState("");
  const [mapSearchValue, setMapSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("");

//   console.log(searchValue, mapSearchValue, filterValue);

  return (
    <div className=" max-w-430 mx-auto border border-border px-4   sm:px-6 lg:px-4 h-screen">
      <div className="mt-5.75 grid max-w-119 gap-2 sm:grid-cols-2 ">
        <SearchBox
          icon={Search}
          placeholder="Search"
          value={searchValue}
          onChange={setSearchValue}
        />
        <SearchBox
          icon={MapPin}
          placeholder="Map Search"
          value={mapSearchValue}
          onChange={setMapSearchValue}
        />
      </div>
      <section className="grid grid-cols-5 gap-7 my-14.25 items-start">
        {/* Left: title fixed, only cards scroll */}
        <section className="max-w-157.5 col-span-2">
          {/* Title — not scrollable */}
          <div className="fade-up">
            <h1 className="mt-3 text-4xl leading-tight tracking-tight sm:text-5xl font-semibold">
              {t("providers.titleA")}{" "}
              <span className="font-serif-italic">{t("providers.titleB")}</span>{" "}
              {t("providers.titleC")}
            </h1>
          </div>
          <div className="flex items-center justify-between mt-4">
            <h1 className="font-sans">24 Providers found</h1>
            <FilterDropdown value={filterValue} onChange={setFilterValue} />
          </div>

          {/* Only this part scrolls */}
          <div
            className="pt-4 grid grid-cols-1 gap-4 overflow-y-auto"
            style={{ maxHeight: "50vh" }}
          >
            <ProviderCard />
            <ProviderCard />
            <ProviderCard />
            <ProviderCard />
            <ProviderCard />
          </div>
        </section>

        {/* Right: map — same height as the scrollable card area */}
        <div className="col-span-3" style={{ height: "75vh" }}>
          <img
            className="rounded-s-3xl w-full h-full object-cover"
            src={AllImages.map}
            alt=""
          />
        </div>
      </section>
    </div>
  );
};

function SearchBox({
  icon: Icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-11 w-full rounded-md border border-border bg-background py-2 pl-10 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

function FilterDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedLabel =
    value === "price-low-high"
      ? "Price (Low > High)"
      : value === "price-high-low"
        ? "Price (High > Low)"
        : value === "rating"
          ? "Rating"
          : "Default";

  return (
    <div className="relative inline-flex h-10 cursor-pointer items-center gap-1 font-sans">
      <span>Sort by :</span>
      <span className=" font-bold">{selectedLabel}</span>
      <select
        aria-label="Sort providers"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        <option className="text-foreground " value="">
          Default
        </option>
        <option className="text-foreground" value="price-low-high">
          Price (Low &gt; High)
        </option>
        <option className="text-foreground" value="price-high-low">
          Price (High &gt; Low)
        </option>
        <option className="text-foreground" value="rating">
          Rating
        </option>
      </select>
      <ChevronDown className="pointer-events-none h-4 w-4 text-muted-foreground" />
    </div>
  );
}

function ProviderCard() {
    const router = useNavigate();
  return (
    <article
      onClick={() => router("456")}
      className="flex gap-4 rounded-2xl border border-border bg-card p-3 shadow-sm"
    >
      <img
        src={AllImages.s1}
        alt="Simon Keller"
        className="h-[163px] w-[147px] shrink-0 rounded-lg object-cover"
      />

      <div className="min-w-0 py-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate font-serif text-3xl font-semibold leading-tight text-foreground">
            Simon Keller
          </h2>
          <BadgeCheck className="h-5 w-5 shrink-0 fill-primary text-primary" />
        </div>

        <div className="mt-1 flex items-center gap-1 font-sans text-base">
          <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
          <span className="font-semibold">5.0</span>
          <span className="text-muted-foreground">(521)</span>
        </div>

        <p className="mt-2 font-sans text-base font-semibold text-foreground">
          Childcare {"\u2022"} 4 years experience
        </p>
        <p className="mt-1 font-sans text-sm font-medium text-muted-foreground">
          Zurich, 8001 {"\u2022"} 2.1 km Away
        </p>

        <div className="mt-3 inline-flex items-center rounded-full bg-primary px-3 py-1.5 font-sans text-sm font-bold text-primary-foreground">
          CHF&nbsp;&nbsp;20 / hr
        </div>
      </div>
    </article>
  );
}

export default ServiceProvider;
