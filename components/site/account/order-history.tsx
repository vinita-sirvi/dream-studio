import { AccountEmpty } from "./account-panel";
import { OrderStatusBadge } from "./order-status-badge";
import { formatRupees } from "@/lib/product";
import type { CustomerOrder } from "@/lib/storefront";

/**
 * Order history for the signed-in customer.
 *
 * A server component — the data comes from `getOrdersForUser()` and nothing here
 * is interactive, so there is no reason to ship it to the browser.
 */
export function OrderHistory({ orders }: { orders: CustomerOrder[] }) {
  if (!orders.length) {
    return (
      <AccountEmpty
        icon="box"
        title="No orders yet"
        description="Once you place an order it will appear here, with its stage from cutting through to dispatch."
        primaryCta={{ label: "Browse the catalogue", href: "/shop" }}
        secondaryCta={{ label: "Start a commission", href: "/custom-order" }}
      />
    );
  }

  return (
    <ul className="mt-10 grid gap-5">
      {orders.map((order) => (
        <li
          key={order.id}
          className="rounded-card border border-line bg-surface p-6 md:p-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-ink">{order.orderId}</p>
              {order.placedAt ? (
                <p className="mt-1 text-xs text-ink-soft">
                  Placed{" "}
                  {new Date(order.placedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              ) : null}
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <ul className="mt-5 grid gap-1.5 border-t border-line pt-5 text-sm">
            {order.items.map((item, index) => (
              <li
                key={`${order.id}-${index}`}
                className="flex items-baseline justify-between gap-4"
              >
                <span className="text-ink-soft">
                  {item.name}
                  {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                </span>
                <span className="shrink-0 text-ink">
                  {formatRupees(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-5">
            <span className="text-sm text-ink-soft">
              {order.itemCount} {order.itemCount === 1 ? "piece" : "pieces"}
            </span>
            <span className="font-display text-lg text-ink">
              {formatRupees(order.grandTotal)}
            </span>
          </div>

          {/* Latest workroom note, where there is one. */}
          {order.timeline.length ? (
            <p className="mt-4 text-xs leading-6 text-ink-soft">
              {order.timeline[order.timeline.length - 1].note ??
                `Currently ${order.status}.`}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
