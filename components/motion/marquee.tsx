"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { prefersReducedMotion } from "@/lib/motion";
import { loadGsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full pass. Higher is slower. */
  speed?: number;
  direction?: "left" | "right";
  /** Pause while hovered — courteous when the strip contains links. */
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * Seamless infinite marquee.
 *
 * The track is duplicated once and translated by exactly -50%, so the loop is
 * invisible. Under reduced motion it renders as a normal horizontally
 * scrollable strip — the content stays reachable, it simply does not move.
 */
export function Marquee({
  children,
  speed = 32,
  direction = "left",
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (prefersReducedMotion()) return;

    let cancelled = false;

    loadGsap().then(({ gsap }) => {
      if (cancelled || !trackRef.current) return;

      // Track holds two identical copies, so -50% lands exactly on the seam.
      gsap.set(track, { xPercent: direction === "left" ? 0 : -50 });

      tweenRef.current = gsap.to(track, {
        xPercent: direction === "left" ? -50 : 0,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    });

    return () => {
      cancelled = true;
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [speed, direction]);

  const onEnter = () => {
    if (pauseOnHover) tweenRef.current?.pause();
  };
  const onLeave = () => {
    if (pauseOnHover) tweenRef.current?.resume();
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        // Feathered edges so items fade rather than clip at the boundary.
        "[mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]",
        className,
      )}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocusCapture={onEnter}
      onBlurCapture={onLeave}
    >
      <div
        ref={trackRef}
        className="flex w-max will-change-transform motion-reduce:overflow-x-auto"
      >
        <div className="flex shrink-0 items-center">{children}</div>
        {/* Duplicate is decorative — hide the repeat from screen readers. */}
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
