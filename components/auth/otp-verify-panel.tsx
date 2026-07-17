"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function OtpVerifyPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") ?? "";
  const nextPath = searchParams.get("next") ?? "/account";
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(data?.message ?? "Invalid OTP code.");
      return;
    }

    setStatus("success");
    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-[2rem] border border-[#eadccc] bg-white/85 p-6 shadow-[0_18px_42px_rgba(103,73,47,0.08)] md:p-8">
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
      />
      <input
        type="text"
        required
        maxLength={6}
        placeholder="6-digit OTP"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Verifying" : "Verify OTP"}
      </button>
      {message ? <p className="text-sm text-[#8a6b56]">{message}</p> : null}
    </form>
  );
}
