import { features } from "@/data/home";
import { Reveal } from "@/components/motion/reveal";

import { Icon } from "../icons";

/**
 * Five-column promise grid.
 *
 * Uses a border-based layout rather than cards — quieter, and it reads as one
 * continuous band instead of five competing boxes.
 */
export function PromiseStrip() {
  return (
    <section className="shell py-20 md:py-24" aria-label="Why buy from the atelier">
      <Reveal
        stagger={0.09}
        className="grid divide-line border-t border-line sm:grid-cols-2 sm:divide-x lg:grid-cols-5"
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group flex flex-col gap-4 border-b border-line px-0 py-8 sm:px-7 lg:border-b-0"
          >
            <Icon
              name={feature.icon}
              className="h-7 w-7 text-brass transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1"
            />
            <h3 className="font-display text-lg leading-snug text-ink">
              {feature.title}
            </h3>
            <p className="text-sm leading-6 text-ink-soft">{feature.text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
