import type { ElementType, ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { cn } from "@/lib/cn";

/** Small uppercase kicker with a brass rule. Used above most section titles. */
export function Eyebrow({
  children,
  className,
  onDark,
}: {
  children: ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <p
      className={cn(
        "eyebrow flex items-center gap-3",
        onDark ? "text-on-dark-soft" : "text-brass-ink",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-px w-7", onDark ? "bg-on-dark-soft" : "bg-brass")}
      />
      {children}
    </p>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  /** Rendered in display italic beneath the title — the "script" accent line. */
  accent?: string;
  description?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  /** Heading level. Only the page's primary heading should be h1. */
  as?: ElementType;
  size?: "xl" | "lg" | "md";
  className?: string;
  children?: ReactNode;
};

/**
 * The standard section header used across the site: kicker, display title with a
 * per-line reveal, optional italic accent, and supporting copy.
 */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
  onDark = false,
  as: Tag = "h2",
  size = "lg",
  className,
  children,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        centered && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal direction="fade">
          <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}

      <SplitReveal
        as={Tag}
        by="lines"
        className={cn(
          size === "xl" ? "display-xl" : size === "lg" ? "display-lg" : "display-md",
          onDark ? "text-on-dark" : "text-ink",
          centered ? "max-w-3xl" : "max-w-4xl",
        )}
      >
        {title}
      </SplitReveal>

      {accent ? (
        <Reveal direction="up" delay={0.1}>
          <p
            className={cn(
              "font-display text-3xl italic md:text-4xl",
              onDark ? "text-brass-soft" : "text-brass",
            )}
          >
            {accent}
          </p>
        </Reveal>
      ) : null}

      {description ? (
        <Reveal direction="up" delay={0.14}>
          <div
            className={cn(
              "max-w-2xl text-[15px] leading-8 md:text-base",
              onDark ? "text-on-dark-soft" : "text-ink-soft",
            )}
          >
            {description}
          </div>
        </Reveal>
      ) : null}

      {children}
    </div>
  );
}

/** Decorative section divider: a hairline interrupted by a small brass lozenge. */
export function Divider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center gap-4", className)}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-line-strong" />
      <span className="h-1.5 w-1.5 rotate-45 bg-brass" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-line-strong" />
    </div>
  );
}
