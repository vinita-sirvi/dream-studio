import type Lenis from "lenis";

declare global {
  interface Window {
    /**
     * The single Lenis instance created by <SmoothScroll>.
     * Undefined under `prefers-reduced-motion`, where Lenis is never mounted —
     * always guard before use.
     */
    __lenis?: Lenis;
  }
}

export {};
