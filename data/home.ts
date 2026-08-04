/**
 * Editorial content for the storefront.
 *
 * Kept as data rather than inlined JSX so copy can be revised (or later moved to
 * the CMS collections that already exist in lib/models.ts) without touching
 * layout code. Image paths point at the six real files in /public/category-images.
 */

export const announcement =
  "Complimentary fittings on every bespoke order · Use WELCOME10 for 10% off your first piece";

/** Fallback imagery. Replace with real photography as it becomes available. */
export const IMAGES = {
  lehenga: "/category-images/lehenga.jpg",
  kurti: "/category-images/kurti.jpg",
  blouse: "/category-images/blouse.jpg",
  dress: "/category-images/dress.jpg",
  coordSet: "/category-images/coord-set.jpg",
  ethnic: "/category-images/ethnic-wear.jpg",
} as const;

export const hero = {
  eyebrow: "Bespoke Atelier · Est. 2024",
  title: "Cut for one person.",
  accent: "Yours.",
  body:
    "We do not make sizes. We make garments — measured, draped and hand-finished for the person who will wear them.",
  primaryCta: { label: "Book a fitting", href: "/custom-order" },
  secondaryCta: { label: "View the collection", href: "/shop" },
  stats: [
    { value: "2,400+", label: "Garments finished" },
    { value: "18", label: "Master tailors" },
    { value: "14 days", label: "Average delivery" },
  ],
} as const;

/** Scrolling trust strip beneath the hero. */
export const marqueeItems = [
  "Made to your measurements",
  "Hand-finished seams",
  "Natural fabrics only",
  "Complimentary fittings",
  "Pan-India delivery",
  "Free alterations for 90 days",
] as const;

export const features = [
  {
    title: "Made to measure",
    text: "Twelve measurements, taken once and kept on file for every order after.",
    icon: "tape",
  },
  {
    title: "Considered fabric",
    text: "Handloom cotton, mulberry silk and chanderi, sourced from named weavers.",
    icon: "fabric",
  },
  {
    title: "Finished by hand",
    text: "Hems, linings and closures are completed by hand, never overlocked.",
    icon: "needle",
  },
  {
    title: "Fitted twice",
    text: "A muslin toile before cutting, and a final fitting before it leaves us.",
    icon: "hanger",
  },
  {
    title: "Altered free",
    text: "Ninety days of complimentary adjustments, because bodies change.",
    icon: "returns",
  },
] as const;

export const categories = [
  {
    name: "Kurtis",
    slug: "kurtis",
    image: IMAGES.kurti,
    count: "48 pieces",
    blurb: "Everyday ease, occasion detail",
  },
  {
    name: "Blouses",
    slug: "blouses",
    image: IMAGES.blouse,
    count: "36 pieces",
    blurb: "Cut to the saree, not the rack",
  },
  {
    name: "Dresses",
    slug: "dresses",
    image: IMAGES.dress,
    count: "27 pieces",
    blurb: "Modern lines, quiet finish",
  },
  {
    name: "Co-ord Sets",
    slug: "co-ord-sets",
    image: IMAGES.coordSet,
    count: "22 pieces",
    blurb: "Pieces that agree with each other",
  },
  {
    name: "Lehengas",
    slug: "lehengas",
    image: IMAGES.lehenga,
    count: "19 pieces",
    blurb: "Bridal weight, festive colour",
  },
  {
    name: "Ethnic Wear",
    slug: "ethnic-wear",
    image: IMAGES.ethnic,
    count: "41 pieces",
    blurb: "Traditional forms, current fit",
  },
] as const;

/** Featured collection rail. */
export const collections = [
  {
    name: "The Bridal Edit",
    href: "/collections",
    image: IMAGES.lehenga,
    description:
      "Heirloom-weight lehengas and blouses, built over eight to twelve weeks.",
    meta: "19 pieces",
  },
  {
    name: "Everyday Handloom",
    href: "/collections",
    image: IMAGES.kurti,
    description:
      "Breathable cotton and chanderi cut for real weather and real days.",
    meta: "48 pieces",
  },
  {
    name: "Occasion Silk",
    href: "/collections",
    image: IMAGES.ethnic,
    description:
      "Mulberry and tussar silk for weddings, festivals and evenings out.",
    meta: "27 pieces",
  },
] as const;

export const services = [
  {
    title: "Bespoke commission",
    text: "Start from a sketch, a photograph or a garment you already love. We draft a fresh pattern for your body.",
    price: "From ₹6,500",
    icon: "scissors",
    href: "/custom-order",
  },
  {
    title: "Made-to-measure",
    text: "Choose an existing design and we cut it to your measurements, with your fabric and finish.",
    price: "From ₹2,200",
    icon: "tape",
    href: "/shop",
  },
  {
    title: "Bridal atelier",
    text: "A dedicated tailor, three fittings and a delivery date planned around your calendar.",
    price: "From ₹24,000",
    icon: "sparkle",
    href: "/custom-order",
  },
  {
    title: "Alteration & restoration",
    text: "Re-fit, reline or rescue a piece you already own — including heirloom saree conversions.",
    price: "From ₹800",
    icon: "needle",
    href: "/contact",
  },
] as const;

