import { IMAGES } from "./home";

export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readMinutes: number;
  image: string;
};

/**
 * Journal / blog index content.
 *
 * A Blog model exists in lib/models.ts but no posts are seeded and there is no
 * /blogs/[slug] route, so these entries are presented as an index only — cards
 * do not link through to individual posts yet.
 */
export const journalPosts: JournalPost[] = [
  {
    slug: "reading-a-handloom-label",
    title: "How to read a handloom label (and spot a fake one)",
    excerpt:
      "Genuine handloom has irregularities that a power loom cannot reproduce. Here is what to look for at the selvedge, in the weave density, and on the reverse.",
    category: "Fabric",
    author: "Divya Menon",
    date: "2026-07-22",
    readMinutes: 6,
    image: IMAGES.kurti,
  },
  {
    slug: "why-your-blouse-never-fits",
    title: "Why your blouse never fits, and the measurement everyone skips",
    excerpt:
      "Underbust. That is the answer. A blouse fitted on bust alone will gape at the band or ride up at the back, and no amount of tightening the hooks will fix it.",
    category: "Fit",
    author: "Ranjini Iyer",
    date: "2026-07-08",
    readMinutes: 8,
    image: IMAGES.blouse,
  },
  {
    slug: "bridal-timeline",
    title: "A realistic bridal timeline, counted backwards from the date",
    excerpt:
      "Twelve weeks is comfortable. Eight is possible. Six means compromising on either the embroidery or the number of fittings, and we will tell you which.",
    category: "Bridal",
    author: "Divya Menon",
    date: "2026-06-19",
    readMinutes: 7,
    image: IMAGES.lehenga,
  },
  {
    slug: "saree-to-something-wearable",
    title: "Turning an inherited saree into something you will actually wear",
    excerpt:
      "Six yards of fabric with sentimental weight and no occasion to wear it. Four conversions that respect the original cloth rather than cutting it to pieces.",
    category: "Restoration",
    author: "Fatima Q.",
    date: "2026-05-30",
    readMinutes: 9,
    image: IMAGES.ethnic,
  },
  {
    slug: "french-seams",
    title: "French seams, and why the inside of a garment matters",
    excerpt:
      "An enclosed seam cannot fray, sits flatter against the skin, and adds maybe forty minutes per garment. We think that is a fair trade.",
    category: "Craft",
    author: "Ranjini Iyer",
    date: "2026-05-11",
    readMinutes: 5,
    image: IMAGES.dress,
  },
  {
    slug: "caring-for-silk-in-monsoon",
    title: "Caring for silk through an Indian monsoon",
    excerpt:
      "Humidity is the enemy, not water. Storage, airing and the one thing you should never do with a silk garment in July.",
    category: "Care",
    author: "Divya Menon",
    date: "2026-04-28",
    readMinutes: 4,
    image: IMAGES.coordSet,
  },
];

/** Formats an ISO date as e.g. "22 July 2026". */
export function formatJournalDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
