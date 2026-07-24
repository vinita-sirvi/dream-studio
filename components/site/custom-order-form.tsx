"use client";

import { useState } from "react";

import { CloudinaryUploadField } from "@/components/admin/cloudinary-upload-field";

const initialState = {
  name: "",
  email: "",
  phone: "",
  productType: "",
  budget: "",
  occasion: "",
  deliveryDate: "",
  fabricPreference: "",
  colorPreference: "",
  embroideryPreference: "",
  referenceNotes: "",
  inspirationImage: "",
  specialInstructions: "",
  measurements: "",
};

export function CustomOrderForm() {
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

    const measurements = form.measurements
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .reduce<Record<string, string>>((accumulator, entry) => {
        const [label, value] = entry.split(":");
        if (label && value) {
          accumulator[label.trim()] = value.trim();
        }
        return accumulator;
      }, {});

    const response = await fetch("/api/custom-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        inspirationImages: form.inspirationImage ? [form.inspirationImage] : [],
        measurements,
      }),
    });

    if (!response.ok) {
      setStatus("error");
      setFeedback("Please check the details and try again.");
      return;
    }

    setStatus("success");
    setForm(initialState);
    setFeedback("Your custom order request has been submitted.");
  }

  const inputClass =
    "rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-[1.6rem] border border-[#eadccc] bg-white/90 p-6 shadow-[0_18px_38px_rgba(103,73,47,0.08)]">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Your name"
          className={inputClass}
          required
        />
        <input
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          type="email"
          placeholder="Email address"
          className={inputClass}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="Phone number"
          className={inputClass}
          required
        />
        <input
          value={form.productType}
          onChange={(event) => updateField("productType", event.target.value)}
          placeholder="Product type"
          className={inputClass}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <input
          value={form.budget}
          onChange={(event) => updateField("budget", event.target.value)}
          placeholder="Budget"
          className={inputClass}
        />
        <input
          value={form.occasion}
          onChange={(event) => updateField("occasion", event.target.value)}
          placeholder="Occasion"
          className={inputClass}
        />
        <input
          type="date"
          value={form.deliveryDate}
          onChange={(event) => updateField("deliveryDate", event.target.value)}
          min={new Date().toISOString().slice(0, 10)}
          aria-label="Preferred delivery date"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={form.fabricPreference}
          onChange={(event) => updateField("fabricPreference", event.target.value)}
          placeholder="Fabric preference"
          className={inputClass}
        />
        <input
          value={form.colorPreference}
          onChange={(event) => updateField("colorPreference", event.target.value)}
          placeholder="Color preference"
          className={inputClass}
        />
      </div>

      <input
        value={form.embroideryPreference}
        onChange={(event) => updateField("embroideryPreference", event.target.value)}
        placeholder="Embroidery preference"
        className={inputClass}
      />
      <textarea
        value={form.referenceNotes}
        onChange={(event) => updateField("referenceNotes", event.target.value)}
        rows={4}
        placeholder="Reference notes"
        className={inputClass}
      />
      <textarea
        value={form.measurements}
        onChange={(event) => updateField("measurements", event.target.value)}
        rows={3}
        placeholder="Measurements, e.g. bust: 36, waist: 30, hip: 40"
        className={inputClass}
      />
      <CloudinaryUploadField
        label="Inspiration image"
        value={form.inspirationImage}
        onChange={(next) => updateField("inspirationImage", next)}
        folder="custom-orders"
        accept="image/*"
        helperText="Upload an inspiration image or mood board reference."
      />
      <textarea
        value={form.specialInstructions}
        onChange={(event) => updateField("specialInstructions", event.target.value)}
        rows={4}
        placeholder="Special instructions"
        className={inputClass}
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-fit items-center rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Submitting" : "Submit Request"}
      </button>
      {feedback ? <p className="text-sm text-[#8a6b56]">{feedback}</p> : null}
    </form>
  );
}
