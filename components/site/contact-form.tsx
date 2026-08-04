"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FormStatus, Input, Textarea } from "@/components/ui/field";

import { Icon } from "./icons";

const initialState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

/**
 * Contact form. Posts to the existing /api/contact route — request shape and
 * success/error handling are unchanged from the original implementation.
 *
 * Adds: real <label> elements (previously placeholder-only, which is invisible
 * to screen readers), an aria-live status region, and prefill of `subject` from
 * the query string so "Ask about fabric or fit" on a product page arrives with
 * context.
 */
export function ContactForm() {
  const params = useSearchParams();
  const [form, setForm] = useState({
    ...initialState,
    subject: params.get("subject") ?? "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");

  function updateField(field: keyof typeof initialState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
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
      setFeedback("Thank you — we'll come back to you within one working day.");
    } catch {
      setStatus("error");
      setFeedback("Could not send just now. Please email us directly.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-9 grid gap-5 rounded-panel border border-line bg-surface p-7 shadow-soft md:p-9"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Your name" htmlFor="contact-name" required>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </Field>

        <Field label="Email address" htmlFor="contact-email" required>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Phone"
          htmlFor="contact-phone"
          hint="Optional — useful if you would rather we called."
        >
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </Field>

        <Field label="Subject" htmlFor="contact-subject" required>
          <Input
            id="contact-subject"
            name="subject"
            value={form.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            required
          />
        </Field>
      </div>

      <Field
        label="Message"
        htmlFor="contact-message"
        hint="The more detail the better — fabric, occasion, timeline."
        required
      >
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          required
        />
      </Field>

      <div className="flex flex-wrap items-center gap-5">
        <Button type="submit" disabled={status === "loading"} size="lg">
          {status === "loading" ? "Sending…" : "Send message"}
          <Icon name="arrow-right" className="h-4 w-4" />
        </Button>
        <FormStatus status={status} message={feedback} />
      </div>
    </form>
  );
}
