export type FaqGroup = {
  category: string;
  items: { question: string; answer: string }[];
};

/**
 * FAQ content, grouped by topic.
 *
 * Answers are written to be genuinely useful — a Faq model exists in
 * lib/models.ts if this should later be admin-editable.
 */
export const faqGroups: FaqGroup[] = [
  {
    category: "Ordering & Bespoke",
    items: [
      {
        question: "How does a bespoke order actually work?",
        answer:
          "You submit a brief — a sketch, a photograph, or an existing garment you want reinterpreted. Within two working days a tailor replies with a quotation, fabric suggestions and a delivery estimate. Once you approve, we take measurements (in the studio or over a guided video call), cut a toile, fit it, and only then cut into your chosen cloth.",
      },
      {
        question: "Can I order without visiting the studio?",
        answer:
          "Yes. Roughly seventy percent of our orders are placed remotely. We post a fabric box with swatches, and a tailor guides you through all twelve measurements on a video call, checking each one on camera. The toile fitting can also be done remotely using photographs taken to our instructions.",
      },
      {
        question: "What if I already own something that fits perfectly?",
        answer:
          "Send it to us. Copying an existing garment is often the most accurate route — we can draft a pattern directly from it without touching your measurements at all. The original is returned unharmed.",
      },
      {
        question: "Is there a minimum order value?",
        answer:
          "No. Alterations start at ₹800 and we take them as readily as a bridal commission. That said, bespoke commissions from scratch start at ₹6,500 because the pattern drafting alone takes a day.",
      },
    ],
  },
  {
    category: "Measurements & Fit",
    items: [
      {
        question: "Which twelve measurements do you take?",
        answer:
          "Bust, underbust, waist, hip, shoulder width, shoulder slope, front neck depth, back neck depth, armhole circumference, sleeve length, bicep circumference and full garment length. Shoulder slope and underbust are the two most commonly skipped elsewhere, and the two that most often explain a poor fit.",
      },
      {
        question: "What if the garment still does not fit when it arrives?",
        answer:
          "Alterations are free for ninety days. Post it back at our cost, tell us what feels wrong, and we adjust it. If a piece cannot be made to fit — which is rare, but it happens — we remake it or refund you in full.",
      },
      {
        question: "Do you keep my measurements for future orders?",
        answer:
          "Yes, on your account under Saved Measurements. You can hold several named profiles, which is useful if you order for family as well as yourself. You can edit or delete them at any time.",
      },
      {
        question: "I am between sizes on your ready-to-wear. What should I do?",
        answer:
          "Order the larger size and mention it at checkout — we will take it in to your measurements before dispatch at no extra charge. This is the whole advantage of buying from a tailoring house rather than a retailer.",
      },
    ],
  },
  {
    category: "Fabric & Care",
    items: [
      {
        question: "What fabrics do you work with?",
        answer:
          "Handloom cotton, chanderi, mulberry and tussar silk, linen, and wool for winter pieces. We do not use polyester blends or synthetic linings — not as a rule we bend for volume, simply because they wear worse and breathe badly in Indian summers.",
      },
      {
        question: "Can I supply my own fabric?",
        answer:
          "Yes, and many customers do, particularly with inherited saree fabric. We will tell you honestly if the cloth is unsuitable for the cut you have in mind before we take the order, and we will advise on how much yardage you need.",
      },
      {
        question: "How should I care for a hand-finished garment?",
        answer:
          "Dry clean silk and anything embroidered. Handloom cotton can be hand-washed cold with a mild detergent, then dried flat in shade — never wrung, and never in direct sun, which will fade natural dyes within a season. Press on the reverse.",
      },
    ],
  },
  {
    category: "Delivery, Returns & Payment",
    items: [
      {
        question: "How long does an order take?",
        answer:
          "Made-to-measure from an existing design takes ten to fourteen days. A bespoke commission takes three to four weeks. Bridal work takes eight to twelve weeks and should be started as early as you can — we take a limited number per season so the tailors are not stretched.",
      },
      {
        question: "Do you deliver outside India?",
        answer:
          "We ship across India as standard, insured and tracked. International delivery is available on request — contact us with your destination and we will quote shipping and confirm duties before you commit.",
      },
      {
        question: "What is your returns policy on made-to-measure?",
        answer:
          "Because each piece is cut for one person, made-to-measure and bespoke garments cannot be returned for a change of mind. What you get instead is stronger: ninety days of free alterations, and a full remake or refund if we have not met the specification you approved.",
      },
      {
        question: "When do I pay?",
        answer:
          "Ready-to-wear is paid in full at checkout. Bespoke and bridal commissions are split — fifty percent to begin work, the balance before dispatch. We will never start cutting before the deposit clears, and never dispatch before you have seen fitting photographs.",
      },
    ],
  },
];

/** Flat list, for JSON-LD FAQPage markup. */
export const allFaqs = faqGroups.flatMap((group) => group.items);
