import Image from "next/image";
import Link from "next/link";

import { collections } from "@/data/home";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

import { Icon } from "../icons";

/**
 * Featured collections.
 *
 * Asymmetric layout: the first collection takes a tall portrait cell, the other
 * two stack beside it. Avoids the three-identical-cards look.
 */
export function FeaturedCollections() {
  const [lead, ...rest] = collections;

  return (
    <section className="shell py-20 md:py-28">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Collections"
          title="Three ways into the atelier"
          description="Each collection is a different weight of commitment — from an everyday handloom kurti to a bridal piece built over three months."
        />
        <Reveal direction="up" className="shrink-0">
          <ButtonLink href="/collections" variant="underline">
            All collections
          </ButtonLink>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {/* Lead card */}
        <Link href={lead.href} className="group/col relative block">
          <ImageReveal className="relative aspect-4/5 w-full overflow-hidden rounded-panel lg:aspect-auto lg:h-full lg:min-h-[34rem]">
            <div className="relative h-full w-full">
              <Image
                src={lead.image}
                alt={lead.name}
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover/col:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                <p className="eyebrow text-brass-soft">{lead.meta}</p>
                <h3 className="mt-4 display-md text-on-dark">{lead.name}</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-on-dark-soft">
                  {lead.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-on-dark">
                  Explore
                  <Icon
                    name="arrow-right"
                    className="h-4 w-4 transition-transform duration-400 group-hover/col:translate-x-1.5"
                  />
                </span>
              </div>
            </div>
          </ImageReveal>
        </Link>

        {/* Stacked pair */}
        <div className="grid gap-6">
          {rest.map((collection, index) => (
            <Link
              key={collection.name}
              href={collection.href}
              className="group/col relative block"
            >
              <ImageReveal
                delay={0.1 + index * 0.08}
                className="relative aspect-16/10 w-full overflow-hidden rounded-panel"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover/col:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7 md:p-8">
                    <p className="eyebrow text-brass-soft">{collection.meta}</p>
                    <h3 className="mt-3 font-display text-2xl text-on-dark md:text-3xl">
                      {collection.name}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-on-dark-soft">
                      {collection.description}
                    </p>
                  </div>
                  <span className="absolute right-7 top-7 grid h-11 w-11 place-items-center rounded-full border border-on-dark/30 text-on-dark transition-colors duration-400 group-hover/col:border-brass-soft group-hover/col:bg-on-dark/10">
                    <Icon name="arrow-up-right" className="h-4 w-4" />
                  </span>
                </div>
              </ImageReveal>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
