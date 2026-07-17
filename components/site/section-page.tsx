import Link from "next/link";

export function SectionPage({
  eyebrow,
  title,
  description,
  points = [],
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  points?: string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <section className="mx-auto flex min-h-[72vh] w-full max-w-[1120px] items-center px-4 py-16 md:px-8">
      <div className="w-full overflow-hidden rounded-[2rem] border border-[#eadccc] bg-white/70 p-8 shadow-[0_20px_50px_rgba(103,73,47,0.08)] md:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8a6b56]">
          {eyebrow}
        </p>
        <h1
          className="mt-4 max-w-3xl text-4xl font-medium leading-tight text-[#2f2319] md:text-6xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f4f43] md:text-lg">
          {description}
        </p>

        {points.length > 0 ? (
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {points.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-4 py-4 text-sm leading-7 text-[#49382d]"
              >
                {point}
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          {primaryCta ? (
            <Link
              href={primaryCta.href}
              className="rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521]"
            >
              {primaryCta.label}
            </Link>
          ) : null}
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className="rounded-md border border-[#d8c5b0] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#3b2417] transition hover:bg-[#faf5ee]"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
