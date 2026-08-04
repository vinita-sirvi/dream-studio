export type PolicySection = {
  heading: string;
  body: string[];
};

export type Policy = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: PolicySection[];
};

/**
 * Policy copy for /terms, /privacy-policy and /return-policy.
 *
 * Written to describe how this application actually behaves — the session cookie,
 * Cloudinary uploads and Resend email in particular are real implementation
 * details, not boilerplate. Have a lawyer review before relying on it commercially.
 */

export const returnPolicy: Policy = {
  eyebrow: "Returns & Exchange",
  title: "What happens when something is not right",
  updated: "1 August 2026",
  intro:
    "We would rather fix a garment than take it back, because a piece cut for you cannot be sold to anyone else. This policy is built around that.",
  sections: [
    {
      heading: "Made-to-measure and bespoke orders",
      body: [
        "Garments cut to your measurements cannot be returned for a change of mind. Every piece is drafted from a pattern made for one body, and there is no second customer for it.",
        "In place of returns you get ninety days of free alterations from the date of delivery. Post the garment back at our cost, describe what feels wrong, and we adjust it. There is no limit on the number of adjustments within that window.",
        "If we have not met the specification you approved — wrong fabric, wrong finish, wrong measurements on our side — we remake the garment or refund you in full, at your choosing. Shipping both ways is ours.",
      ],
    },
    {
      heading: "Ready-to-wear orders",
      body: [
        "Unworn ready-to-wear may be returned within fourteen days of delivery for a full refund, with original tags attached and in its original packaging.",
        "Return shipping on a change of mind is yours to arrange. If the item is faulty or we sent the wrong thing, we cover it and refund the original shipping too.",
        "Refunds are issued to the original payment method within five to seven working days of the garment reaching us and passing inspection.",
      ],
    },
    {
      heading: "What we cannot accept back",
      body: [
        "Garments that have been worn, washed, altered by a third party, or damaged after delivery.",
        "Pieces made from fabric you supplied, where the fabric itself was the cause of the problem. We will tell you before accepting such an order if we have concerns.",
        "Custom bridal commissions past the final approved fitting, since the remaining work is finishing only.",
        "Items bought during a clearance sale and marked final sale at the time of purchase.",
      ],
    },
    {
      heading: "How to start a return or alteration",
      body: [
        "Email support@divyaanddesign.com or message us on WhatsApp with your order number and a photograph of the issue. Photographs genuinely speed this up — often a tailor can diagnose a fit problem from one image.",
        "We reply within one working day with a prepaid return label where applicable, and a realistic turnaround for the work.",
      ],
    },
  ],
};

export const privacyPolicy: Policy = {
  eyebrow: "Privacy",
  title: "What we collect, and what we do with it",
  updated: "1 August 2026",
  intro:
    "We collect what is needed to make your clothes and get them to you. Nothing is sold to anyone, ever.",
  sections: [
    {
      heading: "Information you give us",
      body: [
        "Account details: your name, email address and, optionally, a phone number. Passwords are stored only as a salted hash and cannot be read by us or recovered — they can only be reset.",
        "Body measurements, if you choose to save them. These are stored against your account so repeat orders do not require re-measuring. You can view, edit or delete them at any time from Saved Measurements.",
        "Order information: shipping and billing addresses, garment specifications, and any notes or inspiration images you upload with a custom order.",
      ],
    },
    {
      heading: "Information collected automatically",
      body: [
        "A single signed session cookie that keeps you logged in. It contains your user id, email, name and role, is signed so it cannot be tampered with, is HTTP-only so scripts cannot read it, and expires after thirty days.",
        "Standard server request logs. We do not run third-party advertising or cross-site tracking scripts.",
      ],
    },
    {
      heading: "Third parties we rely on",
      body: [
        "Cloudinary hosts images you upload with a custom order, and our own product photography.",
        "Resend delivers transactional email — one-time login codes, order confirmations and delivery updates.",
        "MongoDB Atlas stores the application database.",
        "Each of these processes data only to provide its service to us. None of them receives your data for their own marketing.",
      ],
    },
    {
      heading: "Marketing email",
      body: [
        "We email you about your order regardless, because you need to know where it is. Newsletter email is separate and opt-in only.",
        "Every newsletter carries a working unsubscribe link, and unsubscribing never affects order-related email.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You can request a copy of everything we hold about you, ask us to correct it, or ask us to delete your account and its data. Email support@divyaanddesign.com and we will respond within thirty days.",
        "Deleting your account removes your profile, saved measurements and addresses. We retain order and invoice records where tax law requires it.",
      ],
    },
  ],
};

export const termsPolicy: Policy = {
  eyebrow: "Terms of Service",
  title: "The agreement between us",
  updated: "1 August 2026",
  intro:
    "Placing an order means accepting these terms. They are written to be read, not to be impenetrable.",
  sections: [
    {
      heading: "Orders and acceptance",
      body: [
        "An order is a request until we confirm it. We confirm in writing, with a price and a delivery estimate, and only then does a contract exist between us.",
        "We may decline an order — if the fabric you have supplied is unsuitable for the cut, if the delivery date is not achievable at the quality we hold ourselves to, or if our bridal calendar for the season is full.",
        "Prices are in Indian Rupees and include applicable GST. Bespoke quotations are valid for fourteen days.",
      ],
    },
    {
      heading: "Payment",
      body: [
        "Ready-to-wear is paid in full at checkout. Bespoke and bridal commissions are split: fifty percent to begin work, the balance before dispatch.",
        "We do not begin cutting before the deposit has cleared, and we do not dispatch before you have seen fitting photographs and approved them.",
        "Deposits are refundable up until we cut the cloth. After cutting, the deposit covers work already performed and materials already committed.",
      ],
    },
    {
      heading: "Timelines",
      body: [
        "Delivery estimates are given honestly and met the large majority of the time. They are estimates, not guarantees.",
        "If a piece will be late we tell you as soon as we know, rather than on the due date. Where lateness is our fault and the date was material — a wedding, a specific event — we will discuss a remedy, including a partial refund.",
      ],
    },
    {
      heading: "Your responsibilities",
      body: [
        "Measurements you supply yourself are yours to get right. We will flag anything that looks inconsistent, but we cut to what we are given. Alterations arising from incorrect self-measurement fall under the free ninety-day window regardless.",
        "Keep your account credentials to yourself. You are responsible for activity under your login.",
        "Inspiration images you upload must be yours to share or otherwise permitted for this purpose.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "Our own designs, patterns, photography and site content remain ours.",
        "A pattern drafted specifically for your body is used for your orders only, and is not resold or reused for other customers.",
      ],
    },
    {
      heading: "Liability",
      body: [
        "Our liability for any order is limited to the value of that order.",
        "We are not liable for consequential loss — a missed event, for instance — beyond that value. Nothing here limits liability that cannot lawfully be limited.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of India, and the courts of Mumbai have exclusive jurisdiction over any dispute.",
      ],
    },
  ],
};
