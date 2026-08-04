import { trustStrip } from "@/data/home";
import { Reveal } from "@/components/motion/reveal";

import { Icon } from "../icons";

/**
 * Reassurance bar. Sits just before the closing CTA to answer the last
 * practical objections — delivery, payment safety, alterations.
 */
export function TrustBar() {
  return (
    <section className="shell py-16 md:py-20" aria-label="Buying with confidence">
      <Reveal
        stagger={0.08}
        className="grid gap-px overflow-hidden rounded-panel bg-line sm:grid-cols-2 lg:grid-cols-4"
      >
        {trustStrip.map((item) => (
          <div
            key={item.title}
            className="group flex items-start gap-4 bg-canvas p-7"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-brass transition-colors duration-400 group-hover:border-brass group-hover:bg-brass-wash">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-ink-soft">{item.text}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
