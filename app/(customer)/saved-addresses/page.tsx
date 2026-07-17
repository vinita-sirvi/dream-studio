import { SectionPage } from "@/components/site/section-page";

export default function SavedAddressesPage() {
  return (
    <SectionPage
      eyebrow="Addresses"
      title="Billing and shipping addresses stored securely for repeat checkout."
      description="This page will later power address management and delivery optimization."
      points={[
        "Multiple address support.",
        "Works with guest and registered accounts.",
        "Useful for checkout and order editing.",
      ]}
      primaryCta={{ label: "Checkout", href: "/checkout" }}
      secondaryCta={{ label: "Account", href: "/account" }}
    />
  );
}
