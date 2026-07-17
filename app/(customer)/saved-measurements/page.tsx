import { SectionPage } from "@/components/site/section-page";

export default function SavedMeasurementsPage() {
  return (
    <SectionPage
      eyebrow="Measurements"
      title="Saved measurements for self, family, and repeat custom orders."
      description="This area is intended for multi-profile measurement storage and quick reuse during custom tailoring."
      points={[
        "Supports multiple named profiles.",
        "Ideal for height, bust, waist, hip, and sleeve data.",
        "Helps speed up custom order placement.",
      ]}
      primaryCta={{ label: "Custom Order", href: "/custom-order" }}
      secondaryCta={{ label: "Addresses", href: "/saved-addresses" }}
    />
  );
}
