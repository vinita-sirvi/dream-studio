"use client";

import { useState } from "react";

const initialState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");

  function updateField(field: keyof typeof initialState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setStatus("error");
      setFeedback("Please check the highlighted details and try again.");
      return;
    }

    setStatus("success");
    setForm(initialState);
    setFeedback("Thanks. We’ll get back to you soon.");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-[1.6rem] border border-[#eadccc] bg-white/90 p-6 shadow-[0_18px_38px_rgba(103,73,47,0.08)]">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Your name"
          className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          required
        />
        <input
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          type="email"
          placeholder="Email address"
          className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="Phone number"
          className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
        />
        <input
          value={form.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          placeholder="Subject"
          className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          required
        />
      </div>
      <textarea
        value={form.message}
        onChange={(event) => updateField("message", event.target.value)}
        placeholder="Tell us what you need..."
        rows={6}
        className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-fit items-center rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Sending" : "Send Message"}
      </button>
      {feedback ? <p className="text-sm text-[#8a6b56]">{feedback}</p> : null}
    </form>
  );
}
