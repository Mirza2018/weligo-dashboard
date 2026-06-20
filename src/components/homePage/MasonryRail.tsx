import AllImages from "../../assets/AllImages";

const rowA = [AllImages.h2, AllImages.h3, AllImages.h4, AllImages.h5];
const rowB = [AllImages.h6, AllImages.h7, AllImages.h8, AllImages.h9];

const heightsA = [AllImages.h2, AllImages.h3, AllImages.h4, AllImages.h5];
const heightsB = [AllImages.h6, AllImages.h7, AllImages.h8, AllImages.h9];

/**
 * Two-row masonry marquee. Both rows scroll horizontally behind a static
 * centered featured image, creating a "passing behind" effect.
 */
export function MasonryRail() {
  const a = [...rowA, ...rowA, ...rowA];
  const b = [...rowB, ...rowB, ...rowB];
  return (
    <div className="relative h-120 overflow-hidden sm:h-140 ">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-30   bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-30  bg-linear-to-l from-background to-transparent" />

      {/* Two stacked scrolling rows behind */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center gap-4">
        <div className="marquee-track flex items-end gap-4 px-4">
          {a.map((src, i) => {
            const h = heightsA[i % heightsA.length];
            return (
              <div
                key={`a-${i}`}
                className={`relative shrink-0 overflow-hidden rounded-2xl shadow-md ${h} aspect-4/4`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-64 object-cover "
                />
              </div>
            );
          })}
        </div>
        <div className="marquee-track marquee-track-reverse flex items-start gap-4 px-4">
          {b.map((src, i) => {
            const h = heightsB[i % heightsB.length];
            return (
              <div
                key={`b-${i}`}
                className={`relative shrink-0 overflow-hidden rounded-2xl shadow-md ${h} aspect-[1]`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-64 object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Static center featured image on top */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden lg:block  h-full w-[32%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl">
        <img src={AllImages.h1} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
