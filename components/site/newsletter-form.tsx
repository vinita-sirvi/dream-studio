"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "footer" }),
    });

    if (!response.ok) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("success");
    setEmail("");
    setMessage("Thank you for subscribing.");
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 flex max-w-md overflow-hidden rounded-md border border-[#d7c6b3] bg-white">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="min-w-0 flex-1 px-4 py-3 text-sm outline-none placeholder:text-[#9a8c80]"
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[#2a1b10] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#3c2818] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Sending" : "Subscribe"}
      </button>
      {message ? (
        <p className="mt-2 text-xs text-[#8a6b56]">{message}</p>
      ) : null}
    </form>
  );
}
