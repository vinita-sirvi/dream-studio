export type ProductReview = {
  name: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  /** Whether the reviewer felt the fit ran true. */
  fit: "true to size" | "runs small" | "runs large";
};

/**
 * SAMPLE CONTENT.
 *
 * There is no reviews model in lib/models.ts and no review submission flow, so
 * the product page shows this fixed set on every product. It exists to design and
 * validate the reviews UI. Before launch, either build a Review model and read
 * from it, or remove the reviews section from the product page.
 */
export const sampleReviews: ProductReview[] = [
  {
    name: "Priya S.",
    rating: 5,
    date: "2026-07-14",
    title: "The fit is the whole point",
    body: "Third order from them. I stopped buying ready-to-wear kurtis two years ago and have not regretted it once. The shoulder seam actually sits on my shoulder.",
    verified: true,
    fit: "true to size",
  },
  {
    name: "Kavya R.",
    rating: 5,
    date: "2026-06-28",
    title: "Fabric is heavier than I expected, in a good way",
    body: "The photographs made it look lighter. In person it has real weight and hangs beautifully. Lining is properly finished, not just tacked in.",
    verified: true,
    fit: "true to size",
  },
  {
    name: "Sneha M.",
    rating: 4,
    date: "2026-06-02",
    title: "Lovely piece, sleeves a touch snug",
    body: "Everything else was exact. The bicep was slightly tight when I raised my arm — they altered it free within a week of me mentioning it, so it ended up perfect.",
    verified: true,
    fit: "runs small",
  },
  {
    name: "Aisha K.",
    rating: 5,
    date: "2026-05-19",
    title: "Worth the wait",
    body: "Twelve days from order to delivery. Boxed properly, pressed, with a hand-written note about how to wash it. Small things, but they add up.",
    verified: true,
    fit: "true to size",
  },
];

export function reviewSummary(reviews: ProductReview[]) {
  if (!reviews.length) {
    return { average: 0, count: 0, distribution: [] as number[] };
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  // Index 0 = five stars, index 4 = one star.
  const distribution = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((review) => Math.round(review.rating) === star).length,
  );

  return {
    average: total / reviews.length,
    count: reviews.length,
    distribution,
  };
}
