"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { EASE, hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import { loadGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type MagneticProps = {
  children: ReactNode;
  /** Maximum pull in pixels. */
  strength?: number;
  className?: string;
};

/**
 * Magnetic hover — the element leans toward the cursor, then springs back.
 *
 * Wraps rather than replaces the interactive element, so the child keeps its own
 * semantics, focus behaviour and keyboard handling. Touch and reduced-motion
 * visitors get a plain, fully functional wrapper.
 */
export function Magnetic({
  children,
  strength = 14,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !hasFinePointer()) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;

      // quickTo gives an interruptible, always-smooth tween without allocating a
      // new tween on every mousemove.
      const moveX = gsap.quickTo(el, "x", { duration: 0.4, ease: EASE.outQuart });
      const moveY = gsap.quickTo(el, "y", { duration: 0.4, ease: EASE.outQuart });

      const onMove = (event: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = event.clientX - (rect.left + rect.width / 2);
        const relY = event.clientY - (rect.top + rect.height / 2);
        // Normalise by half-size so `strength` is the true pixel maximum.
        moveX((relX / (rect.width / 2)) * strength);
        moveY((relY / (rect.height / 2)) * strength);
      };

      const onLeave = () => {
        moveX(0);
        moveY(0);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      cleanup = () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        gsap.killTweensOf(el);
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [strength]);

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {children}
    </span>
  );
}
