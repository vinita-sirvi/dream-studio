import Image from "next/image";

import { IMAGES, measurementGuide } from "@/data/home";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

import { Icon } from "../icons";

/**
 * Measurement process. Dark band, so it separates the two light editorial
 * sections either side of it and gives the page a rhythm.
 */
export function Measurement() {
  return (
    <section className="relative isolate overflow-hidden bg-espresso py-20 md:py-28">
      {/* Faint background texture, well below text contrast threshold */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.14]">
        <Parallax amount={-8} className="h-[116%] w-full">
          <div className="relative h-full w-full">
            <Image
              src={IMAGES.coordSet}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Parallax>
      </div>

      <div className="shell relative grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Measurements"
            title="Twelve numbers, taken once"
            accent="Then kept on file forever"
            description="Most labels work from three measurements. We take twelve, including shoulder slope and underbust — the two that most often explain why nothing off the rack ever sits right."
            onDark
          />

          <Reveal direction="up" delay={0.2} className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/size-guide" variant="onDark">
              Read the size guide
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="/contact"
              variant="ghost"
              className="border-on-dark-soft/40 text-on-dark hover:border-on-dark hover:bg-on-dark/10"
            >
              Book a video fitting
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal
          stagger={0.1}
          className="grid content-start gap-5 lg:pt-4"
        >
          {measurementGuide.map((item, index) => (
            <div
              key={item.title}
              className="flex gap-5 rounded-card border border-on-dark/12 bg-espresso-soft/50 p-6"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-brass-soft/40 font-display text-base text-brass-soft">
                {index + 1}
              </span>
              <div>
                <h3 className="font-display text-lg text-on-dark">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-on-dark-soft">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
