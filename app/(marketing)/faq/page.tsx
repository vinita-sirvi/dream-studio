import { SectionPage } from "@/components/site/section-page";

export default function FaqPage() {
  return (
    <SectionPage
      eyebrow="FAQ"
      title="Frequently asked questions for sizing, shipping, orders, and custom stitching."
      description="A structured FAQ route supports customer support, SEO schema, and purchase confidence."
      points={[
        "Ideal for size guide and custom order clarification.",
        "Can later be driven from the admin CMS.",
        "Works well with FAQ schema for search visibility.",
      ]}
      primaryCta={{ label: "Size Guide", href: "/saved-measurements" }}
      secondaryCta={{ label: "Support", href: "/contact" }}
    />
  );
}
