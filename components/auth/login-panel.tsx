"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Mode = "password" | "otp";

export function LoginPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedNext = searchParams.get("next");
  const nextPath = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/account";
  const [mode, setMode] = useState<Mode>("password");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({ email: "", password: "" });
  const [otpEmail, setOtpEmail] = useState("");

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(data?.message ?? "Invalid email or password.");
      return;
    }

    const role = data?.data?.role;
    setStatus("success");
    router.push(role === "admin" || role === "super_admin" ? "/admin" : nextPath);
    router.refresh();
  }

  async function submitOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: otpEmail }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(data?.message ?? "Could not send OTP.");
      return;
    }

    setStatus("success");
    router.push(`/verify-otp?email=${encodeURIComponent(otpEmail)}&next=${encodeURIComponent(nextPath)}`);
  }

  return (
    <div className="rounded-[2rem] border border-[#eadccc] bg-white/85 p-6 shadow-[0_18px_42px_rgba(103,73,47,0.08)] md:p-8">
      <div className="flex rounded-full border border-[#eadccc] bg-[#faf3ea] p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 rounded-full px-4 py-2 transition ${
            mode === "password" ? "bg-[#3b2417] text-white" : "text-[#5f4f43]"
          }`}
        >
          Password Login
        </button>
        <button
          type="button"
          onClick={() => setMode("otp")}
          className={`flex-1 rounded-full px-4 py-2 transition ${
            mode === "otp" ? "bg-[#3b2417] text-white" : "text-[#5f4f43]"
          }`}
        >
          OTP Login
        </button>
      </div>

      {mode === "password" ? (
        <form onSubmit={submitPassword} className="mt-6 grid gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={passwordForm.email}
            onChange={(event) =>
              setPasswordForm((current) => ({ ...current, email: event.target.value }))
            }
            className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={passwordForm.password}
            onChange={(event) =>
              setPasswordForm((current) => ({ ...current, password: event.target.value }))
            }
            className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Signing In" : "Sign In"}
          </button>
        </form>
      ) : (
        <form onSubmit={submitOtp} className="mt-6 grid gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={otpEmail}
            onChange={(event) => setOtpEmail(event.target.value)}
            className="rounded-xl border border-[#d8c5b0] bg-[#fcf8f2] px-4 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Sending OTP" : "Send OTP"}
          </button>
        </form>
      )}

      {message ? <p className="mt-4 text-sm text-[#8a6b56]">{message}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#5f4f43]">
        <Link href="/register" className="transition hover:text-[#3b2417]">
          Create account
        </Link>
        <span>•</span>
        <Link href="/verify-otp" className="transition hover:text-[#3b2417]">
          Verify OTP
        </Link>
      </div>
    </div>
  );
}
