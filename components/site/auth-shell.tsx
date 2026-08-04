import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { IMAGES } from "@/data/home";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";

import { BrandMark } from "./brand-mark";
import { Icon } from "./icons";

/**
 * Shared split layout for /login, /register and /verify-otp.
 *
 * Editorial panel on the left (hidden on mobile so the form gets the full
 * viewport), form on the right. Keeps the three auth screens consistent without
 * each one rebuilding a layout.
 */
export function AuthShell({
  eyebrow,
  title,
  points,
  footnote,
  children,
  altLinks,
}: {
  eyebrow: string;
  title: string;
  points: string[];
  footnote?: ReactNode;
  children: ReactNode;
  altLinks?: { label: string; href: string }[];
}) {
  return (
    <section className="grid min-h-[calc(100svh-6rem)] lg:grid-cols-[1fr_1fr]">
      {/* Editorial side */}
      <div className="relative hidden overflow-hidden bg-espresso lg:block">
        <Image
          src={IMAGES.lehenga}
          alt=""
          aria-hidden="true"
          fill
          sizes="50vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/80 to-espresso/50" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <BrandMark onDark />

          <div>
            <Reveal direction="fade">
              <p className="eyebrow flex items-center gap-3 text-brass-soft">
                <span aria-hidden="true" className="h-px w-7 bg-brass-soft" />
                {eyebrow}
              </p>
            </Reveal>

            <SplitReveal
              as="h2"
              by="lines"
              immediate
              delay={0.15}
              className="mt-6 display-lg text-on-dark"
            >
              {title}
            </SplitReveal>

            <Reveal
              stagger={0.09}
              className="mt-10 grid gap-3.5"
            >
              {points.map((point) => (
                <p
                  key={point}
                  className="flex gap-3 text-sm leading-7 text-on-dark-soft"
                >
                  <Icon
                    name="check"
                    className="mt-1 h-4 w-4 shrink-0 text-brass-soft"
                  />
                  {point}
                </p>
              ))}
            </Reveal>
          </div>

          {footnote ? (
            <div className="rounded-card border border-on-dark/12 bg-espresso-soft/60 p-5 text-xs leading-6 text-on-dark-soft">
              {footnote}
            </div>
          ) : (
            <span />
          )}
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden">
            <BrandMark />
          </div>

          <div className="mt-10 lg:mt-0">
            <p className="eyebrow text-brass-ink">{eyebrow}</p>
            <h1 className="mt-4 display-md text-ink">{title}</h1>
          </div>

          <div className="mt-9">{children}</div>

          {altLinks?.length ? (
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-6 text-sm">
              {altLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-ink-soft transition-colors hover:text-brass-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
