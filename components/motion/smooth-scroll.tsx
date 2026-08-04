"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

import { prefersReducedMotion } from "@/lib/motion";
import { loadGsap, loadScrollTrigger } from "@/lib/gsap";

/**
 * Owns smooth scrolling and the ScrollTrigger lifecycle for the whole site.
 *
 * Mount once, high in the tree. Renders nothing.
 *
 * Two responsibilities that must stay together:
 *  1. Lenis replaces native scrolling with an interpolated virtual scroll.
 *  2. ScrollTrigger must be told about that, or every scroll-driven animation
 *     reads stale positions. We drive `ScrollTrigger.update` from Lenis, and
 *     drive Lenis from `gsap.ticker` so there is exactly one rAF loop.
 *
 * Under `prefers-reduced-motion` this bails out entirely: no Lenis, no
 * `motion-ready` class, so the CSS in globals.css never hides anything and the
 * page scrolls natively.
 *
 * Lenis and GSAP are both dynamically imported, so they stay off the blocking
 * initial bundle.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    let gsapRef: Awaited<ReturnType<typeof loadGsap>>["gsap"] | null = null;
    let update: (() => void) | null = null;
    let cancelled = false;

    async function init() {
      const [{ gsap }, ScrollTrigger, { default: LenisCtor }] =
        await Promise.all([loadGsap(), loadScrollTrigger(), import("lenis")]);

      if (cancelled) return;
      gsapRef = gsap;

      // Signals to the CSS that it is safe to hide not-yet-revealed content.
      // Set here (not in the markup) so no-JS visitors always see everything.
      document.documentElement.classList.add("motion-ready");

      lenis = new LenisCtor({
        duration: 1.05,
        // Gentle exponential ease-out — the "expensive" scroll feel.
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Native touch scrolling beats any JS emulation on mobile.
        syncTouch: false,
        touchMultiplier: 1.6,
      });

      update = () => ScrollTrigger.update();
      lenis.on("scroll", update);

      tick = (time: number) => {
        // gsap.ticker reports seconds; Lenis wants milliseconds.
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Exposed for components that pause scrolling (dialogs, mobile nav).
      window.__lenis = lenis;
    }

    void init();

    return () => {
      cancelled = true;
      if (tick && gsapRef) gsapRef.ticker.remove(tick);
      if (lenis && update) lenis.off("scroll", update);
      lenis?.destroy();
      delete window.__lenis;
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  // On route change: jump to top instantly and rebuild trigger positions once
  // the new layout has painted. Next 16 no longer fights `scroll-behavior`, so
  // this is a plain instant jump — never a slow glide.
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });

    let raf = 0;
    let cancelled = false;

    // Only refreshes if ScrollTrigger has already been loaded by something.
    void loadScrollTrigger().then((ScrollTrigger) => {
      if (cancelled) return;
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}

/** Stop/start the virtual scroller — used for modals and the mobile menu. */
export function setScrollLocked(locked: boolean) {
  const lenis = window.__lenis;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  // Fallback for reduced-motion visitors, where Lenis never mounted.
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
