import Link from "next/link";

/**
 * Generic placeholder section, still used by two admin stub pages
 * (customers, settings). Recolored onto the shared design tokens in
 * app/globals.css so it follows the current palette automatically.
 */
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
      <div className="w-full overflow-hidden rounded-panel border border-line bg-surface/70 p-8 shadow-soft md:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-brass-ink">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-tight text-ink md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft md:text-lg">
          {description}
        </p>

        {points.length > 0 ? (
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {points.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-line bg-canvas-warm px-4 py-4 text-sm leading-7 text-ink"
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
              className="rounded-md bg-espresso px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-on-dark transition hover:bg-brass-ink"
            >
              {primaryCta.label}
            </Link>
          ) : null}
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className="rounded-md border border-line-strong bg-surface px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-espresso transition hover:bg-canvas-warm"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
