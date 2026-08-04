import Image from "next/image";

import { galleryItems } from "@/data/home";
import { ImageReveal } from "@/components/motion/image-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

import { cn } from "@/lib/cn";

/**
 * Editorial gallery.
 *
 * A CSS-grid mosaic with explicit spans rather than a masonry library — the
 * layout is deterministic, needs no JS, and produces no layout shift.
 */
export function Gallery() {
  return (
    <section className="shell py-20 md:py-28">
      <SectionHeading
        eyebrow="Gallery"
        title="Recent work, out in the world"
        description="Pieces photographed after delivery, worn by the people they were made for."
      />

      <div className="mt-14 grid auto-rows-[13rem] grid-cols-2 gap-4 md:auto-rows-[15rem] md:grid-cols-4 md:gap-5">
        {galleryItems.map((item, index) => (
          <ImageReveal
            key={item.caption}
            delay={index * 0.06}
            className={cn(
              "group/gal relative overflow-hidden rounded-card bg-surface-sunk",
              item.span === "tall" && "row-span-2",
              item.span === "wide" && "col-span-2",
            )}
          >
            <div className="relative h-full w-full">
              <Image
                src={item.image}
                alt={item.caption}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover/gal:scale-[1.06]"
              />
              {/* Caption rises on hover; always available to screen readers via alt. */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-espresso/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/gal:opacity-100">
                <p className="translate-y-2 p-5 text-xs leading-5 text-on-dark transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/gal:translate-y-0">
                  {item.caption}
                </p>
              </div>
            </div>
          </ImageReveal>
        ))}
      </div>
    </section>
  );
}
