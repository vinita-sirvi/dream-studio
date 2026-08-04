import type { ProductCardProduct } from "./product-card";

import { Hero } from "./home/hero";
import { TrustMarquee } from "./home/trust-marquee";
import { FeaturedCollections } from "./home/featured-collections";
import { PromiseStrip } from "./home/promise-strip";
import { CategoryGrid } from "./home/category-grid";
import { Services } from "./home/services";
import { Process } from "./home/process";
import { Craftsmanship } from "./home/craftsmanship";
import { Measurement } from "./home/measurement";
import { LatestArrivals } from "./home/latest-arrivals";
import { WhyChooseUs } from "./home/why-choose-us";
import { Gallery } from "./home/gallery";
import { Testimonials } from "./home/testimonials";
import { SocialShowcase } from "./home/social-showcase";
import { TrustBar } from "./home/trust-bar";
import { ContactCta } from "./home/contact-cta";

/**
 * Homepage composition root.
 *
 * Every section is its own file with its own bespoke layout — there is no shared
 * "section" template, which is what keeps the page from reading as a template.
 *
 * Section order alternates light / warm / dark bands so the page has rhythm
 * rather than being one continuous scroll of cream.
 *
 * Note: no <main> here — the (marketing) layout provides it, and nesting a
 * second one would be invalid.
 */
export function LandingPage({
  products,
}: {
  products: ProductCardProduct[];
}) {
  return (
    <>
      {/* 1 */} <Hero />
      {/* 2 */} <TrustMarquee />
      {/* 3 */} <FeaturedCollections />
      {/* 4 */} <PromiseStrip />
      {/* 5 */} <CategoryGrid />
      {/* 6 */} <Services />
      {/* 7 */} <Process />
      {/* 8 */} <Craftsmanship />
      {/* 9 */} <Measurement />
      {/* 10 */} <LatestArrivals products={products} />
      {/* 11 */} <WhyChooseUs />
      {/* 12 */} <Gallery />
      {/* 13 */} <Testimonials />
      {/* 14 */} <SocialShowcase />
      {/* 15 */} <TrustBar />
      {/* 16 */} <ContactCta />
    </>
  );
}
