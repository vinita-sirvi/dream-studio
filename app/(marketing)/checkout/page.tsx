import { SectionPage } from "@/components/site/section-page";

export default function CheckoutPage() {
  return (
    <SectionPage
      eyebrow="Checkout"
      title="A secure checkout experience with address, shipping, payment, and order review."
      description="The checkout flow is designed to support guest checkout, saved addresses, terms acceptance, and payment gateway integration."
      points={[
        "Billing and shipping addresses are supported separately.",
        "Prepared for coupon, gift wrap, and shipping method selection.",
        "Built for payment success, failure, and notification workflows.",
      ]}
      primaryCta={{ label: "Login", href: "/account" }}
      secondaryCta={{ label: "Back to Cart", href: "/cart" }}
    />
  );
}
