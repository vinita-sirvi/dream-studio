import {
  arrivals,
  categories,
  features,
  processSteps,
  trustStrip,
} from "@/data/home";

import { Icon } from "./icons";

const toneMap = {
  rose: {
    panel: "#f7e1e6",
    dress: "#d69ca7",
    accent: "#f0c8d0",
  },
  gold: {
    panel: "#f1e0bc",
    dress: "#d0a64a",
    accent: "#f7e6bf",
  },
  ivory: {
    panel: "#f4ece3",
    dress: "#d6c7b7",
    accent: "#fbf4ea",
  },
  slate: {
    panel: "#dce5ef",
    dress: "#7290ad",
    accent: "#edf3f8",
  },
  wine: {
    panel: "#edd4d3",
    dress: "#8d3b43",
    accent: "#f0dede",
  },
  plum: {
    panel: "#ecdbef",
    dress: "#8b5a9f",
    accent: "#f4e8f6",
  },
  olive: {
    panel: "#dde9c9",
    dress: "#7b9843",
    accent: "#edf5de",
  },
  amber: {
    panel: "#f3e0b6",
    dress: "#dbad45",
    accent: "#fbf0cf",
  },
  blush: {
    panel: "#f3d7d8",
    dress: "#cb8592",
    accent: "#f8e6e7",
  },
};

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <h2
        className="text-[1.55rem] font-medium uppercase tracking-[0.16em] text-[#2f2319] md:text-[1.8rem]"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-sm text-[#7d6a5d]">{subtitle}</p>
      ) : null}
      <div className="mx-auto mt-3 h-px w-16 bg-[#cfb89e]" />
    </div>
  );
}

function VisualArt({
  tone,
  variant,
}: {
  tone: keyof typeof toneMap;
  variant: "hero" | "category" | "arrival" | "process";
}) {
  const palette = toneMap[tone];
  const isHero = variant === "hero";
  const isLarge = variant === "hero" || variant === "process";

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.9), rgba(255,255,255,0) 38%), ` +
          `linear-gradient(135deg, ${palette.accent}, ${palette.panel} 48%, #f5efe6 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_22%,rgba(255,255,255,0.55),transparent_24%),radial-gradient(circle_at_25%_78%,rgba(255,255,255,0.26),transparent_28%)]" />
      <div className="absolute left-[12%] top-[10%] h-24 w-24 rounded-full bg-[#f6e8d7] blur-3xl opacity-70" />
      <div className="absolute right-[10%] top-[18%] h-28 w-28 rounded-full bg-white/50 blur-3xl" />

      <div
        className={`absolute ${
          isHero ? "left-[52%] top-[6%] w-[33%]" : "left-1/2 top-[8%] w-[46%]"
        } -translate-x-1/2`}
      >
        <div className="relative mx-auto aspect-[3/4] w-full">
          <div className="absolute left-1/2 top-[1%] h-[18%] w-[23%] -translate-x-1/2 rounded-[48%] bg-[#e8c0a0] shadow-[0_10px_24px_rgba(102,68,44,0.12)]" />
          <div className="absolute left-1/2 top-[2%] h-[26%] w-[36%] -translate-x-[42%] rounded-t-[48%] rounded-b-[52%] bg-[#261813]" />
          <div className="absolute left-[51%] top-[10%] h-[17%] w-[18%] -translate-x-1/2 rounded-full bg-[#e8c0a0]" />
          <div className="absolute left-1/2 top-[18%] h-[7%] w-[16%] -translate-x-1/2 rounded-full bg-[#f6d8c0]" />

          <div
            className="absolute left-1/2 top-[24%] h-[44%] w-[38%] -translate-x-1/2 rounded-[40%_40%_18%_18%/24%_24%_12%_12%]"
            style={{
              background: `linear-gradient(180deg, ${palette.dress} 0%, ${palette.dress} 68%, ${palette.panel} 100%)`,
            }}
          />
          <div
            className="absolute left-[50.5%] top-[29%] h-[24%] w-[12%] -translate-x-1/2 rounded-full"
            style={{ background: "rgba(255,255,255,0.18)" }}
          />
          <div className="absolute left-[35%] top-[29%] h-[30%] w-[7%] rounded-full bg-[#dcb195] rotate-[-14deg]" />
          <div className="absolute left-[58%] top-[29%] h-[30%] w-[7%] rounded-full bg-[#dcb195] rotate-[14deg]" />
          <div className="absolute left-[31%] top-[47%] h-[7%] w-[17%] rounded-full bg-[#dcb195] rotate-[18deg]" />
          <div className="absolute left-[55%] top-[47%] h-[7%] w-[17%] rounded-full bg-[#dcb195] rotate-[-18deg]" />

          <div className="absolute left-1/2 top-[62%] h-[6%] w-[33%] -translate-x-1/2 rounded-full bg-[#c98c9d]/40 blur-[10px]" />
          <div className="absolute left-1/2 top-[66%] h-[5%] w-[28%] -translate-x-1/2 rounded-full bg-[#7e5f42]/20 blur-[16px]" />
        </div>
      </div>

      <div
        className={`absolute ${
          isLarge ? "left-[12%] bottom-[12%]" : "left-[10%] bottom-[10%]"
        } flex items-end gap-2`}
      >
        <div className="h-20 w-20 rounded-[1.1rem] bg-[linear-gradient(180deg,#f8f0e5,#ead3bb)] shadow-[0_18px_32px_rgba(105,72,46,0.12)]">
          <div className="mx-auto mt-4 h-10 w-10 rounded-full border border-[#d5bc9f] bg-[radial-gradient(circle_at_40%_35%,#fff, #ecd3b6)]" />
        </div>
        <div className="hidden h-24 w-14 rounded-[1rem] bg-[linear-gradient(180deg,#eedcc9,#f9f2e8)] shadow-[0_18px_32px_rgba(105,72,46,0.08)] md:block" />
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#91633f]" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/65" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/65" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/65" />
      </div>
    </div>
  );
}

