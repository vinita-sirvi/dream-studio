import { cn } from "@/lib/cn";

/**
 * Shimmering placeholder block.
 *
 * The shimmer is a background-position animation on a gradient — cheap, and it
 * stops automatically under `prefers-reduced-motion` via the global reset.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer rounded-lg bg-[length:200%_100%]",
        "bg-[linear-gradient(90deg,var(--color-surface-sunk)_25%,var(--color-canvas-warm)_50%,var(--color-surface-sunk)_75%)]",
        className,
      )}
    />
  );
}

/** Matches the real <ProductCard> footprint so swapping in causes no shift. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="aspect-4/5 w-full rounded-card" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 xl:grid-cols-4"
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
