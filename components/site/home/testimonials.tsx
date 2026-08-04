"use client";

import { useState } from "react";

import { testimonials } from "@/data/testimonials";
import { Rating } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

import { Icon } from "../icons";

/**
 * Testimonial slider.
 *
 * All quotes stay in the DOM and are stacked with opacity, so the container
 * height is set by the tallest quote and switching never shifts the layout.
 * Inactive panels are hidden from assistive tech and removed from the tab order.
 */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const count = testimonials.length;

  const go = (direction: -1 | 1) =>
    setActive((current) => (current + direction + count) % count);

  return (
    <section className="shell py-20 md:py-28">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading
          eyebrow="In their words"
          title="What people say after the first fitting"
        />

        <div>
          {/* Stacked quotes */}
          <div className="relative grid">
            {testimonials.map((testimonial, index) => {
              const isActive = index === active;
              return (
                <blockquote
                  key={testimonial.name}
                  aria-hidden={!isActive}
                  className={cn(
                    // Every panel occupies the same grid cell.
                    "col-start-1 row-start-1 transition-opacity duration-600 ease-[var(--ease-out-expo)]",
                    isActive
                      ? "visible opacity-100"
                      : "invisible opacity-0",
                  )}
                >
                  <Icon name="quote" className="h-8 w-8 text-brass-soft" />
                  <p className="mt-6 font-display text-2xl leading-snug text-ink md:text-3xl md:leading-snug">
                    {testimonial.quote}
                  </p>
                  <footer className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Rating value={testimonial.rating} />
                    <cite className="not-italic">
                      <span className="text-sm font-medium text-ink">
                        {testimonial.name}
                      </span>
                      <span className="text-sm text-ink-soft">
                        {" "}
                        · {testimonial.role}, {testimonial.location}
                      </span>
                    </cite>
                  </footer>
                </blockquote>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose testimonial">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Testimonial ${index + 1} of ${count}, ${testimonial.name}`}
                  onClick={() => setActive(index)}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500 ease-[var(--ease-out-expo)]",
                    index === active ? "w-8 bg-brass" : "w-3 bg-line-strong hover:bg-brass-soft",
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="mr-2 text-xs tabular-nums text-ink-faint">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brass hover:bg-brass-wash"
              >
                <Icon name="chevron-left" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brass hover:bg-brass-wash"
              >
                <Icon name="chevron-right" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
