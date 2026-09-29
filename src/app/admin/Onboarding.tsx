"use client";

import { ArrowRight, BookOpen, Building2, Check, FileText, Plus, Server, Upload, Users, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Lockup } from "@/components/app/Logo";
import { BrandRail, Button, Field, Progress, StatusBadge } from "@/components/app/ui";

// Company onboarding, as designed in Figma (Web — Onboarding, steps 1–6).
// A walkthrough only: the API has no sign-up, company or invite endpoints
// yet, so nothing entered here is sent or stored anywhere.

const STEPS = ["Your account", "Company", "Workspace size", "First library", "Invite your team"];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    first: "", last: "", email: "", password: "",
    company: "", orgNr: "", country: "Sweden", street: "", zip: "", city: "", industry: "",
    team: "11–50", plan: "Professional", pages: "", region: "EU North — Stockholm",
    library: "", invites: [{ email: "", role: "Admin" }, { email: "", role: "Member" }],
  });
  const set = (patch: Partial<typeof data>) => setData((d) => ({ ...d, ...patch }));
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));
  useEffect(() => window.scrollTo({ top: 0 }), [step]);

  return (
    <div className="flex min-h-screen bg-snow">
      <BrandRail>
        {step < STEPS.length ? (
          <div className="space-y-7">
            <h2 className="font-display text-[24px] leading-8 font-semibold">Set up your workspace</h2>
            <ol className="space-y-1">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-3.5 py-2.5">
                  <span className={`size-7 rounded-full grid place-items-center text-[13px] font-medium ${i < step ? "bg-white/12" : i === step ? "bg-white text-ink" : "border border-white/24 text-white/50"}`}>
                    {i < step ? <Check className="size-4" /> : i + 1}
                  </span>
                  <span className={`text-[14px] ${i === step ? "font-medium" : i < step ? "text-white/72" : "text-white/45"}`}>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="space-y-7">
            <h2 className="font-display text-[32px] leading-10 font-semibold max-w-[400px]">Your workspace is live.</h2>
            <p className="text-[16px] leading-[26px] text-white/64 max-w-[390px]">Documents keep indexing in the background. Your team can start asking questions as soon as the first one is ready.</p>
          </div>
        )}
      </BrandRail>

      <main className="flex-1 flex flex-col px-6 lg:pl-20 lg:pr-14 pt-10 pb-12">
        <div className="flex items-center justify-between lg:justify-end gap-1.5 text-[14px]">
          <Link href="/" className="lg:hidden"><Lockup height={20} className="text-ink" /></Link>
          <p><span className="text-stone">Already have a workspace? </span><a href="/login" className="font-medium text-ink hover:underline">Sign in</a></p>
        </div>
        <div className="flex-1 flex items-center py-10">
          <div className="w-full max-w-[600px] mx-auto lg:mx-0">
            {step === 0 && (
              <Step over="Step 1 of 5" title="Create your admin account" sub="You’ll own the workspace. You can add more admins later." onNext={next}>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" value={data.first} onChange={(e) => set({ first: e.target.value })} placeholder="Anna" />
                  <Field label="Last name" value={data.last} onChange={(e) => set({ last: e.target.value })} placeholder="Lind" />
                </div>
                <Field label="Work email" type="email" value={data.email} onChange={(e) => set({ email: e.target.value })} placeholder="name@company.com" />
                <Field label="Password" reveal value={data.password} onChange={(e) => set({ password: e.target.value })} hint="At least 12 characters, with a number and a symbol." />
                <PasswordMeter value={data.password} />
                <p className="text-[12px] leading-4 text-stone">By continuing you agree to the Terms of Service and the Data Processing Agreement.</p>
              </Step>
            )}
            {step === 1 && (
              <Step over="Step 2 of 5" title="Tell us about your company" sub="Used for your workspace, invoices and the data processing agreement." onBack={back} onNext={next}>
                <Field label="Company name" value={data.company} onChange={(e) => set({ company: e.target.value })} placeholder="Nordic Air AB" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Organisation number" value={data.orgNr} onChange={(e) => set({ orgNr: e.target.value })} placeholder="556123-4567" />
                  <Field label="Country" value={data.country} onChange={(e) => set({ country: e.target.value })} dropdown />
                </div>
                <Field label="Street address" value={data.street} onChange={(e) => set({ street: e.target.value })} placeholder="Flygvägen 12" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Postal code" value={data.zip} onChange={(e) => set({ zip: e.target.value })} placeholder="190 45" />
                  <Field label="City" value={data.city} onChange={(e) => set({ city: e.target.value })} placeholder="Stockholm" />
                </div>
                <Field label="Industry" value={data.industry} onChange={(e) => set({ industry: e.target.value })} placeholder="Aviation — airline operations" dropdown />
              </Step>
            )}
            {step === 2 && (
              <Step over="Step 3 of 5" title="How big is your workspace?" sub="We size your server for the people and pages you expect. You can scale up any time." onBack={back} onNext={next}>
                <div className="space-y-2">
                  <p className="text-[13px] font-medium">Team size</p>
                  <div className="flex gap-1 p-1 rounded-xl bg-sand-tint">
                    {["1–10", "11–50", "51–200", "200+"].map((t) => (
                      <button key={t} onClick={() => set({ team: t })} className={`flex-1 py-2 rounded-[9px] text-[14px] ${data.team === t ? "bg-white font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]" : "text-stone"}`}>{t} people</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2.5">
                  <p className="text-[13px] font-medium">Server size</p>
                  {[
                    ["Standard", "Shared EU cloud", "Up to 25 users · 10,000 pages", Server],
                    ["Professional", "Dedicated server · 1× GPU", "Up to 150 users · 100,000 pages", Server],
                    ["Enterprise", "Private cloud or on-premises", "Unlimited users · custom hardware · SLA", Building2],
                  ].map(([name, host, cap, Icon]) => {
                    const sel = data.plan === name;
                    const I = Icon as typeof Server;
                    return (
                      <button key={name as string} onClick={() => set({ plan: name as string })} className={`w-full flex items-center gap-4 px-[18px] py-4 rounded-[14px] bg-white text-left ${sel ? "border-[1.5px] border-ink" : "border border-sand hover:border-mist"}`}>
                        <span className={`size-10 rounded-[10px] grid place-items-center ${sel ? "bg-ink text-white" : "bg-sand-tint text-slate"}`}><I className="size-5" strokeWidth={1.5} /></span>
                        <span className="flex-1">
                          <span className="flex items-center gap-2 text-[14px] font-medium">{name as string}{name === "Professional" && <span className="px-2 py-0.5 rounded-full bg-sand-tint text-[12px] font-normal text-slate">Recommended</span>}</span>
                          <span className="block text-[12px] text-stone mt-0.5">{host as string} · {cap as string}</span>
                        </span>
                        <span className={`size-5 rounded-full ${sel ? "border-[6px] border-ink" : "border-[1.5px] border-mist"}`} />
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Estimated pages to index" value={data.pages} onChange={(e) => set({ pages: e.target.value })} placeholder="About 40,000" />
                  <Field label="Hosting region" value={data.region} onChange={(e) => set({ region: e.target.value })} dropdown />
                </div>
              </Step>
            )}
            {step === 3 && <LibraryStep name={data.library} onName={(library) => set({ library })} onBack={back} onNext={next} />}
            {step === 4 && (
              <Step over="Step 5 of 5" title="Invite your team" sub="They’ll get an email to set a password and sign in. Everyone sees only your company’s libraries." onBack={back} onNext={next} nextLabel={`Send ${data.invites.filter((i) => i.email).length || ""} invite${data.invites.filter((i) => i.email).length === 1 ? "" : "s"}`.replace("  ", " ")}>
                <div className="space-y-2.5">
                  <div className="grid grid-cols-[1fr_170px_32px] gap-3 text-[13px] font-medium"><span>Email</span><span>Role</span><span /></div>
                  {data.invites.map((inv, i) => (
                    <div key={i} className="grid grid-cols-[1fr_170px_32px] gap-3 items-center">
                      <Field value={inv.email} placeholder="name@company.com" onChange={(e) => set({ invites: data.invites.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)) })} />
                      <select value={inv.role} onChange={(e) => set({ invites: data.invites.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)) })} className="h-11 px-3 rounded-[10px] bg-white border border-mist text-[14px] outline-none focus:border-ink">
                        {["Admin", "Analyst", "Member"].map((r) => <option key={r}>{r}</option>)}
                      </select>
                      <button onClick={() => set({ invites: data.invites.filter((_, j) => j !== i) })} className="size-8 grid place-items-center rounded-lg text-stone hover:text-ink" aria-label="Remove"><X className="size-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => set({ invites: [...data.invites, { email: "", role: "Member" }] })} className="inline-flex items-center gap-2 text-[14px] font-medium pt-1"><Plus className="size-4" /> Add another</button>
                </div>
                <div className="rounded-[14px] bg-sand-tint divide-y divide-sand">
                  {[["Admin", "Manage libraries, upload documents and invite people."], ["Analyst", "Chat, and follow how documents are indexing."], ["Member", "Ask questions and read the cited pages."]].map(([r, d]) => (
                    <div key={r} className="flex gap-4 px-4 py-3 text-[14px]"><span className="w-[84px] font-medium">{r}</span><span className="text-ink-700">{d}</span></div>
                  ))}
                </div>
              </Step>
            )}
            {step === 5 && (
              <div className="space-y-7 max-w-[480px]">
                <span className="size-14 rounded-full bg-success-soft grid place-items-center"><Check className="size-7 text-success" /></span>
                <div className="space-y-2.5">
                  <h1 className="font-display text-[32px] leading-10 font-semibold tracking-[-0.015em]">You’re all set{data.first ? `, ${data.first}` : ""}</h1>
                  <p className="text-[16px] leading-[26px] text-stone">{data.company || "Your company"} is ready. Here’s what we set up for you.</p>
                </div>
                <div className="rounded-[14px] bg-white border border-sand divide-y divide-sand">
                  {[
                    [Building2, "Workspace", data.company || "Your company"],
                    [Server, "Server", `${data.plan} · ${data.region}`],
                    [BookOpen, "Library", data.library || "Flight Operations"],
                    [Users, "Team", `${data.invites.filter((i) => i.email).length} invites sent`],
                  ].map(([I, k, v]) => {
                    const Icon = I as typeof Server;
                    return (
                      <div key={k as string} className="flex items-center gap-3.5 px-[18px] py-3.5 text-[14px]">
                        <Icon className="size-5 text-slate" strokeWidth={1.5} /><span className="w-[90px] text-stone">{k as string}</span><span className="font-medium">{v as string}</span>
                      </div>
                    );
                  })}
                </div>
                <a href="/login" className="flex items-center justify-center gap-2 h-12 rounded-xl bg-ink text-white text-[14px] font-medium hover:bg-[#2c2c2b]">Open Docunarrio <ArrowRight className="size-4" /></a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Step({ over, title, sub, children, onBack, onNext, nextLabel = "Continue" }: { over: string; title: string; sub: string; children: ReactNode; onBack?: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <p className="text-[11px] leading-[14px] font-semibold tracking-[0.08em] uppercase text-stone">{over}</p>
        <h1 className="font-display text-[32px] leading-10 font-semibold tracking-[-0.015em]">{title}</h1>
        <p className="text-[16px] leading-[26px] text-stone">{sub}</p>
      </div>
      <div className="space-y-4">{children}</div>
      <div className="flex items-center justify-between pt-2">
        {onBack ? <Button kind="ghost" onClick={onBack}>Back</Button> : <span />}
        <Button onClick={onNext}>{nextLabel} <ArrowRight className="size-4" /></Button>
      </div>
    </div>
  );
}

function PasswordMeter({ value }: { value: string }) {
  const score = [value.length >= 12, /\d/.test(value), /[^A-Za-z0-9]/.test(value), /[A-Z]/.test(value) && /[a-z]/.test(value)].filter(Boolean).length;
  if (!value) return null;
  const label = ["Too weak", "Weak", "Okay", "Good", "Strong password"][score];
  return (
    <div className="space-y-1.5 -mt-1">
      <div className="flex gap-1.5">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-1 flex-1 rounded-full ${i < score ? (score >= 3 ? "bg-success" : "bg-warn") : "bg-sand"}`} />)}</div>
      <p className={`text-[12px] ${score >= 3 ? "text-success" : "text-warn"}`}>{label}</p>
    </div>
  );
}

/** The library step, with a simulated upload so the walkthrough shows indexing. */
function LibraryStep({ name, onName, onBack, onNext }: { name: string; onName: (s: string) => void; onBack: () => void; onNext: () => void }) {
  const [files, setFiles] = useState<{ name: string; pages: number; done: number }[]>([]);
  useEffect(() => {
    if (!files.some((f) => f.done < f.pages)) return;
    const t = setInterval(() => setFiles((fs) => {
      let started = false;
      return fs.map((f) => {
        if (f.done >= f.pages || started) return f;
        started = true;
        return { ...f, done: Math.min(f.pages, f.done + Math.ceil(f.pages / 12)) };
      });
    }), 400);
    return () => clearInterval(t);
  }, [files]);

  function add(list: FileList | null) {
    if (!list) return;
    setFiles((fs) => [...fs, ...Array.from(list).map((f) => ({ name: f.name, pages: Math.max(20, Math.round(f.size / 70000)), done: 0 }))]);
  }

  return (
    <Step over="Step 4 of 5" title="Create your first library" sub="A library is a collection of documents your team can ask questions about — for example, all operations manuals." onBack={onBack} onNext={onNext}>
      <Field label="Library name" value={name} onChange={(e) => onName(e.target.value)} placeholder="Flight Operations" />
      <label className="flex flex-col items-center gap-2 py-5 rounded-[14px] bg-white border-[1.5px] border-dashed border-mist cursor-pointer hover:border-stone">
        <input type="file" accept="application/pdf,.pdf" multiple className="hidden" onChange={(e) => add(e.target.files)} />
        <span className="size-10 rounded-full bg-sand-tint grid place-items-center"><Upload className="size-5" strokeWidth={1.5} /></span>
        <span className="text-[14px] text-ink-700">Drop PDFs here or <span className="font-medium text-ink">browse files</span></span>
        <span className="text-[12px] text-stone">PDF up to 500 MB each · scanned pages are fine</span>
      </label>
      {files.length > 0 && (
        <div className="rounded-[14px] bg-white border border-sand divide-y divide-sand">
          {files.map((f, i) => {
            const p = f.done / f.pages;
            const state = p >= 1 ? "completed" : f.done > 0 ? "processing" : "queued";
            return (
              <div key={i} className="flex items-center gap-3.5 px-4 py-3.5">
                <span className="size-9 rounded-lg bg-snow border border-sand grid place-items-center shrink-0"><FileText className="size-[18px] text-slate" strokeWidth={1.5} /></span>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-medium truncate">{f.name}</span>
                    <StatusBadge state={state}>{state === "completed" ? "Indexed" : state === "processing" ? `Indexing ${Math.round(p * 100)}%` : "Queued"}</StatusBadge>
                  </div>
                  <Progress value={p} tone={p >= 1 ? "success" : "ink"} />
                  <p className="text-[12px] text-stone">{state === "queued" ? "Waiting" : `${f.done} of ${f.pages} pages`}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Step>
  );
}
