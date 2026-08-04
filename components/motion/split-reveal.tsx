"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import type SplitType from "split-type";

import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";
import { loadGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type SplitRevealProps = {
  children: ReactNode;
  /** Split granularity. "lines" reads best for headings. */
  by?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  /** Fire as soon as mounted rather than waiting for scroll (hero headings). */
  immediate?: boolean;
  as?: ElementType;
  className?: string;
};

/**
 * Per-line / word / character text reveal.
 *
 * SplitType rewrites the element's innerHTML into wrapped spans, so this must
 * run after hydration. The text is present and readable in the server HTML
 * beforehand — screen readers and crawlers see the real sentence, and if JS
 * never runs the heading simply appears normally.
 *
 * Both GSAP and SplitType are dynamically imported so neither sits on the
 * blocking initial bundle.
 */
export function SplitReveal({
  children,
  by = "lines",
  delay = 0,
  stagger = 0.09,
  immediate = false,
  as: Tag = "div",
  className,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let split: SplitType | null = null;
    let ctx: gsap.Context | null = null;
    let cancelled = false;
    let resizeTimer: number | undefined;

    async function run() {
      const [{ gsap }, { default: SplitTypeCtor }] = await Promise.all([
        loadGsap(),
        import("split-type"),
      ]);

      // Wait for fonts before splitting: measuring lines against a fallback face
      // produces wrong line breaks that visibly reflow when the webfont lands.
      if ("fonts" in document) await document.fonts.ready;

      // Re-read the ref after awaiting — the element may have unmounted, and TS
      // cannot carry the earlier non-null narrowing across the await.
      const target = ref.current;
      if (cancelled || !target) return;

      split = new SplitTypeCtor(target, {
        types: by === "lines" ? "lines" : by === "words" ? "words" : "chars",
        // `.split-line` gives us the overflow-hidden mask for the rise-up.
        lineClass: "split-line",
      });

      const targets =
        by === "lines" ? split.lines : by === "words" ? split.words : split.chars;

      if (!targets?.length) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { yPercent: 108, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: DURATION.reveal,
            ease: EASE.outExpo,
            stagger,
            delay,
            ...(immediate
              ? {}
              : {
                  scrollTrigger: {
                    trigger: target,
                    start: "top 88%",
                    once: true,
                  },
                }),
          },
        );
      }, target);
    }

    void run();

    // Re-split on resize so line breaks stay correct.
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ctx?.revert();
        split?.revert();
        void run();
      }, 220);
    };
    if (by === "lines") window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      ctx?.revert();
      split?.revert();
    };
  }, [by, delay, stagger, immediate]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
