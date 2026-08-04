"use client";

import { useEffect, useRef } from "react";

import { processSteps } from "@/data/home";
import { prefersReducedMotion } from "@/lib/motion";
import { loadGsap } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

import { Icon } from "../icons";

/**
 * The five-step commission process, presented as a horizontally-pinned scroll on
 * desktop: the section holds still while the steps translate sideways.
 *
 * Deliberately degrades to a plain vertical list when pinning is inappropriate —
 * under `prefers-reduced-motion`, or below 1024px where pinning fights native
 * touch scrolling and tends to feel broken. `ScrollTrigger.matchMedia`-style
 * gating is handled by `gsap.matchMedia` so the trigger is torn down cleanly on
 * resize across the breakpoint.
 */
export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let mm: gsap.MatchMedia | null = null;
    let cancelled = false;

    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        // Distance the track must travel to bring its last panel flush right.
        const getDistance = () => track.scrollWidth - window.innerWidth;
        if (getDistance() <= 0) return;

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            // Scroll length matches travel distance, so the pace feels 1:1.
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    });

    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-espresso py-20 lg:py-0"
    >
      <div className="shell pt-0 lg:pt-24">
        <SectionHeading
          eyebrow="The Process"
          title="From a conversation to a finished garment"
          description="Five stages, three to four weeks, and two fittings. Nothing is cut until the toile is right."
          onDark
        />
      </div>

      {/* Horizontal track (pinned on desktop, wraps on mobile) */}
      <div
        ref={trackRef}
        className="mt-14 flex flex-col gap-6 px-5 lg:mt-20 lg:w-max lg:flex-row lg:gap-8 lg:px-[max(3rem,calc((100vw-90rem)/2+3rem))] lg:pb-24"
      >
        {processSteps.map((step) => (
          <article
            key={step.step}
            className="flex flex-col justify-between rounded-panel border border-on-dark/12 bg-espresso-soft/60 p-8 lg:h-[24rem] lg:w-[22rem] lg:shrink-0"
          >
            <div>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-5xl text-brass-soft/40">
                  {step.step}
                </span>
                <Icon name={step.icon} className="h-7 w-7 text-brass-soft" />
              </div>
              <h3 className="mt-8 font-display text-2xl leading-snug text-on-dark">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-on-dark-soft">
                {step.text}
              </p>
            </div>
            <span
              aria-hidden="true"
              className="mt-8 block h-px w-full bg-gradient-to-r from-brass-soft/50 to-transparent"
            />
          </article>
        ))}

        {/* Closing CTA panel, part of the same track */}
        <article className="flex flex-col justify-center gap-6 rounded-panel bg-brass-wash p-8 lg:h-[24rem] lg:w-[22rem] lg:shrink-0">
          <p className="font-display text-2xl leading-snug text-ink">
            Ready to start? A fitting takes twenty minutes.
          </p>
          <ButtonLink href="/custom-order" variant="primary">
            Begin a commission
            <Icon name="arrow-right" className="h-4 w-4" />
          </ButtonLink>
        </article>
      </div>
    </section>
  );
}
