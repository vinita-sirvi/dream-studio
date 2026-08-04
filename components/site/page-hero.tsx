import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { cn } from "@/lib/cn";

import { Icon } from "./icons";

export type Crumb = { label: string; href?: string };

/**
 * Inner-page hero.
 *
 * Two variants:
 *  - `image`  — dark, with a parallax photograph. For editorial pages.
 *  - `plain`  — light canvas. For utility pages (cart, policies, account).
 *
 * Shared so the twenty-odd inner pages stay visually consistent without each
 * one re-implementing a header.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  image,
  crumbs = [],
  align = "left",
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: ReactNode;
  /** Provide to get the dark image variant. */
  image?: string;
  crumbs?: Crumb[];
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const onDark = Boolean(image);
  const centered = align === "center";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        onDark ? "bg-espresso" : "border-b border-line bg-canvas-warm",
      )}
    >
      {image ? (
        <div aria-hidden="true" className="absolute inset-0">
          <Parallax amount={-8} className="h-[115%] w-full">
            <div className="relative h-full w-full">
              <Image
                src={image}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-[center_30%] opacity-40"
              />
            </div>
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/70 to-espresso/40" />
        </div>
      ) : null}

      <div
        className={cn(
          "shell relative pb-16 pt-32 md:pb-20 md:pt-40",
          centered && "text-center",
        )}
      >
        {crumbs.length ? (
          <Reveal direction="fade">
            <nav aria-label="Breadcrumb">
              <ol
                className={cn(
                  "flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em]",
                  centered && "justify-center",
                  onDark ? "text-on-dark-soft" : "text-ink-faint",
                )}
              >
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-brass"
                  >
                    Home
                  </Link>
                </li>
                {crumbs.map((crumb) => (
                  <li key={crumb.label} className="flex items-center gap-2">
                    <Icon name="chevron-right" className="h-3 w-3 opacity-50" />
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="transition-colors hover:text-brass"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        aria-current="page"
                        className={onDark ? "text-on-dark" : "text-ink"}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        ) : null}

        <Reveal direction="fade" delay={0.05}>
          <p
            className={cn(
              "eyebrow mt-8 flex items-center gap-3",
              centered && "justify-center",
              onDark ? "text-brass-soft" : "text-brass-ink",
            )}
          >
            <span
              aria-hidden="true"
              className={cn("h-px w-7", onDark ? "bg-brass-soft" : "bg-brass")}
            />
            {eyebrow}
          </p>
        </Reveal>

        <SplitReveal
          as="h1"
          by="lines"
          immediate
          delay={0.15}
          className={cn(
            "mt-6 display-xl",
            centered ? "mx-auto max-w-4xl" : "max-w-4xl",
            onDark ? "text-on-dark" : "text-ink",
          )}
        >
          {title}
        </SplitReveal>

        {accent ? (
          <Reveal direction="up" delay={0.3}>
            <p
              className={cn(
                "mt-3 font-display text-3xl italic md:text-4xl",
                onDark ? "text-brass-soft" : "text-brass",
              )}
            >
              {accent}
            </p>
          </Reveal>
        ) : null}

        {description ? (
          <Reveal direction="up" delay={0.35}>
            <div
              className={cn(
                "mt-7 text-base leading-8",
                centered ? "mx-auto max-w-2xl" : "max-w-2xl",
                onDark ? "text-on-dark-soft" : "text-ink-soft",
              )}
            >
              {description}
            </div>
          </Reveal>
        ) : null}

        {children ? (
          <Reveal direction="up" delay={0.45} className="mt-10">
            {children}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
