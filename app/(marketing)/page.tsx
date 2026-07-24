import { LandingPage } from "@/components/site/landing-page";
import { getShopData } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export default async function MarketingHomePage() {
  const { featuredProducts } = await getShopData();
  return <LandingPage products={featuredProducts} />;
}
