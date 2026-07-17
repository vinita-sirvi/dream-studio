import { SectionPage } from "@/components/site/section-page";

export default function ReturnPolicyPage() {
  return (
    <SectionPage
      eyebrow="Policies"
      title="A dedicated return and exchange policy page for post-purchase confidence."
      description="This page supports customer service expectations and helps reduce friction before checkout."
      points={[
        "Clear exchange, return, and refund rules.",
        "Can be maintained without code changes later.",
        "Supports trust for premium fashion purchases.",
      ]}
      primaryCta={{ label: "Shop", href: "/shop" }}
      secondaryCta={{ label: "Contact", href: "/contact" }}
    />
  );
}
