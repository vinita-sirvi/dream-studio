"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { EASE, prefersReducedMotion } from "@/lib/motion";
import { loadGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type ImageRevealProps = {
  children: ReactNode;
  /** Direction the covering mask retreats toward. */
  from?: "bottom" | "top" | "left" | "right";
  delay?: number;
  className?: string;
};

const CLIP_FROM: Record<
  NonNullable<ImageRevealProps["from"]>,
  string
> = {
  bottom: "inset(0 0 100% 0)",
  top: "inset(100% 0 0 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
};

/**
 * Uncovers an image by animating a clip-path mask away, with a slight
 * counter-scale so the photo settles rather than snapping into place.
 *
 * Expects a single element child (typically a `next/image` wrapper).
 */
export function ImageReveal({
  children,
  from = "bottom",
  delay = 0,
  className,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const inner = el.firstElementChild;
    if (!(inner instanceof HTMLElement)) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          inner,
          { clipPath: CLIP_FROM[from], scale: 1.12 },
          {
            clipPath: "inset(0 0 0 0)",
            scale: 1,
            duration: 1.3,
            delay,
            ease: EASE.outExpo,
            onComplete: () => inner.setAttribute("data-motion-done", ""),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [from, delay]);

  return (
    <div ref={ref} data-image-reveal={from} className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
}
