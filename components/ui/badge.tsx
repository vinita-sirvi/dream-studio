import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Small pill label. */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "brass" | "dark" | "sale";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em]",
        tone === "neutral" && "bg-surface/90 text-ink backdrop-blur-sm",
        tone === "brass" && "bg-brass-wash text-brass-ink",
        tone === "dark" && "bg-espresso text-on-dark",
        tone === "sale" && "bg-danger text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

const STAR_PATH =
  "M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z";

function StarOutline({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
      <path
        d={STAR_PATH}
        fill={filled ? "var(--color-brass)" : "none"}
        stroke="var(--color-brass)"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Five-star rating, rounded to the nearest half for display.
 *
 * Half stars are drawn by overlaying a filled star clipped to 50% width rather
 * than an SVG gradient — that avoids generating element ids, which would differ
 * between server and client render and break hydration.
 */
export function Rating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Rated ${value.toFixed(1)} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          if (rounded >= star) return <StarOutline key={star} filled />;

          if (rounded >= star - 0.5) {
            return (
              <span key={star} className="relative inline-flex">
                <StarOutline filled={false} />
                <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                  <StarOutline filled />
                </span>
              </span>
            );
          }

          return <StarOutline key={star} filled={false} />;
        })}
      </div>
      {count !== undefined ? (
        <span className="text-xs text-ink-soft">({count})</span>
      ) : null}
    </div>
  );
}
