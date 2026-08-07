import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getOwnerScope } from "@/lib/api-auth";
import { readCart } from "@/lib/cart";
import { CheckoutForm } from "@/components/site/checkout/checkout-form";
import { EmptyState } from "@/components/site/empty-state";
import { PageHero } from "@/components/site/page-hero";
import { Address } from "@/lib/models";
import { serialize } from "@/lib/http";
import { formatRupees } from "@/lib/product";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order.",
};

/**
 * Checkout.
 *
 * The summary is rendered on the server from the same `readCart()` that
 * `/api/orders` uses to build the order, so what is shown and what is charged come
 * from one source. Signed-in customers get their saved addresses offered; guests
 * can check out without an account.
 */
export default async function CheckoutPage() {
  const scope = await getOwnerScope();
  const [cart, session] = await Promise.all([readCart(scope), getCurrentSession()]);

  if (!cart.lines.length) {
    return (
      <>
        <PageHero
          eyebrow="Checkout"
          title="Nothing to check out"
          description="Your bag is empty. Add a piece, or start a commission and we will quote it directly."
          crumbs={[{ label: "Checkout" }]}
        />
        <EmptyState
          icon="lock"
          title="No items to pay for"
          description="Add something to your bag first, or submit a commission brief and we will send a quotation."
          primaryCta={{ label: "Browse the catalogue", href: "/shop" }}
          secondaryCta={{ label: "Start a commission", href: "/custom-order" }}
          note="Bespoke orders are split 50% to begin work and 50% before dispatch. We never start cutting before you have approved the quotation."
        />
      </>
    );
  }

  const savedAddresses = session
    ? serialize(
        await Address.find({ userId: session.user.id })
          .sort({ defaultShipping: -1, createdAt: -1 })
          .lean(),
      )
    : [];

  const { totals } = cart;

  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Confirm your order"
        description="A tailor reviews every order and confirms fabric and fit before work begins."
        crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />

      <section className="shell grid gap-12 py-14 md:py-20 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div className="min-w-0">
          {cart.issues.length ? (
            <p
              role="status"
              className="mb-8 rounded-xl border border-line bg-brass-wash px-5 py-4 text-sm leading-6 text-brass-ink"
            >
              {cart.issues[0].message}
            </p>
          ) : null}

          {!session ? (
            <p className="mb-8 rounded-xl border border-line bg-canvas-warm px-5 py-4 text-sm leading-6 text-ink-soft">
              Checking out as a guest.{" "}
              <Link href="/login?next=/checkout" className="text-brass-ink underline">
                Sign in
              </Link>{" "}
              to use a saved address and keep this order in your account.
            </p>
          ) : null}

          <CheckoutForm
            defaultName={session?.user.name ?? ""}
            defaultEmail={session?.user.email ?? ""}
            savedAddresses={savedAddresses as never[]}
            codEnabled={cart.settings.codEnabled}
            grandTotal={totals.grandTotal}
          />
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-panel border border-line bg-surface p-7 shadow-soft">
            <h2 className="eyebrow text-brass-ink">Your order</h2>

            <ul className="mt-6 grid gap-4">
              {cart.lines.map((line) => (
                <li key={line.lineId} className="flex gap-3.5">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-sunk">
                    {line.image ? (
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{line.name}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      Qty {line.quantity}
                      {line.variant.size ? ` · ${line.variant.size}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-ink">
                      {formatRupees(line.lineTotal)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-6 grid gap-3 border-t border-line pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="text-ink">{formatRupees(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-ink-soft">
                    Discount{cart.couponCode ? ` (${cart.couponCode})` : ""}
                  </dt>
                  <dd className="text-success">
                    −{formatRupees(totals.discount)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="text-ink">
                  {totals.shipping > 0 ? formatRupees(totals.shipping) : "Free"}
                </dd>
              </div>
              {totals.tax > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-ink-faint">Incl. tax</dt>
                  <dd className="text-ink-faint">{formatRupees(totals.tax)}</dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
              <span className="font-display text-lg text-ink">Total</span>
              <span className="font-display text-xl text-ink">
                {formatRupees(totals.grandTotal)}
              </span>
            </div>

            <Link
              href="/cart"
              className="mt-6 block text-center text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-brass-ink"
            >
              Edit bag
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