function FeatureItem({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-[#eadccc] px-4 py-5 md:border-b-0 md:border-r md:px-5">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#d8c5b0] bg-[#fbf6ef] text-[#8d6236]">
        <Icon name={icon as never} className="h-7 w-7" />
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2f2319]">
          {title}
        </h3>
        <p className="mt-1 max-w-[15rem] text-sm leading-6 text-[#655549]">
          {text}
        </p>
      </div>
    </div>
  );
}

function CategoryTile({
  name,
  tone,
}: {
  name: string;
  tone: keyof typeof toneMap;
}) {
  return (
    <div className="group">
      <div className="overflow-hidden rounded-[1.2rem] border border-[#eadccc] bg-white shadow-[0_14px_30px_rgba(94,67,43,0.06)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_rgba(94,67,43,0.12)]">
        <div className="aspect-[4/5]">
          <VisualArt tone={tone} variant="category" />
        </div>
      </div>
      <p className="mt-3 text-center text-[13px] font-medium uppercase tracking-[0.16em] text-[#2f2319]">
        {name}
      </p>
    </div>
  );
}

function ProcessStep({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#d8c5b0] bg-[#fcf8f2] text-[#8d6236]">
        <Icon name={icon as never} className="h-6 w-6" />
      </div>
      <h4 className="mt-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#2f2319]">
        {title}
      </h4>
      <p className="mt-1 text-sm leading-6 text-[#66574a]">{text}</p>
    </div>
  );
}

function ArrivalCard({
  name,
  price,
  tone,
}: {
  name: string;
  price: string;
  tone: keyof typeof toneMap;
}) {
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[1.1rem] border border-[#eadccc] bg-white shadow-[0_16px_32px_rgba(92,65,43,0.07)] transition group-hover:-translate-y-1">
        <div className="absolute left-3 top-3 z-10 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2f2319]">
          New
        </div>
        <button
          type="button"
          className="absolute right-3 top-3 z-10 text-white/80 transition hover:text-[#c69b8d]"
          aria-label="Add to wishlist"
        >
          <Icon name="heart" className="h-5 w-5" />
        </button>
        <div className="aspect-[4/5]">
          <VisualArt tone={tone} variant="arrival" />
        </div>
      </div>
      <h3 className="mt-3 text-center text-sm font-medium leading-6 text-[#2f2319]">
        {name}
      </h3>
      <p className="mt-1 text-center text-sm font-semibold text-[#2f2319]">
        {price}
      </p>
    </article>
  );
}

