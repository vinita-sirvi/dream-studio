import { whyChooseUs } from "@/data/home";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Why-choose-us, expressed as four numbers.
 *
 * Specific figures beat adjectives — "12 measurements" says more about the
 * business than "premium quality" ever could.
 */
export function WhyChooseUs() {
  return (
    <section className="bg-canvas-warm py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Why the atelier"
          title="Four numbers that explain the difference"
          align="center"
          className="mx-auto"
        />

        <Reveal
          stagger={0.1}
          className="mt-14 grid gap-px overflow-hidden rounded-panel bg-line sm:grid-cols-2 lg:grid-cols-4"
        >
          {whyChooseUs.map((item) => (
            <div
              key={item.label}
              className="group flex flex-col gap-3 bg-canvas p-8 text-center md:p-10"
            >
              <p className="font-display text-5xl text-brass transition-transform duration-600 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 md:text-6xl">
                {item.value}
              </p>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink">
                {item.label}
              </h3>
              <p className="text-sm leading-6 text-ink-soft">{item.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
