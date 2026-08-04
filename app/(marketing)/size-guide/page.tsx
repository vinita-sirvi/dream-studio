import type { Metadata } from "next";

import { IMAGES } from "@/data/home";
import {
  fitNotes,
  garmentLengths,
  howToMeasure,
  sizeChart,
} from "@/data/size-guide";
import { PageHero } from "@/components/site/page-hero";
import { Icon } from "@/components/site/icons";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Size Guide",
  description:
    "Body measurement charts, standard garment lengths, and how to take all twelve measurements correctly at home.",
};

/**
 * Public size guide.
 *
 * Added as a marketing route because the "Size Guide" navigation link previously
 * pointed at /saved-measurements, which lives in the (customer) group and
 * redirects anonymous visitors to /login — so the guide was unreachable to the
 * people who most needed it. /saved-measurements remains the signed-in page for
 * storing personal measurement profiles; its auth behaviour is unchanged.
 */
export default function SizeGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Fit"
        title="How to measure, and what the numbers mean"
        description="Standard charts below, plus the twelve measurements a tailor takes. Get these right once and every order after is straightforward."
        image={IMAGES.blouse}
        crumbs={[{ label: "Size Guide" }]}
      />

      {/* Charts */}
      <section className="shell py-16 md:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Chart"
              title="Standard sizes"
              description="All values are body measurements in inches, not finished garment measurements — we add the appropriate ease for each cut."
              size="md"
            />

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[30rem] border-collapse text-sm">
                <caption className="sr-only">
                  Body measurements by size, in inches
                </caption>
                <thead>
                  <tr className="border-b border-line-strong text-left">
                    <th scope="col" className="py-3.5 pr-4 font-medium text-ink">
                      Size
                    </th>
                    <th scope="col" className="py-3.5 pr-4 font-medium text-ink">
                      Bust
                    </th>
                    <th scope="col" className="py-3.5 pr-4 font-medium text-ink">
                      Waist
                    </th>
                    <th scope="col" className="py-3.5 pr-4 font-medium text-ink">
                      Hip
                    </th>
                    <th scope="col" className="py-3.5 font-medium text-ink">
                      Shoulder
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row) => (
                    <tr
                      key={row.size}
                      className="border-b border-line transition-colors hover:bg-canvas-warm"
                    >
                      <th
                        scope="row"
                        className="py-3.5 pr-4 text-left font-medium text-ink"
                      >
                        {row.size}
                      </th>
                      <td className="py-3.5 pr-4 tabular-nums text-ink-soft">
                        {row.bust}
                      </td>
                      <td className="py-3.5 pr-4 tabular-nums text-ink-soft">
                        {row.waist}
                      </td>
                      <td className="py-3.5 pr-4 tabular-nums text-ink-soft">
                        {row.hip}
                      </td>
                      <td className="py-3.5 tabular-nums text-ink-soft">
                        {row.shoulder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="mt-9 grid gap-3">
              {fitNotes.map((note) => (
                <li
                  key={note}
                  className="flex gap-3 text-sm leading-7 text-ink-soft"
                >
                  <Icon
                    name="check"
                    className="mt-1 h-4 w-4 shrink-0 text-brass"
                  />
                  {note}
                </li>
              ))}
            </ul>
          </div>

          {/* Lengths */}
          <div>
            <SectionHeading
              eyebrow="Reference"
              title="Typical lengths"
              size="md"
            />
            <dl className="mt-8 grid gap-px bg-line">
              {garmentLengths.map((item) => (
                <div
                  key={item.garment}
                  className="flex items-baseline justify-between gap-4 bg-canvas py-3.5"
                >
                  <dt className="text-sm text-ink">{item.garment}</dt>
                  <dd className="text-sm tabular-nums text-ink-soft">
                    {item.length}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 rounded-card border border-line bg-canvas-warm p-6">
              <Icon name="ruler" className="h-6 w-6 text-brass" />
              <p className="mt-4 text-sm leading-7 text-ink-soft">
                Lengths are measured from the shoulder tip straight down. The
                easiest way to choose is to measure a garment you already like
                the length of.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to measure */}
      <section className="border-y border-line bg-canvas-warm py-16 md:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Method"
            title="The twelve measurements"
            accent="In the order a tailor takes them"
            description="Use a soft tailoring tape, snug but never tight, over the underwear you would normally wear with the garment."
          />

          <Reveal
            stagger={0.05}
            className="mt-12 grid gap-px bg-line md:grid-cols-2"
          >
            {howToMeasure.map((item, index) => (
              <div key={item.name} className="bg-canvas p-7">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-sm text-brass">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg text-ink">{item.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-ink-soft">
                  {item.where}
                </p>
                <p className="mt-2.5 flex gap-2.5 text-xs leading-6 text-brass-ink">
                  <Icon
                    name="sparkle"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  />
                  {item.tip}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="shell py-16 md:py-20">
        <div className="grid gap-8 rounded-panel bg-espresso p-8 text-on-dark md:grid-cols-[1.3fr_1fr] md:items-center md:p-12">
          <div>
            <h2 className="display-md text-on-dark">
              Rather have someone check them for you?
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-on-dark-soft">
              Book a twenty-minute video call and a tailor will guide you through
              all twelve, verifying each one on camera. It costs nothing and it
              removes all the guesswork.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <ButtonLink href="/contact" variant="onDark">
              Book a fitting call
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="/saved-measurements"
              variant="ghost"
              className="border-on-dark-soft/40 text-on-dark hover:border-on-dark hover:bg-on-dark/10"
            >
              Save my measurements
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
