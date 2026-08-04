import Image from "next/image";

import { hero, IMAGES } from "@/data/home";
import { FabricBackdrop } from "@/components/three/fabric-backdrop";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { ButtonLink } from "@/components/ui/button";

import { Icon } from "../icons";

/**
 * Hero.
 *
 * Layered back to front:
 *  1. espresso base colour
 *  2. a still garment photograph, dimmed — this is the LCP element and is
 *     `priority`, so the hero has a fast, meaningful first paint
 *  3. the WebGL fabric, which mounts only on capable desktops and fades in over
 *     the photograph (absent entirely on mobile / reduced-motion)
 *  4. content
 *
 * Because the photograph carries the visual weight on its own, the 3D layer is
 * a genuine enhancement rather than a dependency.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-espresso">
      {/* Still image base */}
      <div className="absolute inset-0">
        <Image
          src={IMAGES.lehenga}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_22%] opacity-45"
        />
        {/* Scrims: vertical for text legibility, horizontal to seat the copy. */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/70 to-espresso/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-transparent to-transparent" />
      </div>

      {/* WebGL silk */}
      <div className="absolute inset-0 opacity-70 mix-blend-screen">
        <FabricBackdrop />
      </div>

      {/* Content */}
      <div className="shell relative z-10 grid gap-16 pb-20 pt-40 md:pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <Reveal direction="fade">
            <p className="eyebrow flex items-center gap-3 text-brass-soft">
              <span aria-hidden="true" className="h-px w-8 bg-brass-soft" />
              {hero.eyebrow}
            </p>
          </Reveal>

          <h1 className="mt-8 text-on-dark">
            <SplitReveal by="lines" immediate delay={0.15} className="display-hero block">
              {hero.title}
            </SplitReveal>
            <SplitReveal
              by="lines"
              immediate
              delay={0.35}
              className="display-hero mt-1 block italic text-brass-soft"
            >
              {hero.accent}
            </SplitReveal>
          </h1>

          <Reveal direction="up" delay={0.5}>
            <p className="mt-8 max-w-xl text-base leading-8 text-on-dark-soft md:text-lg md:leading-9">
              {hero.body}
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.62} className="mt-11 flex flex-wrap items-center gap-4">
            <Magnetic strength={10}>
              <ButtonLink href={hero.primaryCta.href} variant="onDark" size="lg">
                {hero.primaryCta.label}
                <Icon name="arrow-right" className="h-4 w-4" />
              </ButtonLink>
            </Magnetic>
            <ButtonLink
              href={hero.secondaryCta.href}
              variant="ghost"
              size="lg"
              className="border-on-dark-soft/40 text-on-dark hover:border-on-dark hover:bg-on-dark/10"
            >
              {hero.secondaryCta.label}
            </ButtonLink>
          </Reveal>
        </div>

        {/* Stats rail */}
        <Reveal
          direction="up"
          delay={0.7}
          stagger={0.1}
          className="grid grid-cols-3 gap-6 border-t border-on-dark/15 pt-8 lg:border-t-0 lg:border-l lg:border-on-dark/15 lg:pl-10 lg:pt-0"
        >
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl text-on-dark md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-on-dark-soft">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-7 right-6 hidden flex-col items-center gap-3 lg:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.28em] text-on-dark-soft [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="relative h-14 w-px overflow-hidden bg-on-dark/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2s_var(--ease-in-out-quart)_infinite] bg-brass-soft" />
        </span>
      </div>
    </section>
  );
}
