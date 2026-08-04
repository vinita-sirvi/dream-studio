import Image from "next/image";
import Link from "next/link";

import { categories } from "@/data/home";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

import { Icon } from "../icons";

/**
 * Shop-by-category grid.
 *
 * Links use the existing `/shop?category=<slug>` server-side filter rather than
 * new routes. Hover lifts the image and slides a brass rule across the label.
 */
export function CategoryGrid() {
  return (
    <section className="bg-canvas-warm py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by category"
          accent="Six forms, endlessly adjustable"
          align="center"
          className="mx-auto"
        />

        <Reveal
          stagger={0.07}
          className="mt-14 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:gap-x-6 xl:grid-cols-6"
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group/cat block"
            >
              <div className="relative overflow-hidden rounded-card bg-surface-sunk">
                <div className="relative aspect-3/4 w-full">
                  <Image
                    src={category.image}
                    alt={`${category.name} — tailored ${category.name.toLowerCase()}`}
                    fill
                    sizes="(min-width: 1280px) 15vw, (min-width: 768px) 30vw, 45vw"
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover/cat:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/55 to-transparent opacity-0 transition-opacity duration-500 group-hover/cat:opacity-100" />
                  <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-3 items-center gap-1.5 rounded-full bg-surface/95 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-ink opacity-0 backdrop-blur-sm transition-all duration-500 ease-[var(--ease-out-expo)] group-hover/cat:translate-y-0 group-hover/cat:opacity-100">
                    View
                    <Icon name="arrow-right" className="h-3 w-3" />
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <h3 className="font-display text-base text-ink md:text-lg">
                  {category.name}
                </h3>
                <p className="mt-1 text-[11px] text-ink-faint">{category.count}</p>
                {/* Rule grows from the centre on hover. */}
                <span
                  aria-hidden="true"
                  className="mx-auto mt-2.5 block h-px w-0 bg-brass transition-all duration-500 ease-[var(--ease-out-expo)] group-hover/cat:w-10"
                />
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
