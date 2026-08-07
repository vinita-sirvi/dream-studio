"use client";

import { useState } from "react";

import { Icon } from "@/components/site/icons";
import { Button } from "@/components/ui/button";
import { Field, FormStatus, Input } from "@/components/ui/field";
import { formatRupees } from "@/lib/product";

import { OrderStatusBadge } from "./order-status-badge";

type TrackedOrder = {
  orderId: string;
  status: string;
  placedAt: string | null;
  updatedAt: string | null;
  shippingMethod: string | null;
  grandTotal: number;
  items: { name: string; quantity: number }[];
  timeline: { status: string; note: string | null; at: string | null }[];
};

/**
 * Order lookup for guests.
 *
 * Requires both the order number and the email on the order — the number alone is
 * not enough, so this cannot be used to browse other people's orders. The endpoint
 * is rate limited and answers unknown and mismatched pairs identically.
 */
export function TrackOrderForm({ defaultOrderId = "" }: { defaultOrderId?: string }) {
  const [orderId, setOrderId] = useState(defaultOrderId);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");
    setOrder(null);

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId.trim(), email: email.trim() }),
      });
      const body = await response.json();

      if (!response.ok) {
        setStatus("error");
        setFeedback(body?.message ?? "We could not find that order.");
        return;
      }

      setStatus("success");
      setOrder(body.data);
    } catch {
      setStatus("error");
      setFeedback("Could not reach the studio. Please try again.");
    }
  }

  return (
    <div className="mt-8 grid gap-8">
      <form
        onSubmit={onSubmit}
        className="grid gap-5 rounded-card border border-line bg-surface p-6 md:p-7"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Order number"
            htmlFor="track-order-id"
            hint="From your confirmation email, e.g. DD-20260807-K7QP4M."
            required
          >
            <Input
              id="track-order-id"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              autoComplete="off"
              required
            />
          </Field>

          <Field
            label="Email used to order"
            htmlFor="track-email"
            required
          >
            <Input
              id="track-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Looking…" : "Track order"}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Button>
          <FormStatus
            status={
              status === "success" ? "idle" : status === "loading" ? "loading" : status
            }
            message={feedback}
          />
        </div>
      </form>

      {order ? (
        <section
          aria-live="polite"
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
              <li key={index} className="text-ink-soft">
                {item.name}
                {item.quantity > 1 ? ` × ${item.quantity}` : ""}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
            <span className="text-sm text-ink-soft">Order total</span>
            <span className="font-display text-lg text-ink">
              {formatRupees(order.grandTotal)}
            </span>
          </div>

          {order.timeline.length ? (
            <ol className="mt-6 grid gap-4 border-t border-line pt-6">
              {order.timeline.map((entry, index) => (
                <li key={index} className="flex gap-3.5">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brass"
                  />
                  <div>
                    <p className="text-sm text-ink">{entry.status}</p>
                    {entry.note ? (
                      <p className="mt-0.5 text-xs leading-5 text-ink-soft">
                        {entry.note}
                      </p>
                    ) : null}
                    {entry.at ? (
                      <p className="mt-0.5 text-xs text-ink-faint">
                        {new Date(entry.at).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
