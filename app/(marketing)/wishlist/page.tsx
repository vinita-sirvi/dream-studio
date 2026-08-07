import type { Metadata } from "next";

import { getOwnerScope } from "@/lib/api-auth";
import { PageHero } from "@/components/site/page-hero";
import { WishlistView } from "@/components/site/wishlist/wishlist-view";
import { readWishlist } from "@/lib/wishlist";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Pieces you have saved.",
};

/**
 * Wishlist.
 *
 * Persisted in the `Wishlist` collection against the signed-in user, or the signed
 * guest cookie while browsing anonymously — and merged into the account at
 * sign-in, so a shortlist built before registering is not lost.
 */
export default async function WishlistPage() {
  const scope = await getOwnerScope();
  const items = await readWishlist(scope);

  return (
    <>
      <PageHero
        eyebrow="Wishlist"
        title="Your saved pieces"
        description="Keep a running list of what you are considering, and move anything to your bag when you are ready."
        crumbs={[{ label: "Wishlist" }]}
      />
      <WishlistView items={items} />
    </>
  );
}
