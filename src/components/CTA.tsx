"use client";

import { useState } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !company || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
      setEmail("");
      setCompany("");
    } catch {
      setStatus("error");
    }
  }

  function clearError() {
    if (status === "error") setStatus("idle");
  }

  return (
    <section id="cta" className="py-[140px] bg-dark relative overflow-hidden">
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(112,9,17,0.12)_0%,transparent_60%)] pointer-events-none" />
      <div className="max-w-[1200px] mx-auto px-6 relative">
        <div className="text-center max-w-[560px] mx-auto reveal-up">
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-white mb-4">
            Ready to eliminate the search?
          </h2>
          <p className="text-[17px] text-white/50 leading-[1.7] mb-10">
            See how Docunarrio can transform your team&apos;s access to
            operational knowledge — faster decisions, fewer mistakes, complete
            privacy.
          </p>

          {status === "sent" ? (
            <div className="max-w-[460px] mx-auto">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-[15px] font-semibold">Demo request sent!</span>
              </div>
              <span className="text-[13px] text-white/30">
                Check your inbox — we&apos;ll get back to you shortly.
              </span>
            </div>
          ) : (
            <>
              <form
                className="flex flex-col gap-3 max-w-[460px] mx-auto mb-4"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Company name"
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      clearError();
                    }}
                    className="flex-1 px-[22px] py-4 text-[15px] font-sans border-[1.5px] border-white/12 rounded-xl bg-white/5 text-white outline-none transition-all placeholder:text-white/30 focus:border-accent focus:bg-white/8"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                    className="flex-1 px-[22px] py-4 text-[15px] font-sans border-[1.5px] border-white/12 rounded-xl bg-white/5 text-white outline-none transition-all placeholder:text-white/30 focus:border-accent focus:bg-white/8"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full px-8 py-4 text-[15px] font-semibold text-white bg-accent rounded-xl shadow-[0_4px_14px_rgba(112,9,17,0.25)] hover:bg-accent-light hover:shadow-[0_6px_24px_rgba(112,9,17,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {status === "sending" ? "Sending..." : "Request Demo"}
                </button>
              </form>
              {status === "error" ? (
                <span className="text-[13px] text-red-400">
                  Something went wrong. Please try again.
                </span>
              ) : (
                <span className="text-[13px] text-white/30">
                  We&apos;ll get back to you shortly.
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
