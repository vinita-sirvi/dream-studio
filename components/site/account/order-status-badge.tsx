import { cn } from "@/lib/cn";

/**
 * Order status pill.
 *
 * The workroom statuses are grouped into three tones so the state reads at a
 * glance: in progress, finished, and stopped. Unknown values fall back to the
 * neutral tone rather than rendering nothing.
 */
const TONES: Record<string, string> = {
  pending: "border-line-strong bg-canvas-warm text-ink-soft",
  confirmed: "border-brass bg-brass-wash text-brass-ink",
  processing: "border-brass bg-brass-wash text-brass-ink",
  stitching: "border-brass bg-brass-wash text-brass-ink",
  packed: "border-brass bg-brass-wash text-brass-ink",
  shipped: "border-brass bg-brass-wash text-brass-ink",
  delivered: "border-success/40 bg-success/10 text-success",
  cancelled: "border-danger/40 bg-danger/10 text-danger",
  refunded: "border-danger/40 bg-danger/10 text-danger",
  returned: "border-danger/40 bg-danger/10 text-danger",
};

const LABELS: Record<string, string> = {
  pending: "Awaiting confirmation",
  confirmed: "Confirmed",
  processing: "In the workroom",
  stitching: "Being stitched",
  packed: "Packed",
  shipped: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
  returned: "Returned",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em]",
        TONES[status] ?? "border-line-strong bg-canvas-warm text-ink-soft",
      )}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
