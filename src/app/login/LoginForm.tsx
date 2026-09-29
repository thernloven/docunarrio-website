"use client";

import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Lockup } from "@/components/app/Logo";
import { BrandRail, Button, Checkbox, Field } from "@/components/app/ui";
import { login } from "@/lib/dn/client";

// Figma: Web — App / "Web / Login" and "Web / Login — Error".
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgot, setForgot] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setBusy(true);
    setError(null);
    try {
      await login(email, password, remember);
      router.replace("/app");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-snow">
      <BrandRail>
        <h1 className="font-display text-[32px] leading-10 font-semibold tracking-[-0.015em] max-w-[400px]">
          Answers from your own documents. Private, precise and sourced.
        </h1>
        <p className="mt-7 text-[16px] leading-[26px] text-white/64 max-w-[390px]">
          Ask in plain language. Docunarrio reads your manuals, policies and procedures — and shows the exact page every answer comes from.
        </p>
      </BrandRail>

      <main className="flex-1 flex flex-col px-6 lg:pl-20 lg:pr-14 pt-10 pb-12">
        <div className="flex items-center justify-between lg:justify-end gap-1.5 text-[14px]">
          <Link href="/" className="lg:hidden"><Lockup height={20} className="text-ink" /></Link>
          <p>
            <span className="text-stone">New to Docunarrio? </span>
            <a href="/admin" className="font-medium text-ink hover:underline">Set up your company</a>
          </p>
        </div>

        <div className="flex-1 flex items-center">
          <form onSubmit={submit} className="w-full max-w-[480px] mx-auto lg:mx-0 space-y-7" noValidate>
            <div className="space-y-2.5">
              <h2 className="font-display text-[32px] leading-10 font-semibold tracking-[-0.015em] text-ink">Welcome back</h2>
              <p className="text-[16px] leading-[26px] text-stone">Sign in to your company’s workspace with the email you were invited with.</p>
            </div>

            <div className="space-y-4">
              <Field label="Work email" type="email" autoComplete="username" placeholder="name@company.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} autoFocus />
              <Field label="Password" reveal autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} error={error} />
            </div>

            <div className="flex items-center justify-between">
              <Checkbox checked={remember} onChange={setRemember} label="Keep me signed in" />
              <button type="button" onClick={() => setForgot(!forgot)} className="text-[14px] font-medium text-slate hover:text-ink">Forgot password?</button>
            </div>
            {forgot && (
              <p className="-mt-3 text-[13px] leading-5 text-ink-700 bg-sand-tint rounded-[10px] px-3.5 py-3">
                Your company admin can reset it for you — they manage the accounts in your workspace.
              </p>
            )}

            <Button type="submit" full busy={busy} disabled={!email || !password}>Sign in</Button>

            <div className="flex items-center gap-2.5 rounded-[10px] bg-sand-tint px-3.5 py-3 text-[14px] text-ink-700">
              <Lock className="size-[18px] text-slate shrink-0" strokeWidth={1.5} />
              No account? Ask your company admin for an invite.
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
