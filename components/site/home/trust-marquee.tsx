import { marqueeItems } from "@/data/home";
import { Marquee } from "@/components/motion/marquee";

/**
 * Scrolling promise strip. Sits directly under the hero as a palate cleanser
 * between the dark hero and the light page body.
 */
export function TrustMarquee() {
  return (
    <section
      aria-label="Our promises"
      className="border-y border-line bg-canvas-warm py-5"
    >
      <Marquee speed={38} pauseOnHover={false}>
        {marqueeItems.map((item) => (
          <span key={item} className="flex items-center">
            <span className="px-8 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft">
              {item}
            </span>
            <span
              aria-hidden="true"
              className="h-1 w-1 rotate-45 bg-brass"
            />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
