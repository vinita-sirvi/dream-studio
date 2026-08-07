import type { Metadata } from "next";

import { brandContact, socialLinks } from "@/data/navigation";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { CursorFollower } from "@/components/motion/cursor-follower";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { WishlistProvider } from "@/components/site/wishlist/wishlist-provider";

const BASE = process.env.APP_URL ?? "http://localhost:3000";

/** Organisation + LocalBusiness markup, applied once across the storefront. */
const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ClothingStore"],
  name: "Divya & Design",
  description:
    "A bespoke tailoring atelier making custom-fitted clothing to individual measurements.",
  url: BASE,
  telephone: brandContact.phone,
  email: brandContact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Atelier No. 12, Linking Road, Bandra West",
    addressLocality: "Mumbai",
    postalCode: "400050",
    addressCountry: "IN",
  },
  openingHours: "Mo-Sa 10:00-19:00",
  priceRange: "₹₹",
  sameAs: socialLinks.map((social) => social.href),
};

export const metadata: Metadata = {
  title: {
    default: "Divya & Design — Bespoke Tailoring & Custom Fashion",
    template: "%s | Divya & Design",
  },
  description:
    "Custom tailoring, ready-to-wear, and made-to-measure ordering from an atelier that cuts every piece for one person.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        // Static brand data, no user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
      />

      {/* Both render null and attach no listeners under prefers-reduced-motion. */}
      <SmoothScroll />
      <CursorFollower />

      {/* Shares one wishlist read across every product card on the page. */}
      <WishlistProvider>
        <SiteHeader />
        {/* `main` is the skip-link target; flex-1 keeps the footer at the bottom
            on short pages. */}
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </WishlistProvider>
    </>
  );
}
