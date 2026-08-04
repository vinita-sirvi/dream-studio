import Image from "next/image";
import type { Metadata } from "next";

import { IMAGES } from "@/data/home";
import { formatJournalDate, journalPosts } from "@/data/journal";
import { PageHero } from "@/components/site/page-hero";
import { Icon } from "@/components/site/icons";
import { ImageReveal } from "@/components/motion/image-reveal";
import { Reveal } from "@/components/motion/reveal";
import { NewsletterForm } from "@/components/site/newsletter-form";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes from the workroom on fabric, fit, bridal timelines, restoration and garment care.",
};

/**
 * Journal index.
 *
 * Presented as an index only. There is no /blogs/[slug] route and no seeded Blog
 * documents in this codebase, so cards deliberately do not link anywhere — a
 * card that navigates to a 404 is worse than one that clearly does not navigate.
 * Adding the detail route is the natural next step.
 */
export default function JournalPage() {
  const [lead, ...rest] = journalPosts;

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Notes from the workroom"
        description="Fabric, fit and construction, written by the people doing the cutting. Practical rather than promotional."
        image={IMAGES.dress}
        crumbs={[{ label: "Journal" }]}
      />

      {/* Lead article */}
      <section className="shell py-16 md:py-20">
        <article className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          <ImageReveal className="relative aspect-16/11 overflow-hidden rounded-panel">
            <div className="relative h-full w-full">
              <Image
                src={lead.image}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 92vw"
                className="object-cover"
              />
            </div>
          </ImageReveal>

          <div>
            <Reveal direction="fade">
              <p className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em]">
                <span className="rounded-full bg-brass-wash px-3 py-1.5 text-brass-ink">
                  {lead.category}
                </span>
                <time dateTime={lead.date} className="text-ink-faint">
                  {formatJournalDate(lead.date)}
                </time>
                <span className="text-ink-faint">
                  {lead.readMinutes} min read
                </span>
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-5 display-lg text-ink">{lead.title}</h2>
              <p className="mt-5 max-w-xl text-[15px] leading-8 text-ink-soft">
                {lead.excerpt}
              </p>
              <p className="mt-6 text-sm text-ink-faint">By {lead.author}</p>
            </Reveal>
          </div>
        </article>
      </section>

      {/* Grid */}
      <section className="border-t border-line bg-canvas-warm py-16 md:py-20">
        <div className="shell">
          <p className="eyebrow text-ink-faint">More from the journal</p>

          <Reveal
            stagger={0.07}
            className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {rest.map((post) => (
              <article key={post.slug} className="group/post flex flex-col">
                <div className="relative aspect-4/3 overflow-hidden rounded-card bg-surface-sunk">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover/post:scale-[1.05]"
                  />
                </div>

                <p className="mt-5 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.16em]">
                  <span className="text-brass-ink">{post.category}</span>
                  <time dateTime={post.date} className="text-ink-faint">
                    {formatJournalDate(post.date)}
                  </time>
                </p>

                <h3 className="mt-3 font-display text-xl leading-snug text-ink">
                  {post.title}
                </h3>
                <p className="mt-2.5 text-sm leading-7 text-ink-soft">
                  {post.excerpt}
                </p>

                <p className="mt-4 text-xs text-ink-faint">
                  {post.author} · {post.readMinutes} min read
                </p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Subscribe */}
      <section className="shell py-20 md:py-24">
        <div className="grid gap-10 rounded-panel bg-espresso p-8 text-on-dark md:grid-cols-[1fr_1fr] md:items-center md:p-12">
          <div>
            <Icon name="mail" className="h-7 w-7 text-brass-soft" />
            <h2 className="mt-5 display-md text-on-dark">
              New notes, roughly monthly
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-on-dark-soft">
              Fabric arrivals, care advice, and the occasional look inside a
              commission. No more than one email a month.
            </p>
          </div>
          <NewsletterForm source="journal" onDark />
        </div>
      </section>
    </>
  );
}
