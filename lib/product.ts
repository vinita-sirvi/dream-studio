/**
 * Pure product helpers.
 *
 * These live outside components/site/product-card.tsx because that file is a
 * Client Component ("use client"), and a Server Component cannot call a function
 * imported from a client module — Next throws
 * "Attempted to call X() from the server but X is on the client".
 *
 * Keeping them here means the product page (server) and the product card
 * (client) share one implementation.
 */

export type ProductImage = {
  url: string;
  alt?: string;
  type?: string;
  isPrimary?: boolean;
  sortOrder?: number;
};

/** Usable images only, primary first, then by explicit sort order. */
export function orderedImages(
  images: ProductImage[] | undefined,
): ProductImage[] {
  return [...(images ?? [])]
    .filter((image) => image.type !== "video" && image.url?.trim())
    .sort(
      (a, b) =>
        Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)) ||
        (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );
}

/** Indian-format currency, e.g. ₹1,49,900. */
export function formatRupees(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}
