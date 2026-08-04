"use client";

import { useSyncExternalStore } from "react";

/**
 * Client-environment hooks built on `useSyncExternalStore`.
 *
 * Why not `useState` + `useEffect`? Capability values (media queries, WebGL
 * support, scroll position) are external state that does not exist during SSR.
 * Reading them with setState-in-an-effect causes an extra render pass and is
 * exactly the pattern `react-hooks/set-state-in-effect` warns about.
 *
 * `useSyncExternalStore` is the intended API: it takes an explicit server
 * snapshot, subscribes properly, and commits the real value in one pass.
 */

const noopSubscribe = () => () => {};

/**
 * Tracks a CSS media query.
 * Returns `serverValue` (default false) during SSR and initial hydration.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return noopSubscribe();
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/**
 * One-shot capability probe that cannot change over the page's lifetime
 * (e.g. WebGL support). Evaluated once on the client, never re-subscribed.
 */
export function useCapability(probe: () => boolean): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    probe,
    () => false, // server: assume unsupported, so nothing heavy is rendered
  );
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolledPast(threshold: number): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return noopSubscribe();
      window.addEventListener("scroll", onChange, { passive: true });
      return () => window.removeEventListener("scroll", onChange);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}
