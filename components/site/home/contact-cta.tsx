import Image from "next/image";

import { IMAGES } from "@/data/home";
import { brandContact } from "@/data/navigation";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { ButtonLink } from "@/components/ui/button";

import { Icon } from "../icons";

/**
 * Closing contact band. The last thing before the footer, so it carries the
 * primary conversion CTA plus the direct contact routes for people who would
 * rather talk to a person.
 */
export function ContactCta() {
  return (
    <section className="relative isolate overflow-hidden bg-espresso">
      <div aria-hidden="true" className="absolute inset-0 opacity-25">
        <Parallax amount={-8} className="h-[116%] w-full">
          <div className="relative h-full w-full">
            <Image
              src={IMAGES.dress}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/80 to-espresso/40" />
      </div>

      <div className="shell relative grid gap-14 py-24 md:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
        <div>
          <Reveal direction="fade">
            <p className="eyebrow flex items-center gap-3 text-brass-soft">
              <span aria-hidden="true" className="h-px w-8 bg-brass-soft" />
              Let&rsquo;s begin
            </p>
          </Reveal>

          <SplitReveal
            as="h2"
            by="lines"
            className="mt-7 display-xl text-on-dark"
          >
            Tell us what you have in mind. We&rsquo;ll tell you honestly whether we
            can make it.
          </SplitReveal>

          <Reveal direction="up" delay={0.2} className="mt-10 flex flex-wrap gap-4">
            <Magnetic strength={10}>
              <ButtonLink href="/custom-order" variant="onDark" size="lg">
                Start a commission
                <Icon name="arrow-right" className="h-4 w-4" />
              </ButtonLink>
            </Magnetic>
            <ButtonLink
              href="/contact"
              variant="ghost"
              size="lg"
              className="border-on-dark-soft/40 text-on-dark hover:border-on-dark hover:bg-on-dark/10"
            >
              Ask a question
            </ButtonLink>
          </Reveal>
        </div>

        {/* Direct contact routes */}
        <Reveal
          stagger={0.09}
          className="grid gap-px overflow-hidden rounded-panel bg-on-dark/12"
        >
          <a
            href={`tel:${brandContact.phone.replace(/\s/g, "")}`}
            className="group/row flex items-center gap-5 bg-espresso-soft/70 p-6 transition-colors hover:bg-espresso-soft"
          >
            <Icon name="phone" className="h-5 w-5 shrink-0 text-brass-soft" />
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-on-dark-soft">
                Call the studio
              </span>
              <span className="mt-1 block truncate font-display text-xl text-on-dark">
                {brandContact.phone}
              </span>
            </span>
            <Icon
              name="arrow-up-right"
              className="ml-auto h-4 w-4 shrink-0 text-on-dark-soft transition-transform duration-400 group-hover/row:translate-x-1 group-hover/row:-translate-y-1"
            />
          </a>

          <a
            href={`mailto:${brandContact.email}`}
            className="group/row flex items-center gap-5 bg-espresso-soft/70 p-6 transition-colors hover:bg-espresso-soft"
          >
            <Icon name="mail" className="h-5 w-5 shrink-0 text-brass-soft" />
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-on-dark-soft">
                Email us
              </span>
              <span className="mt-1 block truncate font-display text-xl text-on-dark">
                {brandContact.email}
              </span>
            </span>
            <Icon
              name="arrow-up-right"
              className="ml-auto h-4 w-4 shrink-0 text-on-dark-soft transition-transform duration-400 group-hover/row:translate-x-1 group-hover/row:-translate-y-1"
            />
          </a>

          <div className="flex items-start gap-5 bg-espresso-soft/70 p-6">
            <Icon name="pin" className="mt-1 h-5 w-5 shrink-0 text-brass-soft" />
            <span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-on-dark-soft">
                Visit the atelier
              </span>
              <span className="mt-1 block text-sm leading-6 text-on-dark">
                {brandContact.address}
              </span>
              <span className="mt-2 block text-xs text-on-dark-soft">
                {brandContact.hours}
              </span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
