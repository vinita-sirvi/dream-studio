import Image from "next/image";

import { socialShowcase } from "@/data/home";
import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";

import { Icon } from "../icons";

/**
 * Instagram-style showcase.
 *
 * A continuously scrolling image strip. Full-bleed rather than inside the shell,
 * so it reads as a band across the page.
 */
export function SocialShowcase() {
  return (
    <section className="overflow-hidden border-y border-line bg-canvas-warm py-16 md:py-20">
      <div className="shell">
        <Reveal direction="up" className="flex flex-col items-center gap-3 text-center">
          <p className="eyebrow flex items-center gap-3 text-brass-ink">
            <span aria-hidden="true" className="h-px w-7 bg-brass" />
            Follow along
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer noopener"
            className="group/ig inline-flex items-center gap-3 font-display text-3xl text-ink transition-colors hover:text-brass-ink md:text-4xl"
          >
            <Icon name="instagram" className="h-7 w-7 text-brass" />
            @divyaanddesign
            <Icon
              name="arrow-up-right"
              className="h-5 w-5 text-brass transition-transform duration-400 group-hover/ig:translate-x-1 group-hover/ig:-translate-y-1"
            />
          </a>
          <p className="max-w-md text-sm leading-7 text-ink-soft">
            Fabric arrivals, work in progress, and finished pieces on the people
            they were made for.
          </p>
        </Reveal>
      </div>

      <Marquee speed={44} className="mt-12" direction="right">
        {socialShowcase.map((item, index) => (
          <a
            key={`${item.alt}-${index}`}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer noopener"
            className="group/tile relative mx-2.5 block h-56 w-44 shrink-0 overflow-hidden rounded-card bg-surface-sunk md:h-72 md:w-56"
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="224px"
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/tile:scale-105"
            />
            <span className="absolute inset-0 grid place-items-center bg-espresso/45 opacity-0 transition-opacity duration-400 group-hover/tile:opacity-100">
              <Icon name="instagram" className="h-6 w-6 text-on-dark" />
            </span>
          </a>
        ))}
      </Marquee>
    </section>
  );
}