export const processSteps = [
  {
    step: "01",
    title: "Choose the form",
    text: "Pick a silhouette from the collection, or bring a reference of your own.",
    icon: "dress",
  },
  {
    step: "02",
    title: "Select the cloth",
    text: "Handle swatches in the studio, or have a fabric box posted to you.",
    icon: "fabric",
  },
  {
    step: "03",
    title: "Detail the finish",
    text: "Neckline, sleeve, length, lining, embroidery — decided line by line.",
    icon: "spark",
  },
  {
    step: "04",
    title: "Be measured",
    text: "Twelve measurements in the studio or over a guided video call.",
    icon: "tape",
  },
  {
    step: "05",
    title: "Fit and finish",
    text: "A toile fitting, then final hand-finishing before it is pressed and boxed.",
    icon: "needle",
  },
] as const;

export const measurementGuide = [
  {
    title: "Bring your own tape",
    text: "A soft tailoring tape, snug against the body but never pulled tight. Measure over the underwear you would normally wear with the garment.",
  },
  {
    title: "Or let us guide you",
    text: "Book a twenty-minute video call and a tailor will walk you through all twelve measurements, checking each one on camera.",
  },
  {
    title: "Kept on file",
    text: "Once recorded, your profile is saved. Every future order starts from it, and you can store profiles for family too.",
  },
] as const;

export const craftPoints = [
  {
    title: "French seams, not overlocking",
    text: "Every internal seam is enclosed, so the inside of the garment is as finished as the outside and the edges cannot fray.",
  },
  {
    title: "Hand-rolled hems",
    text: "On silk and chanderi the hem is rolled and slip-stitched by hand — it falls softer and does not ripple the way a machine hem does.",
  },
  {
    title: "Full linings, cut on the bias",
    text: "Linings are cut separately on the bias so they move with the outer cloth instead of pulling against it.",
  },
  {
    title: "Named weavers",
    text: "Our handloom comes from six weaving families in Chanderi, Bhagalpur and Kanchipuram. We pay for the cloth before it is woven.",
  },
] as const;

export const whyChooseUs = [
  {
    value: "12",
    label: "Measurements per garment",
    text: "Not three. Twelve — including posture and shoulder slope.",
  },
  {
    value: "2",
    label: "Fittings included",
    text: "A toile before cutting, and a final check before delivery.",
  },
  {
    value: "90",
    label: "Days of free alterations",
    text: "Bodies change. Your garment should be able to follow.",
  },
  {
    value: "100%",
    label: "Natural fabric",
    text: "No polyester blends, no synthetic linings. Ever.",
  },
] as const;

export const trustStrip = [
  {
    title: "Talk to a tailor",
    text: "WhatsApp us for fabric and fit advice",
    icon: "chat",
  },
  {
    title: "Secure checkout",
    text: "Encrypted payment, no card details stored",
    icon: "shield",
  },
  {
    title: "Tracked delivery",
    text: "Insured, boxed and traceable across India",
    icon: "truck",
  },
  {
    title: "Free alterations",
    text: "Ninety days from the day it arrives",
    icon: "returns",
  },
] as const;

/** Instagram-style gallery. Real captions, placeholder imagery. */
export const galleryItems = [
  { image: IMAGES.lehenga, caption: "Bridal lehenga, hand-cut zardozi", span: "tall" },
  { image: IMAGES.kurti, caption: "Chanderi kurti in unbleached cotton", span: "normal" },
  { image: IMAGES.blouse, caption: "Silk blouse, piped neckline", span: "normal" },
  { image: IMAGES.ethnic, caption: "Festive set, block-printed by hand", span: "wide" },
  { image: IMAGES.dress, caption: "Bias-cut dress in tussar", span: "normal" },
  { image: IMAGES.coordSet, caption: "Co-ord set, mother-of-pearl buttons", span: "normal" },
] as const;

export const socialShowcase = [
  { image: IMAGES.kurti, alt: "Kurti detail" },
  { image: IMAGES.lehenga, alt: "Lehenga embroidery" },
  { image: IMAGES.blouse, alt: "Blouse neckline" },
  { image: IMAGES.dress, alt: "Dress drape" },
  { image: IMAGES.coordSet, alt: "Co-ord set" },
  { image: IMAGES.ethnic, alt: "Ethnic wear" },
] as const;
