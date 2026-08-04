import type { Metadata } from "next";

import { EmptyState } from "@/components/site/empty-state";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your selected pieces.",
};

/**
 * Cart.
 *
 * There is no cart API or cart model in this application, so this route shows a
 * designed empty state rather than a non-functional cart UI. Ordering happens
 * through the custom-order flow, which is fully implemented.
 */
export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Cart"
        title="Your cart is empty"
        description="Nothing selected yet. Browse the catalogue, or start a commission and we will quote it directly."
        crumbs={[{ label: "Cart" }]}
      />
      <EmptyState
        icon="bag"
        title="Nothing here yet"
        description="Add pieces from the catalogue, or tell us what you have in mind and we will build it from scratch."
        primaryCta={{ label: "Browse the catalogue", href: "/shop" }}
        secondaryCta={{ label: "Start a commission", href: "/custom-order" }}
        note="Orders are currently placed through our commission flow, so a tailor reviews every request and confirms fabric and fit before you pay."
      />
    </>
  );
}
