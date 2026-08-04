import Link from "next/link";

import { cn } from "@/lib/cn";

/**
 * The wordmark. A monogram lozenge plus the atelier name.
 *
 * `compact` drops the descender line for the scrolled header and mobile.
 */
export function BrandMark({
  onDark = false,
  compact = false,
  className,
}: {
  onDark?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Divya & Design — home"
      className={cn("group flex items-center gap-3", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative grid shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-out-expo)]",
          compact ? "h-9 w-9" : "h-11 w-11",
          onDark
            ? "border-on-dark-soft/50 text-on-dark group-hover:border-brass-soft"
            : "border-brass/45 text-brass-ink group-hover:border-brass",
        )}
      >
        <span className="font-display text-base leading-none tracking-tight">
          D
        </span>
        {/* Second letter, offset — reads as a stitched monogram. */}
        <span className="absolute bottom-1.5 right-1.5 font-display text-[0.6rem] leading-none opacity-80">
          D
        </span>
      </span>

      <span className="min-w-0 leading-none">
        <span
          className={cn(
            "block truncate font-display tracking-[0.02em] transition-colors duration-300",
            compact ? "text-base" : "text-lg",
            onDark ? "text-on-dark" : "text-ink",
          )}
        >
          Divya &amp; Design
        </span>
        {!compact ? (
          <span
            className={cn(
              "mt-1 hidden text-[9px] uppercase tracking-[0.42em] sm:block",
              onDark ? "text-on-dark-soft" : "text-ink-faint",
            )}
          >
            Atelier
          </span>
        ) : null}
      </span>
    </Link>
  );
}