function TrustItem({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-3 px-2 py-4">
      <div className="grid h-11 w-11 place-items-center rounded-full border border-[#d8c5b0] bg-[#fcf8f2] text-[#8d6236]">
        <Icon name={icon as never} className="h-5 w-5" />
      </div>
      <div>
        <h4 className="text-[12px] font-semibold uppercase tracking-[0.09em] text-[#2f2319]">
          {title}
        </h4>
        <p className="text-sm text-[#6e5d50]">{text}</p>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <main id="home" className="flex-1">
      <section className="mx-auto w-full max-w-[1440px] px-3 pb-4 pt-3 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-[#eadccc] bg-[linear-gradient(135deg,#f8efe5_0%,#f3e5d8_42%,#efdfd4_100%)] shadow-[0_22px_60px_rgba(103,73,47,0.09)]">
          <div className="grid items-stretch gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center px-6 py-14 md:px-10 md:py-16 lg:px-14 lg:py-24">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8c6b52]">
                Premium Fabrics | Perfect Fit | Unique Designs
              </p>
              <h1
                className="mt-6 max-w-[11ch] text-[3.2rem] font-medium leading-[0.95] text-[#2f2319] md:text-[4.2rem] lg:text-[5rem]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Custom-Made Fashion,
              </h1>
              <div
                className="mt-2 text-[2.6rem] leading-none text-[#9a744b] md:text-[3.5rem] lg:text-[4.5rem]"
                style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
              >
                Designed Just for You
              </div>
              <p className="mt-6 max-w-md text-[16px] leading-8 text-[#4b3c31] md:text-[18px]">
                Tailored silhouettes, artisan stitching, and a luxurious fit
                made to flatter your style and your measurements.
              </p>
              <div className="mt-8">
                <a
                  href="#categories"
                  className="inline-flex items-center rounded-[0.2rem] bg-[#3b2417] px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#533521]"
                >
                  Shop Now
                </a>
              </div>
            </div>

            <div className="relative min-h-[360px] lg:min-h-[640px]">
              <button
                type="button"
                className="absolute left-5 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#eadccc] bg-white/85 text-[#2f2319] shadow-sm"
                aria-label="Previous slide"
              >
                <Icon name="chevron-left" className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute right-5 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#eadccc] bg-white/85 text-[#2f2319] shadow-sm"
                aria-label="Next slide"
              >
                <Icon name="chevron-right" className="h-5 w-5" />
              </button>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.6),transparent_25%),linear-gradient(90deg,rgba(255,247,240,0.95),rgba(247,234,223,0.5))]" />
              <div className="absolute inset-y-0 right-0 w-[72%] bg-[linear-gradient(180deg,rgba(254,245,239,0.2),rgba(242,226,210,0.22))]" />

              <div className="absolute inset-x-0 bottom-0 top-0">
                <VisualArt tone="rose" variant="hero" />
              </div>

              <div className="absolute left-4 bottom-4 hidden rounded-full border border-[#eadccc] bg-white/75 px-4 py-2 text-xs font-medium text-[#6a5649] shadow-sm md:block">
                1 / 4
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-3 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[1.6rem] border border-[#eadccc] bg-[#fbf3ea] shadow-[0_12px_26px_rgba(103,73,47,0.05)]">
          <div className="grid md:grid-cols-5">
            {features.map((feature) => (
              <FeatureItem key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="mx-auto w-full max-w-[1440px] px-3 py-16 md:px-6 lg:px-8"
      >
        <SectionTitle title="Shop By Category" />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => (
            <CategoryTile key={category.name} {...category} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-3 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[1.6rem] border border-[#eadccc] bg-[linear-gradient(135deg,#f6e6da_0%,#f1e0d2_100%)] shadow-[0_14px_36px_rgba(103,73,47,0.07)]">
          <div className="grid items-center gap-8 p-4 md:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:p-8">
            <div className="overflow-hidden rounded-[1.1rem]">
              <div className="aspect-[4/3] md:aspect-[16/11]">
                <VisualArt tone="ivory" variant="process" />
              </div>
            </div>

            <div>
              <SectionTitle
                title="Customize Your Outfit"
                subtitle="You Imagine, We Create"
              />
              <div className="mt-8 grid gap-5 md:grid-cols-5">
                {processSteps.map((step) => (
                  <ProcessStep key={step.title} {...step} />
                ))}
              </div>
              <div className="mt-8 flex justify-center lg:justify-end">
                <a
                  href="#home"
                  className="inline-flex items-center rounded-[0.2rem] bg-[#3b2417] px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#533521]"
                >
                  Start Custom Order
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-3 py-16 md:px-6 lg:px-8">
        <SectionTitle title="New Arrivals" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {arrivals.map((item) => (
            <ArrivalCard key={item.name} {...item} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-3 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[1.4rem] border border-[#eadccc] bg-[#fbf3ea]">
          <div className="grid md:grid-cols-2 xl:grid-cols-4">
            {trustStrip.map((item) => (
              <TrustItem key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
