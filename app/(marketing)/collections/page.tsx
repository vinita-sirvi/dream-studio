import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { collections as editorialCollections, IMAGES } from "@/data/home";
import { PageHero } from "@/components/site/page-hero";
import { Icon } from "@/components/site/icons";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { getShopData } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Seasonal edits and curated capsules — bridal, everyday handloom, and occasion silk.",
};

/**
 * Collections index.
 *
 * Lists the real collections from the catalogue (each linking to the existing
 * `/shop?collection=<slug>` server filter), plus the three editorial edits from
 * data/home.ts. No new routes or data models are introduced.
 */
export default async function CollectionsPage() {
  const { collections, products } = await getShopData();

  // How many published pieces sit in each collection, for the count label.
  const countFor = (slug: string) =>
    products.filter((product) => product.collectionSlug === slug).length;

  return (
    <>
      <PageHero
        eyebrow="Collections"
        title="Curated edits from the workroom"
        description="Collections group pieces by occasion and construction weight, so you can start from the kind of garment you need rather than scrolling the whole catalogue."
        image={IMAGES.lehenga}
        crumbs={[{ label: "Collections" }]}
      />

      {/* Editorial edits */}
      <section className="shell py-20 md:py-28">
        <SectionHeading eyebrow="Featured" title="Three ways into the atelier" />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {editorialCollections.map((collection, index) => (
            <Link
              key={collection.name}
              href={collection.href}
              className="group/col block"
            >
              <ImageReveal
                delay={index * 0.08}
                className="relative aspect-4/5 overflow-hidden rounded-panel"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    sizes="(min-width: 768px) 31vw, 92vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover/col:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="eyebrow text-brass-soft">{collection.meta}</p>
                    <h3 className="mt-3 font-display text-2xl text-on-dark">
                      {collection.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-on-dark-soft">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </ImageReveal>
            </Link>
          ))}
        </div>
      </section>

      {/* Catalogue collections */}
      {collections.length ? (
        <section className="border-y border-line bg-canvas-warm py-20 md:py-24">
          <div className="shell">
            <SectionHeading
              eyebrow="All collections"
              title="Browse by edit"
              description="Every collection below links straight into a filtered view of the catalogue."
            />

            <Reveal
              stagger={0.06}
              className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3"
            >
              {collections.map((collection) => {
                const count = countFor(collection.slug);
                return (
                  <Link
                    key={collection.slug}
                    href={`/shop?collection=${collection.slug}`}
                    className="group/row flex flex-col justify-between gap-5 bg-canvas p-7 transition-colors hover:bg-brass-wash"
                  >
                    <div>
                      <h3 className="flex items-center justify-between gap-3 font-display text-xl text-ink">
                        {collection.name}
                        <Icon
                          name="arrow-up-right"
                          className="h-4 w-4 shrink-0 text-brass transition-transform duration-400 group-hover/row:translate-x-1 group-hover/row:-translate-y-1"
                        />
                      </h3>
                      {collection.description ? (
                        <p className="mt-2.5 text-sm leading-6 text-ink-soft">
                          {collection.description}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                      {count} {count === 1 ? "piece" : "pieces"}
                    </p>
                  </Link>
                );
              })}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="shell py-20 md:py-24">
        <div className="grid gap-8 rounded-panel bg-espresso p-8 text-on-dark md:grid-cols-[1.3fr_1fr] md:items-center md:p-12">
          <div>
            <h2 className="display-md text-on-dark">
              Nothing in the collections quite right?
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-on-dark-soft">
              Commissions start from a sketch, a photograph, or a garment you
              already own and want reinterpreted.
            </p>
          </div>
          <div className="md:justify-self-end">
            <ButtonLink href="/custom-order" variant="onDark" size="lg">
              Commission a piece
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
