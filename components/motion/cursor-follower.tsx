"use client";

import { useEffect, useRef } from "react";

import { EASE, hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import { loadGsap } from "@/lib/gsap";
import { useCapability } from "@/lib/use-client-env";

/**
 * Custom cursor: a small brass dot with a trailing ring that grows over
 * interactive elements.
 *
 * Purely additive — the native cursor is never hidden, so nobody can lose track
 * of where they are pointing. Mounts only for fine pointers with motion enabled,
 * and renders nothing at all otherwise (no DOM, no listeners).
 *
 * Elements can opt into the "expanded" state with `data-cursor="grow"`.
 */
export function CursorFollower() {
  // Server snapshot is `false`, so nothing is rendered until the client confirms
  // a fine pointer with motion enabled.
  const enabled = useCapability(
    () => hasFinePointer() && !prefersReducedMotion(),
  );
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    loadGsap().then(({ gsap }) => {
    if (cancelled) return;

    // The dot tracks tightly; the ring lags for a sense of weight.
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: EASE.outQuart });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: EASE.outQuart });

    let visible = false;

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    // Grow the ring over anything clickable.
    const interactiveSelector =
      'a, button, [role="button"], input, select, textarea, [data-cursor="grow"]';

    const onOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(interactiveSelector)) {
        gsap.to(ring, { scale: 2.1, opacity: 0.5, duration: 0.35, ease: EASE.outQuart });
        gsap.to(dot, { scale: 0.4, duration: 0.35, ease: EASE.outQuart });
      }
    };

    const onOut = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(interactiveSelector)) {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.35, ease: EASE.outQuart });
        gsap.to(dot, { scale: 1, duration: 0.35, ease: EASE.outQuart });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([dot, ring]);
    };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        className="absolute -left-4 -top-4 h-8 w-8 rounded-full border border-brass opacity-0 will-change-transform"
      />
      <div
        ref={dotRef}
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-brass-ink opacity-0 will-change-transform"
      />
    </div>
  );
}
