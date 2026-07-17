import { SectionPage } from "@/components/site/section-page";

export default function CartPage() {
  return (
    <SectionPage
      eyebrow="Cart"
      title="A dynamic cart that can calculate discounts, taxes, and shipping estimates."
      description="This route is intended for order summary, coupons, gift cards, and final checkout handoff."
      points={[
        "Supports coupons, gift wrap, and shipping estimates.",
        "Prepared for tax and order summary calculations.",
        "Can hand off to guest or login checkout flows.",
      ]}
      primaryCta={{ label: "Checkout", href: "/checkout" }}
      secondaryCta={{ label: "Shop More", href: "/shop" }}
    />
  );
}
