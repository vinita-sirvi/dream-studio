import { footerLinks } from "@/data/home";

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
            <a
              href="#home"
              className="mt-4 inline-flex text-sm font-medium text-[#2f2319] transition hover:text-[#8a5c39]"
            >
              Know More →
            </a>
          </div>

          <div>
            <h3
              className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f2319]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-[#5f4f43]">
              {footerLinks.map((link) => (
                <li key={link}>
                  <a href="#home" className="transition hover:text-[#8a5c39]">
                    {link}
                  </a>
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
            <form className="mt-5 flex max-w-md overflow-hidden rounded-md border border-[#d7c6b3] bg-white">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 px-4 py-3 text-sm outline-none placeholder:text-[#9a8c80]"
              />
              <button
                type="submit"
                className="bg-[#2a1b10] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#3c2818]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-[#e2d2c0] pt-5 text-center text-xs tracking-[0.18em] text-[#8a7768]">
          © 2024 Divya & Design. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
