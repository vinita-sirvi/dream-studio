import { SectionPage } from "@/components/site/section-page";

export default function PrivacyPolicyPage() {
  return (
    <SectionPage
      eyebrow="Policies"
      title="Privacy, shipping, returns, and legal pages should be easy to manage and index."
      description="This placeholder documents the site structure for policy pages and helps complete the sitemap architecture."
      points={[
        "Dynamic policy pages can be edited from admin later.",
        "Prepared for canonical URLs and SEO metadata.",
        "Supports trust-building and compliance content.",
      ]}
      primaryCta={{ label: "Terms", href: "/terms" }}
      secondaryCta={{ label: "Return Policy", href: "/return-policy" }}
    />
  );
}
