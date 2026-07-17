import { SectionPage } from "@/components/site/section-page";

export default function AboutPage() {
  return (
    <SectionPage
      eyebrow="About Us"
      title="A premium fashion boutique experience built around craftsmanship."
      description="This space introduces the brand story, atelier values, quality promise, and customer trust signals."
      points={[
        "Luxury, minimal aesthetic aligned with the reference design.",
        "Ideal for brand storytelling, studio photography, and team details.",
        "Supports structured SEO metadata and schema markup later.",
      ]}
      primaryCta={{ label: "Contact Us", href: "/contact" }}
      secondaryCta={{ label: "Explore Shop", href: "/shop" }}
    />
  );
}
