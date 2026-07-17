import { SectionPage } from "@/components/site/section-page";

export default function CollectionsPage() {
  return (
    <SectionPage
      eyebrow="Collections"
      title="New arrivals, festive edits, wedding collections, and curated capsules."
      description="Collection pages are intended to power campaigns, seasonal drops, and dynamic merchandising from the admin panel."
      points={[
        "New arrivals, trending, best sellers, and editor's picks.",
        "Campaign-based collections can be featured on the home page.",
        "Built to support scheduled publishing and expiry dates.",
      ]}
      primaryCta={{ label: "New Arrivals", href: "/collections?type=new-arrivals" }}
      secondaryCta={{ label: "Wedding Edit", href: "/collections?type=wedding" }}
    />
  );
}
