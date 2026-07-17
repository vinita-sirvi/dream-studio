import { SectionPage } from "@/components/site/section-page";

export default function WishlistPage() {
  return (
    <SectionPage
      eyebrow="Wishlist"
      title="Save pieces for later and move them into cart when you're ready."
      description="Wishlist support is planned for both guest users and authenticated accounts with product preservation across sessions."
      points={[
        "Move-to-cart and remove actions.",
        "Works for guest and logged-in customers.",
        "Useful for high-intent shopping and retargeting.",
      ]}
      primaryCta={{ label: "Continue Shopping", href: "/shop" }}
      secondaryCta={{ label: "Account", href: "/account" }}
    />
  );
}
