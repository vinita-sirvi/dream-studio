"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";

/**
 * Hairline reading-progress bar pinned under the header.
 *
 * Uses a scaleX transform (compositor-only, no layout) driven from a passive
 * scroll listener. Hidden from assistive tech — it is pure decoration and the
 * information is already conveyed by the scrollbar.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      el.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    };

    // Coalesce scroll events into one write per frame.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden"
    >
      <div
        ref={ref}
        className="h-full w-full origin-left scale-x-0 bg-brass will-change-transform"
      />
    </div>
  );
}
