"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrderForm({
  mode,
  orderId,
  initialValues,
}: {
  mode: "create" | "edit";
  orderId?: string;
  initialValues?: {
    customerName?: string;
    email?: string;
    phone?: string;
    status?: string;
    notes?: string;
    shippingMethod?: string;
    paymentMethod?: string;
    itemsJson?: string;
  };
}) {
  const router = useRouter();
  const [statusState, setStatusState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    customerName: initialValues?.customerName ?? "",
    email: initialValues?.email ?? "",
    phone: initialValues?.phone ?? "",
    status: initialValues?.status ?? "pending",
    notes: initialValues?.notes ?? "",
    shippingMethod: initialValues?.shippingMethod ?? "",
    paymentMethod: initialValues?.paymentMethod ?? "",
    itemsJson: initialValues?.itemsJson ?? "[]",
  });

  function updateField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusState("loading");
    setMessage("");

    let items = [];
    try {
      items = JSON.parse(form.itemsJson);
    } catch {
      setStatusState("error");
      setMessage("Items JSON is invalid.");
      return;
    }

    const payload = {
      customerName: form.customerName,
      email: form.email,
      phone: form.phone,
      status: form.status,
      notes: form.notes,
      shippingMethod: form.shippingMethod,
      paymentMethod: form.paymentMethod,
      items,
      totals: { subtotal: 0, shipping: 0, discount: 0, tax: 0, grandTotal: 0 },
      termsAccepted: true,
      giftWrap: false,
    };

    const response = await fetch(mode === "create" ? "/api/orders" : `/api/admin/orders/${orderId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setStatusState("error");
      setMessage(data?.message ?? "Unable to save order.");
      return;
    }

    router.push("/admin/orders");
    router.refresh();
  }

  const inputClass =
    "rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none";

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input className={inputClass} placeholder="Customer name" value={form.customerName} onChange={(e) => updateField("customerName", e.target.value)} required />
        <input className={inputClass} placeholder="Email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input className={inputClass} placeholder="Phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} required />
        <select className={inputClass} value={form.status} onChange={(e) => updateField("status", e.target.value)}>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="stitching">Stitching</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
          <option value="returned">Returned</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input className={inputClass} placeholder="Shipping method" value={form.shippingMethod} onChange={(e) => updateField("shippingMethod", e.target.value)} />
        <input className={inputClass} placeholder="Payment method" value={form.paymentMethod} onChange={(e) => updateField("paymentMethod", e.target.value)} />
      </div>
      <textarea className={inputClass} placeholder="Notes" rows={4} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} />
      <textarea className={inputClass} placeholder="Items JSON" rows={6} value={form.itemsJson} onChange={(e) => updateField("itemsJson", e.target.value)} />
      <button type="submit" disabled={statusState === "loading"} className="w-fit rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521] disabled:cursor-not-allowed disabled:opacity-70">
        {mode === "create" ? "Create Order" : "Update Order"}
      </button>
      {message ? <p className="text-sm text-[#8a6b56]">{message}</p> : null}
    </form>
  );
}
