import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { categories, IMAGES } from "@/data/home";
import { PageHero } from "@/components/site/page-hero";
import { Icon } from "@/components/site/icons";
import { ImageReveal } from "@/components/motion/image-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Kurtis, blouses, dresses, co-ord sets, lehengas and ethnic wear — every category available made to measure.",
};

/**
 * Categories index. Each tile links to the existing `/shop?category=<slug>`
 * server-side filter rather than a separate per-category route.
 */
export default function CategoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Browse"
        title="Six forms, endlessly adjustable"
        description="Every category can be ordered as shown or cut to your own measurements. The form is the starting point, not the constraint."
        image={IMAGES.coordSet}
        crumbs={[{ label: "Categories" }]}
      />

      <section className="shell py-20 md:py-28">
        <SectionHeading eyebrow="Categories" title="Where would you like to start?" />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group/cat block"
            >
              <ImageReveal
                delay={index * 0.06}
                className="relative aspect-4/5 overflow-hidden rounded-panel"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={category.image}
                    alt={`${category.name} — tailored ${category.name.toLowerCase()}`}
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover/cat:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="eyebrow text-brass-soft">{category.count}</p>
                    <h2 className="mt-3 flex items-center justify-between gap-3 font-display text-2xl text-on-dark">
                      {category.name}
                      <Icon
                        name="arrow-right"
                        className="h-5 w-5 shrink-0 -translate-x-2 opacity-0 transition-all duration-400 group-hover/cat:translate-x-0 group-hover/cat:opacity-100"
                      />
                    </h2>
                    <p className="mt-1.5 text-sm text-on-dark-soft">
                      {category.blurb}
                    </p>
                  </div>
                </div>
              </ImageReveal>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell pb-24">
        <div className="grid gap-8 rounded-panel border border-line bg-canvas-warm p-8 md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
          <div>
            <h2 className="display-md text-ink">
              Looking for something that is not listed?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-ink-soft">
              We also make sarees, jackets, trousers and children&rsquo;s
              occasion wear to order, and we convert inherited saree fabric into
              pieces you will actually wear.
            </p>
          </div>
          <div className="md:justify-self-end">
            <ButtonLink href="/custom-order" size="lg">
              Ask about a commission
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
