"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { prefersReducedMotion } from "@/lib/motion";
import { loadGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type ParallaxProps = {
  children: ReactNode;
  /**
   * Travel distance in percent of the element's own height across the full
   * scroll pass. Negative moves up (slower than scroll — the classic feel).
   */
  amount?: number;
  axis?: "y" | "x";
  className?: string;
};

/**
 * Scroll-linked parallax.
 *
 * Pair with an overflow-hidden parent and an over-sized child (e.g. `h-[120%]`)
 * so the movement never reveals an empty edge.
 */
export function Parallax({
  children,
  amount = -14,
  axis = "y",
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { [axis === "y" ? "yPercent" : "xPercent"]: -amount / 2 },
          {
            [axis === "y" ? "yPercent" : "xPercent"]: amount / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              // Ties position directly to scroll, smoothed over ~0.6s.
              scrub: 0.6,
            },
          },
        );
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [amount, axis]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
