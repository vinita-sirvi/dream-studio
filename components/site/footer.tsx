import Link from "next/link";

import {
  brandContact,
  footerCareLinks,
  footerQuickLinks,
  socialLinks,
} from "@/data/navigation";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";

import { Icon } from "./icons";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-espresso text-on-dark">
      {/* Newsletter band */}
      <div className="border-b border-on-dark/10">
        <div className="shell grid gap-10 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div>
            <p className="eyebrow flex items-center gap-3 text-on-dark-soft">
              <span aria-hidden="true" className="h-px w-7 bg-brass-soft" />
              The Atelier Letter
            </p>
            <SplitReveal
              as="h2"
              by="lines"
              className="mt-5 display-lg text-on-dark"
            >
              First look at new collections, and the occasional note from the
              workroom.
            </SplitReveal>
          </div>
          <Reveal direction="up">
            <NewsletterForm onDark />
          </Reveal>
        </div>
      </div>

      {/* Link columns */}
      <div className="shell grid gap-12 py-16 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-2xl text-on-dark">Divya &amp; Design</p>
          <p className="mt-5 max-w-sm text-sm leading-7 text-on-dark-soft">
            An atelier for made-to-measure clothing. Every piece is cut for one
            person and finished by hand — drape, fall and fit decided together
            before a single stitch is made.
          </p>

          <ul className="mt-7 flex gap-2.5">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-on-dark/20 text-on-dark-soft transition-colors duration-300 hover:border-brass-soft hover:text-on-dark"
                >
                  <Icon name={social.icon} className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title="Explore" links={footerQuickLinks} />
        <FooterColumn title="Customer Care" links={footerCareLinks} />

        <div>
          <h3 className="eyebrow text-on-dark-soft">Visit &amp; Contact</h3>
          <address className="mt-6 grid gap-4 text-sm not-italic leading-6 text-on-dark-soft">
            <span className="flex gap-3">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brass-soft" />
              {brandContact.address}
            </span>
            <a
              href={`tel:${brandContact.phone.replace(/\s/g, "")}`}
              className="flex gap-3 transition-colors hover:text-on-dark"
            >
              <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-brass-soft" />
              {brandContact.phone}
            </a>
            <a
              href={`mailto:${brandContact.email}`}
              className="flex gap-3 transition-colors hover:text-on-dark"
            >
              <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-brass-soft" />
              {brandContact.email}
            </a>
            <span className="flex gap-3">
              <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-brass-soft" />
              {brandContact.hours}
            </span>
          </address>
        </div>
      </div>

      {/* Oversized wordmark — a common device on fashion sites, purely visual */}
      <div
        aria-hidden="true"
        className="shell overflow-hidden pb-2 pt-4 select-none"
      >
        <p className="whitespace-nowrap text-center font-display text-[13vw] leading-[0.8] text-on-dark/[0.06]">
          Divya &amp; Design
        </p>
      </div>

      <div className="border-t border-on-dark/10">
        <div className="shell flex flex-col gap-4 py-7 text-xs text-on-dark-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Divya &amp; Design. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/terms" className="transition-colors hover:text-on-dark">
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-on-dark"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/return-policy"
                className="transition-colors hover:text-on-dark"
              >
                Returns
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow text-on-dark-soft">{title}</h3>
      <ul className="mt-6 grid gap-3.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group/link inline-flex items-center gap-2 text-on-dark-soft transition-colors duration-300 hover:text-on-dark"
            >
              <span
                aria-hidden="true"
                className="h-px w-0 bg-brass-soft transition-all duration-400 ease-[var(--ease-out-expo)] group-hover/link:w-4"
              />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
