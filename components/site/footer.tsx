import Link from "next/link";

import { footerQuickLinks } from "@/data/navigation";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#eadccc] bg-[#f6ede3]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <h3
              className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f2319]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              About Us
            </h3>
            <p className="max-w-sm text-sm leading-7 text-[#5f4f43]">
              We create customized outfits that reflect your style and
              personality. Designed with love, stitched with perfection.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-flex text-sm font-medium text-[#2f2319] transition hover:text-[#8a5c39]"
            >
              {"Know More ->"}
            </Link>
          </div>

          <div>
            <h3
              className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f2319]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-[#5f4f43]">
              {footerQuickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-[#8a5c39]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f2319]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Customer Care
            </h3>
            <div className="space-y-2 text-sm leading-6 text-[#5f4f43]">
              <p>+91 98765 43210</p>
              <p>support@divyaanddesign.com</p>
              <p>Mon - Sat | 10 AM - 7 PM</p>
            </div>
          </div>

          <div>
            <h3
              className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f2319]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Newsletter
            </h3>
            <p className="max-w-sm text-sm leading-7 text-[#5f4f43]">
              Subscribe to get special offers, free giveaways & updates.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 border-t border-[#e2d2c0] pt-5 text-center text-xs tracking-[0.18em] text-[#8a7768]">
          (c) 2024 Divya & Design. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
