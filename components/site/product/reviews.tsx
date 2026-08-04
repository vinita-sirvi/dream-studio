import { reviewSummary, sampleReviews } from "@/data/reviews";
import { Rating } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

import { Icon } from "../icons";

/**
 * Customer reviews.
 *
 * NOTE: driven by the fixed sample set in data/reviews.ts — there is no review
 * model or submission flow in this codebase, so the same reviews appear on every
 * product. The section is labelled as sample content in the UI so it cannot be
 * mistaken for real data. See data/reviews.ts for what is needed to make it real.
 */
export function ProductReviews() {
  const { average, count, distribution } = reviewSummary(sampleReviews);

  return (
    <section className="border-t border-line py-16 md:py-20">
      <SectionHeading
        eyebrow="Reviews"
        title="What buyers said"
        size="md"
      />

      <div className="mt-10 grid gap-12 lg:grid-cols-[18rem_1fr] lg:gap-16">
        {/* Summary */}
        <div>
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl text-ink">
              {average.toFixed(1)}
            </span>
            <span className="pb-2 text-sm text-ink-soft">/ 5</span>
          </div>
          <Rating value={average} className="mt-3" />
          <p className="mt-2 text-sm text-ink-soft">
            Based on {count} reviews
          </p>

          {/* Distribution */}
          <ul className="mt-7 grid gap-2">
            {distribution.map((bucketCount, index) => {
              const stars = 5 - index;
              const percent = count ? (bucketCount / count) * 100 : 0;
              return (
                <li key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-6 tabular-nums text-ink-soft">
                    {stars}★
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunk">
                    <span
                      className="block h-full rounded-full bg-brass"
                      style={{ width: `${percent}%` }}
                    />
                  </span>
                  <span className="w-4 tabular-nums text-ink-faint">
                    {bucketCount}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-7 rounded-xl border border-line bg-canvas-warm p-4 text-xs leading-6 text-ink-soft">
            <strong className="font-medium text-ink">Sample content.</strong>{" "}
            Review collection is not yet connected, so these entries are
            illustrative rather than product-specific.
          </p>
        </div>

        {/* List */}
        <Reveal stagger={0.08} className="grid gap-px bg-line">
          {sampleReviews.map((review) => (
            <article key={review.name + review.date} className="bg-canvas py-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Rating value={review.rating} />
                <h3 className="font-display text-lg text-ink">{review.title}</h3>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">
                {review.body}
              </p>

              <footer className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-faint">
                <span className="text-ink">{review.name}</span>
                {review.verified ? (
                  <span className="inline-flex items-center gap-1.5 text-success">
                    <Icon name="check" className="h-3.5 w-3.5" />
                    Verified purchase
                  </span>
                ) : null}
                <span>Fit: {review.fit}</span>
                <time dateTime={review.date}>
                  {new Date(review.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </footer>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
