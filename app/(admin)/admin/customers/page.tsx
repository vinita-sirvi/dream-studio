import { SectionPage } from "@/components/site/section-page";

export default function AdminCustomersPage() {
  return (
    <SectionPage
      eyebrow="Admin / Customers"
      title="Customer profiles, saved measurements, order history, and support."
      description="This page gives the team a structured view of accounts, customer activity, and relationships."
      points={[
        "Profiles, measurements, and addresses.",
        "Order and support history access.",
        "Future-ready for roles and permissions.",
      ]}
      primaryCta={{ label: "Settings", href: "/admin/settings" }}
      secondaryCta={{ label: "Back to Admin", href: "/admin" }}
    />
  );
}
