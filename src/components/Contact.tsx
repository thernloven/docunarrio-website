"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  function clearError() {
    if (status === "error") setStatus("idle");
  }

  const inputClass =
    "w-full px-[22px] py-4 text-[15px] font-sans border-[1.5px] border-border/40 rounded-xl bg-white text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-accent focus:shadow-[0_0_0_3px_rgba(112,9,17,0.06)]";

  return (
    <section id="contact" className="py-30 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[560px] mx-auto">
          <div className="text-center mb-12 reveal-up">
            <span className="inline-block text-xs font-bold text-accent uppercase tracking-[0.12em] mb-4">
              Contact
            </span>
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-extrabold leading-[1.15] tracking-[-0.025em] mb-4">
              Get in touch
            </h2>
            <p className="text-[17px] text-text-secondary leading-[1.7]">
              Have a question or want to learn more? Send us a message and
              we&apos;ll get back to you shortly.
            </p>
          </div>

          {status === "sent" ? (
            <div className="text-center reveal-up">
              <div className="flex items-center justify-center gap-2 text-accent mb-2">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-[15px] font-semibold">Message sent!</span>
              </div>
              <p className="text-[13px] text-text-secondary">
                We&apos;ll get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 reveal-up">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    clearError();
                  }}
                  className={inputClass}
                />
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    clearError();
                  }}
                  className={inputClass}
                />
              </div>
              <textarea
                required
                rows={5}
                placeholder="Your message"
                value={form.message}
                onChange={(e) => {
                  setForm({ ...form, message: e.target.value });
                  clearError();
                }}
                className={`${inputClass} resize-none`}
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-white bg-accent rounded-xl shadow-[0_4px_14px_rgba(112,9,17,0.25)] hover:bg-accent-light hover:shadow-[0_6px_24px_rgba(112,9,17,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <Send size={16} strokeWidth={2} />
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
              {status === "error" && (
                <span className="text-[13px] text-red-500 text-center">
                  Something went wrong. Please try again.
                </span>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
