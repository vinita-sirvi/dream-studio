import Image from "next/image";
import type { Metadata } from "next";

import { craftPoints, IMAGES, whyChooseUs } from "@/data/home";
import { brandContact } from "@/data/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Icon } from "@/components/site/icons";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "The Atelier",
  description:
    "Who we are, how the workroom operates, and why every garment is cut for one person rather than a size.",
};

const timeline = [
  {
    year: "2024",
    title: "Two tailors and one table",
    text: "Started in a single room in Bandra, taking alterations from neighbours and slowly building a pattern library.",
  },
  {
    year: "2025",
    title: "The weaver partnerships",
    text: "Began buying handloom directly from six weaving families in Chanderi, Bhagalpur and Kanchipuram, paying before the cloth was woven.",
  },
  {
    year: "2025",
    title: "Remote fittings",
    text: "Introduced guided video measurement so people outside Mumbai could order without travelling to the studio.",
  },
  {
    year: "2026",
    title: "Eighteen tailors",
    text: "The workroom now holds eighteen master tailors, and we cap bridal commissions each season rather than stretch them.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="The Atelier"
        title="We do not make sizes. We make garments."
        accent="One person at a time"
        description="A size is an average of many bodies, which means it fits none of them exactly. Everything we do follows from taking that seriously."
        image={IMAGES.ethnic}
        crumbs={[{ label: "Atelier" }]}
      />

      {/* Story */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Our position"
              title="The fit is the product"
              description={
                <>
                  <p>
                    Most clothing is designed for a manufacturing process first
                    and a body second. Patterns are graded up and down from a
                    single sample size, which stretches some measurements and
                    compresses others, and the result is a garment that fits an
                    average nobody actually has.
                  </p>
                  <p className="mt-5">
                    We work the other way round. A pattern is drafted for one
                    person, cut in cloth chosen with them, fitted in muslin
                    before anything expensive is cut, and finished by hand. It is
                    slower and it does not scale neatly. It also produces clothes
                    people keep for a decade.
                  </p>
                  <p className="mt-5">
                    That is the whole proposition. Everything else — the weaver
                    relationships, the twelve measurements, the ninety days of
                    free alterations — exists to support it.
                  </p>
                </>
              }
            />

            <Reveal direction="up" delay={0.2} className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/custom-order">
                Start a commission
                <Icon name="arrow-right" className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Visit the studio
              </ButtonLink>
            </Reveal>
          </div>

          <div className="relative">
            <ImageReveal className="relative aspect-3/4 overflow-hidden rounded-panel">
              <Parallax amount={-9} className="h-[116%] w-full">
                <div className="relative h-full w-full">
                  <Image
                    src={IMAGES.lehenga}
                    alt="A finished lehenga on the studio form"
                    fill
                    sizes="(min-width: 1024px) 42vw, 92vw"
                    className="object-cover"
                  />
                </div>
              </Parallax>
            </ImageReveal>

            {/* Pull quote overlapping the image */}
            <Reveal
              direction="left"
              delay={0.25}
              className="relative -mt-12 ml-6 max-w-sm rounded-card border border-line bg-canvas p-7 shadow-lift lg:-mt-16"
            >
              <Icon name="quote" className="h-6 w-6 text-brass-soft" />
              <p className="mt-4 font-display text-xl leading-snug text-ink">
                If a garment needs an apology when you hand it over, it should not
                leave the workroom.
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-ink-faint">
                Divya Menon · Founder
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-y border-line bg-canvas-warm py-16 md:py-20">
        <div className="shell">
          <Reveal stagger={0.09} className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div key={item.label}>
                <p className="font-display text-5xl text-brass">{item.value}</p>
                <h3 className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-ink">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {item.text}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="shell py-20 md:py-28">
        <SectionHeading
          eyebrow="How we got here"
          title="Four years, told briefly"
        />

        <Reveal stagger={0.1} className="mt-14 border-t border-line">
          {timeline.map((entry) => (
            <div
              key={entry.title}
              className="grid gap-3 border-b border-line py-8 md:grid-cols-[8rem_1fr_1.4fr] md:gap-10"
            >
              <span className="font-display text-2xl text-brass">
                {entry.year}
              </span>
              <h3 className="font-display text-xl leading-snug text-ink">
                {entry.title}
              </h3>
              <p className="text-sm leading-7 text-ink-soft">{entry.text}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Craft */}
      <section className="bg-espresso py-20 md:py-28">
        <div className="shell">
          <SectionHeading
            eyebrow="Construction"
            title="What we do differently on the inside"
            onDark
          />
          <Reveal
            stagger={0.09}
            className="mt-14 grid gap-px bg-on-dark/12 md:grid-cols-2"
          >
            {craftPoints.map((point) => (
              <div key={point.title} className="bg-espresso p-8">
                <h3 className="font-display text-xl text-on-dark">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-on-dark-soft">
                  {point.text}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Visit */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-10 rounded-panel border border-line bg-canvas-warm p-8 md:grid-cols-[1.2fr_1fr] md:items-center md:p-12">
          <div>
            <SectionHeading
              eyebrow="Visit"
              title="Come and handle the cloth"
              description="Swatches read completely differently in person. If you are in Mumbai, come by — no appointment needed for fabric browsing."
              size="md"
            />
          </div>
          <div className="grid gap-4 text-sm">
            <p className="flex gap-3 leading-6 text-ink-soft">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
              {brandContact.address}
            </p>
            <p className="flex gap-3 leading-6 text-ink-soft">
              <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
              {brandContact.hours}
            </p>
            <ButtonLink href="/contact" variant="secondary" className="mt-2 justify-self-start">
              Get in touch
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
