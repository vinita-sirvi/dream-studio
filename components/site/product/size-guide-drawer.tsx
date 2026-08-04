"use client";

import { useState } from "react";

import { fitNotes, sizeChart } from "@/data/size-guide";
import { Drawer } from "@/components/ui/overlay";

import { Icon } from "../icons";

/**
 * Size-guide trigger + drawer, for use next to the purchase controls.
 *
 * Shows the summary chart only; the full how-to-measure walkthrough lives on the
 * dedicated size guide page, linked at the bottom.
 */
export function SizeGuideDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/sg inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-brass-ink transition-opacity hover:opacity-70"
      >
        <Icon name="ruler" className="h-4 w-4" />
        Size guide
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Size guide"
        description="All values are body measurements in inches."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[22rem] border-collapse text-sm">
            <caption className="sr-only">
              Body measurements by size, in inches
            </caption>
            <thead>
              <tr className="border-b border-line-strong text-left">
                <th scope="col" className="py-3 pr-3 font-medium text-ink">
                  Size
                </th>
                <th scope="col" className="py-3 pr-3 font-medium text-ink">
                  Bust
                </th>
                <th scope="col" className="py-3 pr-3 font-medium text-ink">
                  Waist
                </th>
                <th scope="col" className="py-3 pr-3 font-medium text-ink">
                  Hip
                </th>
                <th scope="col" className="py-3 font-medium text-ink">
                  Shoulder
                </th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row) => (
                <tr key={row.size} className="border-b border-line">
                  <th
                    scope="row"
                    className="py-3 pr-3 text-left font-medium text-ink"
                  >
                    {row.size}
                  </th>
                  <td className="py-3 pr-3 tabular-nums text-ink-soft">
                    {row.bust}
                  </td>
                  <td className="py-3 pr-3 tabular-nums text-ink-soft">
                    {row.waist}
                  </td>
                  <td className="py-3 pr-3 tabular-nums text-ink-soft">
                    {row.hip}
                  </td>
                  <td className="py-3 tabular-nums text-ink-soft">
                    {row.shoulder}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-8 grid gap-3">
          {fitNotes.map((note) => (
            <li key={note} className="flex gap-3 text-sm leading-6 text-ink-soft">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
              {note}
            </li>
          ))}
        </ul>

        <a
          href="/size-guide"
          className="mt-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-brass-ink"
        >
          Full measuring guide
          <Icon name="arrow-right" className="h-4 w-4" />
        </a>
      </Drawer>
    </>
  );
}
