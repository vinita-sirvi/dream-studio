import { CustomOrderForm } from "@/components/site/custom-order-form";

export default function CustomOrderPage() {
  return (
    <section className="mx-auto grid min-h-[72vh] w-full max-w-[1440px] gap-8 px-4 py-16 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
      <div className="rounded-[2rem] border border-[#eadccc] bg-white/80 p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">
          Custom Order
        </p>
        <h1
          className="mt-4 text-4xl font-medium text-[#2f2319] md:text-6xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Tailored from your brief, stitched for your measurements.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4f43]">
          Submit your inspiration, fabric preferences, budget, and notes. We’ll
          use this to start the quotation and stitching workflow.
        </p>

        <div className="mt-8 grid gap-4 text-sm text-[#49382d]">
          <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-5 py-4">
            Upload inspiration images and reference notes
          </div>
          <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-5 py-4">
            Capture measurements for repeat use
          </div>
          <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-5 py-4">
            Ready for quotation, approval, and production stages
          </div>
        </div>
      </div>

      <CustomOrderForm />
    </section>
  );
}
