"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterPanel() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(data?.message ?? "Could not create account.");
      return;
    }

    setStatus("success");
    router.push("/account");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-[2rem] border border-[#eadccc] bg-white/85 p-6 shadow-[0_18px_42px_rgba(103,73,47,0.08)] md:p-8">
      <input
        type="text"
        required
        placeholder="Name"
        value={form.name}
        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
      />
      <input
        type="email"
        required
        placeholder="Email"
        value={form.email}
        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
      />
      <input
        type="password"
        required
        placeholder="Password"
        value={form.password}
        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Creating" : "Create Account"}
      </button>
      {message ? <p className="text-sm text-[#8a6b56]">{message}</p> : null}
    </form>
  );
}
