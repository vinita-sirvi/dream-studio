import type { Metadata } from "next";

import { EmptyState } from "@/components/site/empty-state";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Thank you — your order is with us.",
  // Nothing here should be indexed or shared onward.
  robots: { index: false, follow: false },
};

/**
 * Post-checkout confirmation.
 *
 * Shows the order number from the query string only. It deliberately does not
 * fetch the order: this page is reachable by anyone who edits the URL, so
 * rendering order contents here would leak them. The order number alone is not
 * enough to view an order — `/track-order` also requires the matching email.
 */
export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const safeOrderId = (orderId ?? "").replace(/[^A-Z0-9-]/gi, "").slice(0, 40);

  return (
    <>
      <PageHero
        eyebrow="Thank you"
        title="Your order is with us"
        description="A tailor will review it and confirm fabric, fit and timeline before any work begins."
        crumbs={[{ label: "Order confirmed" }]}
      />
      <EmptyState
        icon="check"
        title={safeOrderId ? `Order ${safeOrderId}` : "Order received"}
        description="We have emailed your confirmation. Keep the order number handy — you will need it, along with your email, to track progress."
        primaryCta={{ label: "Track this order", href: "/track-order" }}
        secondaryCta={{ label: "Continue browsing", href: "/shop" }}
        note="Alterations are always free. If anything does not sit right when it arrives, tell us and we will put it right."
      />
    </>
  );
}
