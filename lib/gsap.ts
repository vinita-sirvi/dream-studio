"use client";

import type { gsap as GsapType } from "gsap";

type GsapBundle = {
  gsap: typeof GsapType;
};

let pending: Promise<GsapBundle> | null = null;

/**
 * Loads GSAP + ScrollTrigger on demand, once per page load.
 *
 * Why dynamic: every animation in this project runs inside an effect, i.e. after
 * hydration. A static `import { gsap } from "gsap"` therefore put ~65KB gzipped
 * on the *blocking* initial bundle of every route — including static policy pages
 * whose only animation is a fade-in — for no benefit, because nothing can animate
 * before hydration anyway.
 *
 * Moving it behind `import()` keeps the animations identical while taking GSAP
 * off the critical path. The promise is cached so parallel callers share one
 * network request and one plugin registration.
 */
export function loadGsap(): Promise<GsapBundle> {
  pending ??= (async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);
    gsap.registerPlugin(ScrollTrigger);
    return { gsap };
  })();

  return pending;
}

/** ScrollTrigger, for callers that need the class itself (refresh, matchMedia). */
export async function loadScrollTrigger() {
  const [{ ScrollTrigger }] = await Promise.all([
    import("gsap/ScrollTrigger"),
    loadGsap(),
  ]);
  return ScrollTrigger;
}
