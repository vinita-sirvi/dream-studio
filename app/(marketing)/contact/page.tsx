import type { Metadata } from "next";
import { Suspense } from "react";

import { IMAGES } from "@/data/home";
import { brandContact, socialLinks } from "@/data/navigation";
import { ContactForm } from "@/components/site/contact-form";
import { PageHero } from "@/components/site/page-hero";
import { Icon } from "@/components/site/icons";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the studio about fit, fabric, a commission, or an existing order. We reply within one working day.",
};

const CHANNELS = [
  {
    icon: "whatsapp" as const,
    label: "WhatsApp",
    value: brandContact.phone,
    href: "https://wa.me/919876543210",
    note: "Fastest for fit and fabric questions — send a photograph.",
  },
  {
    icon: "mail" as const,
    label: "Email",
    value: brandContact.email,
    href: `mailto:${brandContact.email}`,
    note: "Best for commissions and anything with attachments.",
  },
  {
    icon: "phone" as const,
    label: "Telephone",
    value: brandContact.phone,
    href: `tel:${brandContact.phone.replace(/\s/g, "")}`,
    note: brandContact.hours,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you have in mind"
        description="Whether it is a question about fabric, a fitting problem, or a commission you have been thinking about for months — start here."
        image={IMAGES.kurti}
        crumbs={[{ label: "Contact" }]}
      />

      <section className="shell grid gap-14 py-16 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Channels */}
        <div>
          <Reveal stagger={0.08} className="grid gap-px bg-line">
            {CHANNELS.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  channel.href.startsWith("http")
                    ? "noreferrer noopener"
                    : undefined
                }
                className="group/ch flex gap-5 bg-canvas py-6 transition-colors hover:bg-brass-wash"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-brass transition-colors group-hover/ch:border-brass">
                  <Icon name={channel.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                    {channel.label}
                  </span>
                  <span className="mt-1 block truncate font-display text-lg text-ink">
                    {channel.value}
                  </span>
                  <span className="mt-1 block text-xs leading-6 text-ink-soft">
                    {channel.note}
                  </span>
                </span>
              </a>
            ))}
          </Reveal>

          {/* Studio */}
          <Reveal
            direction="up"
            className="mt-10 rounded-card border border-line bg-canvas-warm p-7"
          >
            <p className="eyebrow text-brass-ink">The Atelier</p>
            <address className="mt-4 text-sm not-italic leading-7 text-ink-soft">
              {brandContact.address}
            </address>
            <p className="mt-4 flex gap-2.5 text-sm text-ink-soft">
              <Icon name="clock" className="mt-1 h-4 w-4 shrink-0 text-brass" />
              {brandContact.hours}
            </p>
            <p className="mt-5 border-t border-line pt-5 text-xs leading-6 text-ink-soft">
              No appointment needed to browse fabric. Fittings are by appointment
              so a tailor is free to see you properly.
            </p>
          </Reveal>

          {/* Social */}
          <div className="mt-8">
            <p className="eyebrow text-ink-faint">Elsewhere</p>
            <ul className="mt-4 flex gap-2.5">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-line text-brass-ink transition-colors hover:border-brass hover:bg-brass-wash"
                  >
                    <Icon name={social.icon} className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form */}
        <div>
          <h2 className="display-md text-ink">Send a message</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-ink-soft">
            We reply within one working day. If your question is about fit, a
            photograph in the message saves a lot of back and forth.
          </p>
          {/* ContactForm reads `?subject=` via useSearchParams, which needs a
              Suspense boundary so this page can still be statically rendered. */}
          <Suspense
            fallback={
              <div className="mt-9 h-[32rem] rounded-panel border border-line bg-surface" />
            }
          >
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
