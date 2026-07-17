import { SectionPage } from "@/components/site/section-page";

export default function TermsPage() {
  return (
    <SectionPage
      eyebrow="Policies"
      title="Terms and conditions for orders, payments, custom garments, and support."
      description="This route exists to complete the legal and customer-trust architecture for the website."
      points={[
        "Useful for payment, refund, and custom-order rules.",
        "Can later be managed by CMS or admin pages.",
        "Important for checkout and dispute handling.",
      ]}
      primaryCta={{ label: "Privacy Policy", href: "/privacy-policy" }}
      secondaryCta={{ label: "FAQ", href: "/faq" }}
    />
  );
}
