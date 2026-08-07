import type { Metadata } from "next";

import { CartView } from "@/components/site/cart/cart-view";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your selected pieces.",
};

/**
 * Cart.
 *
 * Backed by `/api/cart` and the `Cart` model. The cart belongs to the signed-in
 * user, or to a signed guest cookie when browsing anonymously, and is merged into
 * the account at sign-in.
 */
export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Cart"
        title="Your bag"
        description="Review your pieces, apply a promo code, and choose how you would like them made."
        crumbs={[{ label: "Cart" }]}
      />
      <CartView />
    </>
  );
}
