import "server-only";
import type { DbDoc } from "./db-types";

import type { OwnerScope } from "./api-auth";
import { Product, Wishlist } from "./models";
import { connectToDatabase } from "./mongodb";
import { round2 } from "./pricing";

/**
 * Wishlist persistence.
 *
 * The heart control on product cards was local component state, so a saved piece
 * vanished on reload and `/wishlist` was a hard-coded empty page — even though the
 * `Wishlist` model existed. Scoped like the cart: user id when signed in, signed
 * guest cookie otherwise, and merged at sign-in.
 */

export type WishlistItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  image: string | null;
  inStock: boolean;
};

function scopeFilter(scope: OwnerScope) {
  return scope.userId
    ? { userId: scope.userId }
    : { guestSessionId: scope.guestSessionId };
}

/** The ids on the wishlist, cheap enough to call for a heart's initial state. */
export async function readWishlistIds(scope: OwnerScope): Promise<string[]> {
  await connectToDatabase();
  const doc: DbDoc = await Wishlist.findOne(scopeFilter(scope)).lean();
  return (doc?.productIds ?? []).map(String);
}

/** Hydrated wishlist for the wishlist page. Unavailable pieces are filtered out. */
export async function readWishlist(scope: OwnerScope): Promise<WishlistItem[]> {
  const ids = await readWishlistIds(scope);
  if (!ids.length) return [];

  const products = await Product.find({
    _id: { $in: ids },
    status: "active",
    visibility: "public",
  }).lean();

  // Preserve the order things were saved in rather than Mongo's natural order.
  const byId = new Map(products.map((product: DbDoc) => [String(product._id), product]));

  return ids
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((product: DbDoc) => {
      const price = round2(
        product.pricing?.specialPrice ?? product.pricing?.sellingPrice ?? 0,
      );
      const images: DbDoc[] = product.images ?? [];
      const image =
        images.find((entry) => entry?.isPrimary && entry?.url)?.url ??
        images.find((entry) => entry?.url)?.url ??
        null;

      return {
        id: String(product._id),
        name: product.name,
        slug: product.slug,
        price,
        mrp: round2(product.pricing?.mrp ?? price),
        image,
        inStock:
          Boolean(product.inventory?.unlimitedStock) ||
          product.inventory?.trackInventory === false ||
          (product.inventory?.stock ?? 0) > 0,
      };
    });
}

/**
 * Add or remove in one call, returning the resulting state so the button can
 * reflect what the server actually did.
 */
export async function toggleWishlist(scope: OwnerScope, productId: string) {
  await connectToDatabase();

  const product = await Product.findOne({
    _id: productId,
    status: "active",
    visibility: "public",
  })
    .select("_id")
    .lean();

  if (!product) {
    return { ok: false as const, message: "That piece is not available." };
  }

  const filter = scopeFilter(scope);
  const existing = await Wishlist.findOne(filter);

  if (!existing) {
    await Wishlist.create({ ...filter, productIds: [productId] });
    return { ok: true as const, saved: true, count: 1 };
  }

  const ids: string[] = (existing.productIds ?? []).map(String);
  const isSaved = ids.includes(productId);

  existing.productIds = isSaved
    ? ids.filter((id) => id !== productId)
    : [...ids, productId];

  await existing.save();

  return {
    ok: true as const,
    saved: !isSaved,
    count: existing.productIds.length,
  };
}

/** Fold a guest wishlist into the user's at sign-in, de-duplicating ids. */
export async function mergeGuestWishlistIntoUser(
  guestSessionId: string | null,
  userId: string,
) {
  if (!guestSessionId) return;

  await connectToDatabase();
  const guest = await Wishlist.findOne({ guestSessionId });
  if (!guest) return;

  const guestIds: string[] = (guest.productIds ?? []).map(String);

  if (guestIds.length) {
    const userDoc = await Wishlist.findOne({ userId });
    if (userDoc) {
      const merged = new Set([
        ...(userDoc.productIds ?? []).map(String),
        ...guestIds,
      ]);
      userDoc.productIds = [...merged];
      await userDoc.save();
    } else {
      await Wishlist.create({ userId, productIds: guestIds });
    }
  }

  await guest.deleteOne();
}
