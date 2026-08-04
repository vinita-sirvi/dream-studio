import Link from "next/link";

import { services } from "@/data/home";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

import { Icon } from "../icons";

/**
 * Tailoring services.
 *
 * Numbered rows rather than cards — reads like a price list from a workshop,
 * which suits the subject better than a grid of tiles.
 */
export function Services() {
  return (
    <section className="shell py-20 md:py-28">
      <SectionHeading
        eyebrow="Services"
        title="Four ways we can work together"
        description="Every route starts with a conversation and ends with a garment that fits. The difference is only how much of it we build from scratch."
      />

      <Reveal stagger={0.08} className="mt-14 border-t border-line">
        {services.map((service, index) => (
          <Link
            key={service.title}
            href={service.href}
            className="group/svc grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-3 border-b border-line py-8 transition-colors duration-500 hover:bg-canvas-warm md:grid-cols-[auto_1.1fr_1.6fr_auto] md:items-center md:gap-x-10 md:px-4"
          >
            <span className="font-display text-sm text-brass">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-4">
              <Icon
                name={service.icon}
                className="h-6 w-6 shrink-0 text-brass transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/svc:-translate-y-0.5"
              />
              <h3 className="font-display text-xl leading-snug text-ink md:text-2xl">
                {service.title}
              </h3>
            </div>

            <p className="col-span-2 text-sm leading-7 text-ink-soft md:col-span-1">
              {service.text}
            </p>

            <div className="col-span-2 flex items-center gap-5 md:col-span-1 md:justify-end">
              <span className="text-sm text-ink">{service.price}</span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-brass-ink transition-all duration-400 group-hover/svc:border-brass group-hover/svc:bg-espresso group-hover/svc:text-on-dark">
                <Icon name="arrow-right" className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
