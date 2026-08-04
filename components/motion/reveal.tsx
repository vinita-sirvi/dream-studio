"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";
import { loadGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "fade";

type RevealProps = {
  children: ReactNode;
  /** Which direction the content travels from. */
  direction?: RevealDirection;
  /** Seconds to wait after the trigger fires. */
  delay?: number;
  duration?: number;
  /**
   * When set, direct children are revealed one after another instead of the
   * wrapper animating as a single block.
   */
  stagger?: number | false;
  /** ScrollTrigger start position. Default reveals a little before centre. */
  start?: string;
  /** Render a different element (e.g. "li", "section"). */
  as?: ElementType;
  className?: string;
};

/**
 * Scroll-triggered reveal.
 *
 * Wraps server-rendered children — only the animation logic is client-side, so
 * the markup inside still streams from the server and is fully indexable.
 *
 * The hidden initial state lives in CSS under `html.motion-ready` (see
 * globals.css), which is only present once <SmoothScroll> has confirmed it will
 * animate. That means no-JS and reduced-motion visitors see everything.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = DURATION.reveal,
  stagger = false,
  start = "top 85%",
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    // GSAP is loaded on demand — see lib/gsap.ts for why.
    loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;

      // Animate the children themselves when staggering, otherwise the wrapper.
      const targets =
        stagger !== false
          ? Array.from(el.children).filter(
              (child): child is HTMLElement => child instanceof HTMLElement,
            )
          : [el];

      if (!targets.length) return;

      ctx = gsap.context(() => {
        gsap.to(targets, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: EASE.outExpo,
          stagger: stagger === false ? 0 : stagger,
          // Release the compositor hint once finished.
          onComplete: () => {
            for (const target of targets) {
              target.setAttribute("data-motion-done", "");
            }
          },
          scrollTrigger: { trigger: el, start, once: true },
        });
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [direction, delay, duration, stagger, start]);

  // `data-reveal` hides the wrapper; `data-reveal-group` hides its children.
  // Both are styled only under `html.motion-ready`, so without JS neither hides
  // anything. Never express this as a plain utility class.
  const revealAttrs =
    stagger === false
      ? { "data-reveal": direction }
      : { "data-reveal-group": direction };

  return (
    <Tag ref={ref} className={cn(className)} {...revealAttrs}>
      {children}
    </Tag>
  );
}
