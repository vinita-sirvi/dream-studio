import type { Metadata } from "next";

import { EmptyState } from "@/components/site/empty-state";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order.",
};

/**
 * Checkout.
 *
 * No payment gateway is wired up in this codebase. Rather than present a form
 * that cannot take money, this routes people to the commission flow, where a
 * tailor issues a real quotation and payment link.
 */
export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Nothing to check out"
        description="Your cart is empty. Every order here starts with a short brief so we can confirm fabric, fit and timeline before taking payment."
        crumbs={[{ label: "Checkout" }]}
      />
      <EmptyState
        icon="lock"
        title="No items to pay for"
        description="Add something to your cart first, or submit a commission brief and we will send a quotation with a secure payment link."
        primaryCta={{ label: "Start a commission", href: "/custom-order" }}
        secondaryCta={{ label: "Back to shop", href: "/shop" }}
        note="Bespoke orders are split 50% to begin work and 50% before dispatch. We never start cutting before you have approved the quotation."
      />
    </>
  );
}
