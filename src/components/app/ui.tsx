"use client";

import { Check, ChevronDown, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { Lockup } from "./Logo";
import Link from "next/link";

// Figma Foundations: Button (Primary / Secondary / Ghost × Large / Medium /
// Small), Input (Default / Focused / Error), Status Badge.

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: "primary" | "secondary" | "ghost" | "danger";
  size?: "lg" | "md" | "sm";
  busy?: boolean;
  full?: boolean;
};

export function Button({ kind = "primary", size = "lg", busy, full, className = "", children, disabled, ...rest }: ButtonProps) {
  const sizes = { lg: "h-12 px-[22px] rounded-xl text-[14px]", md: "h-10 px-[18px] rounded-[10px] text-[14px]", sm: "h-8 px-3 rounded-lg text-[13px]" };
  const kinds = {
    primary: "bg-ink text-white hover:bg-[#2c2c2b]",
    secondary: "bg-white text-ink border border-mist hover:bg-snow",
    ghost: "text-ink hover:bg-sand-tint",
    danger: "bg-white text-danger border border-danger/30 hover:bg-burgundy-soft",
  };
  return (
    <button
      {...rest}
      disabled={disabled || busy}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${sizes[size]} ${kinds[kind]} ${full ? "w-full" : ""} ${className}`}
    >
      {busy && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string | null;
  dropdown?: boolean;
  reveal?: boolean;
};

export function Field({ label, hint, error, dropdown, reveal, className = "", type, ...rest }: FieldProps) {
  const [shown, setShown] = useState(false);
  const inputType = reveal ? (shown ? "text" : "password") : type;
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-[13px] leading-[18px] font-medium text-ink mb-1.5">{label}</span>}
      <span
        className={`flex items-center gap-2.5 h-11 px-3.5 rounded-[10px] bg-white border transition-shadow focus-within:border-ink focus-within:border-[1.5px] focus-within:shadow-[0_0_0_4px_rgba(30,30,30,0.08)] ${error ? "border-danger border-[1.5px]" : "border-mist"}`}
      >
        <input {...rest} type={inputType} className="flex-1 min-w-0 bg-transparent outline-none text-[14px] text-ink placeholder:text-stone" />
        {dropdown && <ChevronDown className="size-[18px] text-stone shrink-0" />}
        {reveal && (
          <button type="button" onClick={() => setShown(!shown)} className="text-stone hover:text-ink" aria-label={shown ? "Hide password" : "Show password"}>
            {shown ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        )}
      </span>
      {(error || hint) && <span className={`block mt-1.5 text-[12px] leading-4 ${error ? "text-danger" : "text-stone"}`}>{error || hint}</span>}
    </label>
  );
}

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="inline-flex items-center gap-2 text-[14px] text-ink-700">
      <span className={`size-[18px] rounded-[5px] grid place-items-center border ${checked ? "bg-ink border-ink" : "bg-white border-mist"}`}>
        {checked && <Check className="size-3.5 text-white" strokeWidth={2.5} />}
      </span>
      {label}
    </button>
  );
}

export type BadgeState = "completed" | "processing" | "queued" | "error";

export function StatusBadge({ state, children }: { state: BadgeState; children: ReactNode }) {
  const tone = {
    completed: "bg-success-soft text-success",
    processing: "bg-warn-soft text-warn",
    queued: "bg-sand-tint text-stone",
    error: "bg-burgundy-soft text-danger",
  }[state];
  return (
    <span className={`inline-flex items-center gap-1.5 h-[22px] pl-2 pr-2.5 rounded-full text-[12px] whitespace-nowrap ${tone}`}>
      <span className={`size-1.5 rounded-full bg-current ${state === "processing" ? "dn-pulse" : ""}`} />
      {children}
    </span>
  );
}

export function Progress({ value, tone = "ink" }: { value: number; tone?: "ink" | "success" }) {
  return (
    <div className="h-1 rounded-full bg-sand-tint overflow-hidden">
      <div className={`h-full rounded-full transition-[width] duration-500 ${tone === "success" ? "bg-success" : "bg-ink"}`} style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
  );
}

/** The dark left rail shared by sign-in and onboarding (Figma "Brand rail"). */
export function BrandRail({ children }: { children: ReactNode }) {
  return (
    <aside className="relative hidden lg:flex w-[520px] shrink-0 flex-col justify-between bg-ink text-white px-14 py-12 overflow-hidden">
      <Link href="/" className="relative z-10 w-fit"><Lockup height={22} className="text-white" /></Link>
      <svg className="absolute left-[220px] top-[400px] overflow-visible pointer-events-none" width="520" height="520" aria-hidden>
        {[180, 260, 340, 420].map((r, i) => (
          <circle key={r} cx="260" cy="260" r={r} fill="none" stroke="white" strokeOpacity={0.05 + 0.02 * (3 - i)} />
        ))}
        <circle cx={260 - 180 * 0.707} cy={260 - 180 * 0.707} r="4" fill="#700911" />
        <circle cx={260 - 340 * 0.94} cy={260 - 340 * 0.34} r="2.5" fill="white" fillOpacity="0.5" />
      </svg>
      <div className="relative z-10">{children}</div>
      <div className="relative z-10 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
        <ShieldCheck className="size-5 shrink-0" strokeWidth={1.5} />
        <div>
          <p className="text-[13px] font-medium leading-[18px]">Private by design</p>
          <p className="text-[12px] leading-4 text-white/60">Your documents stay in your own tenant. Hosted in the EU.</p>
        </div>
      </div>
    </aside>
  );
}
