import Image from "next/image";

import { craftPoints, IMAGES } from "@/data/home";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { ImageReveal } from "@/components/motion/image-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Craftsmanship — an editorial two-column spread with parallax imagery.
 *
 * The images sit in overflow-hidden frames with over-sized children, so the
 * parallax travel never exposes an empty edge.
 */
export function Craftsmanship() {
  return (
    <section className="shell py-20 md:py-28">
      <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
        {/* Stacked, offset imagery */}
        <div className="relative">
          <ImageReveal className="relative aspect-3/4 w-full overflow-hidden rounded-panel">
            <Parallax amount={-10} className="h-[118%] w-full">
              <div className="relative h-full w-full">
                <Image
                  src={IMAGES.ethnic}
                  alt="A tailor hand-finishing an embroidered panel"
                  fill
                  sizes="(min-width: 1024px) 44vw, 92vw"
                  className="object-cover"
                />
              </div>
            </Parallax>
          </ImageReveal>

          {/* Inset detail shot, overlapping the main frame */}
          <ImageReveal
            from="left"
            delay={0.2}
            className="absolute -bottom-10 -right-4 hidden w-48 overflow-hidden rounded-card border-4 border-canvas md:block lg:-right-10 lg:w-56"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={IMAGES.blouse}
                alt="Close detail of a piped neckline"
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
          </ImageReveal>

          {/* Vertical caption rule */}
          <div
            aria-hidden="true"
            className="absolute -left-6 top-8 hidden items-center gap-3 lg:flex"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-faint [writing-mode:vertical-rl]">
              The Workroom
            </span>
            <span className="h-16 w-px bg-line-strong" />
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="Craftsmanship"
            title="The parts you cannot see are the parts that last"
            description="A garment's lifespan is decided by its construction, not its surface. Here is what we do differently on the inside."
          />

          <Reveal
            stagger={0.09}
            className="mt-12 grid gap-px overflow-hidden rounded-card bg-line"
          >
            {craftPoints.map((point) => (
              <div key={point.title} className="bg-canvas p-6 md:p-7">
                <h3 className="flex items-start gap-3 font-display text-lg text-ink">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-brass"
                  />
                  {point.title}
                </h3>
                <p className="mt-2.5 pl-[1.125rem] text-sm leading-7 text-ink-soft">
                  {point.text}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
