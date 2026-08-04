/**
 * Shared motion vocabulary.
 *
 * Keeping easings and durations in one place is what makes the site feel like a
 * single designed system rather than a pile of individually-tuned animations.
 * These values intentionally mirror the CSS custom properties in globals.css.
 */

/** GSAP-format easing strings, matched to the CSS `--ease-*` tokens. */
export const EASE = {
  /** Long, luxurious deceleration. Default for reveals and hero entrances. */
  outExpo: "expo.out",
  /** Slightly snappier deceleration. Good for hover and UI state changes. */
  outQuart: "power3.out",
  /** Symmetrical. Use for things that move and come back (drawers, menus). */
  inOutQuart: "power4.inOut",
  /** Tiny overshoot for playful accents (wishlist heart, badges). */
  backOut: "back.out(2.2)",
} as const;

export const DURATION = {
  fast: 0.28,
  base: 0.6,
  slow: 0.9,
  reveal: 1.1,
  hero: 1.4,
} as const;

/** Stagger presets, in seconds. */
export const STAGGER = {
  tight: 0.05,
  base: 0.08,
  loose: 0.14,
} as const;

/**
 * True when the visitor has asked the OS to reduce motion.
 * SSR-safe: returns `false` on the server so markup is never gated on it.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True for genuine mouse/trackpad pointers — used to gate cursor effects. */
export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

/**
 * Conservative capability probe for the WebGL hero.
 *
 * We would rather show the (very good) static fallback than run a shader on a
 * budget phone and tank both the frame rate and the battery.
 */
export function canRunWebglHero(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  if (!hasFinePointer()) return false;
  if (window.innerWidth < 1024) return false;

  const cores = navigator.hardwareConcurrency ?? 0;
  if (cores > 0 && cores < 4) return false;

  // `deviceMemory` is Chromium-only; absence is not disqualifying.
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  if (typeof memory === "number" && memory < 4) return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

/** Clamp helper used by parallax and zoom maths. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
