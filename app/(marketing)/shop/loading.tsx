import { ProductGridSkeleton, Skeleton } from "@/components/ui/skeleton";

/**
 * Streaming fallback for /shop. Mirrors the real layout closely enough that the
 * swap to real content causes no perceptible shift.
 */
export default function ShopLoading() {
  return (
    <>
      <section className="border-b border-line bg-canvas-warm">
        <div className="shell pb-20 pt-40">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-8 h-3 w-24" />
          <Skeleton className="mt-6 h-12 w-full max-w-2xl" />
          <Skeleton className="mt-4 h-12 w-full max-w-lg" />
        </div>
      </section>

      <div className="shell">
        <div className="flex items-center justify-between border-y border-line py-4">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-40 rounded-full" />
        </div>
        <div className="pb-24 pt-11">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </>
  );
}
