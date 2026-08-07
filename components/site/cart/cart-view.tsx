"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { Icon } from "@/components/site/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { formatRupees } from "@/lib/product";

/**
 * The cart.
 *
 * Mirrors the server's `CartView` shape. Every mutation returns the whole
 * re-priced cart, so this component never does money arithmetic itself — which is
 * the point, since the totals shown here have to be the totals charged.
 */
type CartLine = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  unitPrice: number;
  mrp: number;
  quantity: number;
  lineTotal: number;
  variant: Record<string, string>;
  availableStock: number | null;
  inStock: boolean;
};

type CartData = {
  lines: CartLine[];
  issues: { message: string }[];
  totals: {
    subtotal: number;
    shipping: number;
    discount: number;
    tax: number;
    grandTotal: number;
  };
  settings: { freeShippingThreshold: number | null };
  couponCode: string | null;
  couponMessage: string | null;
  itemCount: number;
};

export function CartView() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [busyLine, setBusyLine] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/cart");
        const body = await response.json();
        if (!active) return;

        if (!response.ok) {
          setError(body?.message ?? "Could not load your bag.");
          return;
        }
        setCart(body.data);
        // Surface anything the server changed while re-pricing (sold out,
        // quantity clamped) so the change is not silent.
        if (body.data?.issues?.length) {
          setNotice(body.data.issues[0].message);
        }
      } catch {
        if (active) setError("Could not load your bag.");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  async function mutate(
    init: RequestInit & { method: string },
    lineId?: string,
  ) {
    setBusyLine(lineId ?? "cart");
    setNotice(null);

    try {
      const response = await fetch("/api/cart", {
        headers: { "Content-Type": "application/json" },
        ...init,
      });
      const body = await response.json();

      if (!response.ok) {
        setNotice(body?.message ?? "That did not work. Please try again.");
        return;
      }

      setCart(body.data);
      if (body.data?.issues?.length) {
        setNotice(body.data.issues[0].message);
      }
    } catch {
      setNotice("Could not reach the studio. Please try again.");
    } finally {
      setBusyLine(null);
    }
  }

  function setQuantity(line: CartLine, quantity: number) {
    startTransition(() => {
      void mutate(
        {
          method: "PATCH",
          body: JSON.stringify({ lineId: line.lineId, quantity }),
        },
        line.lineId,
      );
    });
  }

  function removeLine(line: CartLine) {
    startTransition(() => {
      void mutate(
        { method: "DELETE", body: JSON.stringify({ lineId: line.lineId }) },
        line.lineId,
      );
    });
  }

  function applyCoupon(event: React.FormEvent) {
    event.preventDefault();
    if (!couponInput.trim()) return;

    startTransition(() => {
      void mutate({
        method: "PATCH",
        body: JSON.stringify({ action: "apply-coupon", code: couponInput.trim() }),
      });
    });
  }

  function removeCoupon() {
    startTransition(() => {
      void mutate({
        method: "PATCH",
        body: JSON.stringify({ action: "remove-coupon" }),
      });
    });
  }

  if (error) {
    return (
      <section className="shell py-20">
        <p role="alert" className="text-center text-sm text-danger">
          {error}
        </p>
      </section>
    );
  }

  if (!cart) {
    return (
      <section className="shell grid gap-10 py-16 lg:grid-cols-[1fr_22rem]">
        <div className="grid gap-5">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-32 rounded-card" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-panel" />
      </section>
    );
  }

  if (!cart.lines.length) {
    return (
      <section className="shell py-20 md:py-28">
        <div className="mx-auto max-w-2xl rounded-panel border border-line bg-canvas-warm px-8 py-16 text-center md:px-14 md:py-20">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-line-strong bg-canvas text-brass">
            <Icon name="bag" className="h-7 w-7" />
          </span>
          <h2 className="mt-8 display-md text-ink">Nothing here yet</h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-8 text-ink-soft">
            Add pieces from the catalogue, or tell us what you have in mind and we
            will make it from scratch.
          </p>
          {notice ? (
            <p className="mt-6 text-xs leading-6 text-ink-soft" role="status">
              {notice}
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop" size="lg">
              Browse the catalogue
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/custom-order" variant="secondary" size="lg">
              Start a commission
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  const { totals, settings } = cart;
  const awayFromFreeShipping =
    settings.freeShippingThreshold !== null && totals.shipping > 0
      ? settings.freeShippingThreshold - totals.subtotal
      : 0;

  return (
    <section className="shell grid gap-12 py-14 md:py-20 lg:grid-cols-[1fr_22rem] lg:gap-16">
      <div>
        {notice ? (
          <p
            role="status"
            className="mb-6 rounded-xl border border-line bg-brass-wash px-5 py-4 text-sm leading-6 text-brass-ink"
          >
            {notice}
          </p>
        ) : null}

        <ul className="grid gap-6">
          {cart.lines.map((line) => {
            const busy = busyLine === line.lineId;
            const options = Object.entries(line.variant).filter(
              ([, value]) => value,
            );

            return (
              <li
                key={line.lineId}
                className={cn(
                  "grid grid-cols-[5.5rem_1fr] gap-5 border-b border-line pb-6 transition-opacity sm:grid-cols-[7rem_1fr]",
                  busy && "opacity-60",
                )}
              >
                <Link
                  href={`/products/${line.slug}`}
                  className="relative aspect-4/5 overflow-hidden rounded-card bg-surface-sunk"
                >
                  {line.image ? (
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : null}
                </Link>

                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-lg leading-snug text-ink">
                        <Link
                          href={`/products/${line.slug}`}
                          className="transition-colors hover:text-brass-ink"
                        >
                          {line.name}
                        </Link>
                      </h2>
                      {options.length ? (
                        <p className="mt-1 text-xs text-ink-soft">
                          {options
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" · ")}
                        </p>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLine(line)}
                      disabled={busy || pending}
                      aria-label={`Remove ${line.name}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-surface hover:text-danger disabled:opacity-50"
                    >
                      <Icon name="close" className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(line, line.quantity - 1)}
                        disabled={busy || pending}
                        aria-label={`Reduce quantity of ${line.name}`}
                        className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-brass-wash disabled:opacity-40"
                      >
                        <Icon name="minus" className="h-3.5 w-3.5" />
                      </button>
                      <span
                        aria-live="polite"
                        className="min-w-8 text-center text-sm text-ink"
                      >
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line, line.quantity + 1)}
                        disabled={
                          busy ||
                          pending ||
                          (line.availableStock !== null &&
                            line.quantity >= line.availableStock)
                        }
                        aria-label={`Increase quantity of ${line.name}`}
                        className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-brass-wash disabled:opacity-40"
                      >
                        <Icon name="plus" className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-[15px] text-ink">
                        {formatRupees(line.lineTotal)}
                      </p>
                      {line.quantity > 1 ? (
                        <p className="text-xs text-ink-faint">
                          {formatRupees(line.unitPrice)} each
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {line.availableStock !== null && line.availableStock <= 3 ? (
                    <p className="text-xs text-brass-ink">
                      Only {line.availableStock} left
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-panel border border-line bg-surface p-7 shadow-soft">
          <h2 className="eyebrow text-brass-ink">Summary</h2>

          <dl className="mt-6 grid gap-3 text-sm">
            <Row label="Subtotal" value={formatRupees(totals.subtotal)} />
            {totals.discount > 0 ? (
              <Row
                label={`Discount${cart.couponCode ? ` (${cart.couponCode})` : ""}`}
                value={`−${formatRupees(totals.discount)}`}
                tone="success"
              />
            ) : null}
            <Row
              label="Shipping"
              value={totals.shipping > 0 ? formatRupees(totals.shipping) : "Free"}
            />
            {totals.tax > 0 ? (
              <Row
                label="Incl. tax"
                value={formatRupees(totals.tax)}
                muted
              />
            ) : null}
          </dl>

          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
            <span className="font-display text-lg text-ink">Total</span>
            <span className="font-display text-xl text-ink">
              {formatRupees(totals.grandTotal)}
            </span>
          </div>

          {awayFromFreeShipping > 0 ? (
            <p className="mt-4 text-xs leading-5 text-ink-soft">
              Add {formatRupees(awayFromFreeShipping)} more for free shipping.
            </p>
          ) : null}

          {/* Coupon */}
          {cart.couponCode ? (
            <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-line bg-brass-wash px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-brass-ink">
                <Icon name="tag" className="h-4 w-4" />
                {cart.couponCode}
              </span>
              <button
                type="button"
                onClick={removeCoupon}
                disabled={pending}
                className="text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-danger disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={applyCoupon} className="mt-6 grid gap-2">
              <label
                htmlFor="cart-coupon"
                className="eyebrow block text-brass-ink"
              >
                Promo code
              </label>
              <div className="flex gap-2">
                <Input
                  id="cart-coupon"
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value)}
                  placeholder="Enter code"
                  autoComplete="off"
                  className="uppercase"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={pending || !couponInput.trim()}
                >
                  Apply
                </Button>
              </div>
            </form>
          )}

          {cart.couponMessage ? (
            <p role="status" className="mt-3 text-xs leading-5 text-danger">
              {cart.couponMessage}
            </p>
          ) : null}

          <ButtonLink href="/checkout" size="lg" className="mt-7 w-full">
            Checkout
            <Icon name="arrow-right" className="h-4 w-4" />
          </ButtonLink>

          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-ink-soft">
            <Icon name="needle" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" />
            A tailor confirms fabric and fit before any work begins. Alterations are
            free.
          </p>
        </div>
      </aside>
    </section>
  );
}

function Row({
  label,
  value,
  tone,
  muted,
}: {
  label: string;
  value: string;
  tone?: "success";
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={cn("text-ink-soft", muted && "text-ink-faint")}>{label}</dt>
      <dd
        className={cn(
          "text-ink",
          tone === "success" && "text-success",
          muted && "text-ink-faint",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
