import { SectionPage } from "@/components/site/section-page";

export default function AccountPage() {
  return (
    <SectionPage
      eyebrow="My Account"
      title="Customer profile, preferences, passwords, and notification settings."
      description="This dashboard area will later centralize identity, saved data, and account settings."
      points={[
        "Profile and email preferences.",
        "Saved addresses and measurements.",
        "Orders, wishlist, and support access.",
      ]}
      primaryCta={{ label: "Orders", href: "/orders" }}
      secondaryCta={{ label: "Measurements", href: "/saved-measurements" }}
    />
  );
}
