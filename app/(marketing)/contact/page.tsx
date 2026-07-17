import { ContactForm } from "@/components/site/contact-form";

export default function ContactPage() {
  return (
    <section className="mx-auto grid min-h-[72vh] w-full max-w-[1440px] gap-8 px-4 py-16 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
      <div className="rounded-[2rem] border border-[#eadccc] bg-white/80 p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">
          Contact
        </p>
        <h1
          className="mt-4 text-4xl font-medium text-[#2f2319] md:text-6xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Let’s talk about your next outfit.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4f43]">
          Reach out for support, fitting questions, custom stitching, and order
          updates. Our team is available during the working hours below.
        </p>

        <div className="mt-8 grid gap-4 text-sm text-[#49382d]">
          <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-5 py-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#8a6b56]">
              WhatsApp
            </div>
            <div className="mt-1 font-medium">+91 98765 43210</div>
          </div>
          <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-5 py-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#8a6b56]">
              Email
            </div>
            <div className="mt-1 font-medium">support@divyaanddesign.com</div>
          </div>
          <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-5 py-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#8a6b56]">
              Hours
            </div>
            <div className="mt-1 font-medium">Mon - Sat | 10 AM - 7 PM</div>
          </div>
        </div>
      </div>

      <ContactForm />
    </section>
  );
}
