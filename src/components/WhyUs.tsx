"use client";

import { useEffect, useRef } from "react";
import { ShieldCheck, User, Lock, CheckCircle } from "lucide-react";

function StatCard({ target, suffix, label, delay }: { target: number; suffix: string; label: string; delay: number }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 2000;
          const start = performance.now();
          function update(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el!.textContent = String(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div
      data-delay={delay}
      className="reveal-up text-center p-10 bg-bg rounded-2xl border border-border/40 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)]"
    >
      <div>
        <span ref={numRef} className="text-[56px] font-black tracking-[-0.04em] text-accent leading-none">
          0
        </span>
        <span className="text-xl font-bold text-accent ml-0.5">{suffix}</span>
      </div>
      <p className="mt-3 text-sm text-text-secondary leading-snug" dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  );
}

const diffs = [
  { icon: ShieldCheck, text: "Built in alignment with EASA's AI Roadmap" },
  { icon: User, text: "Created by aviation professionals who know the problem first-hand" },
  { icon: Lock, text: "Private, isolated AI ecosystems — no cloud leakage, no shared data" },
  { icon: CheckCircle, text: "Neutral, secure, transparent, and trustworthy technology" },
];

export default function WhyUs() {
  return (
    <section id="why" className="py-30 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-[620px] mx-auto mb-16 reveal-up">
          <span className="inline-block text-xs font-bold text-accent uppercase tracking-[0.12em] mb-4">
            Why Choose Us
          </span>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-extrabold leading-[1.15] tracking-[-0.025em] mb-4">
            Because the time you save —
            <br />
            every day — <span className="text-gradient">matters.</span>
          </h2>
          <p className="text-[17px] text-text-secondary leading-[1.7]">
            Professionals waste enormous time searching for the right
            information. We eliminate that friction.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <StatCard target={80} suffix="%" label="Reduction in time<br/>spent searching" delay={0} />
          <StatCard target={3} suffix="sec" label="Average response<br/>time" delay={80} />
          <StatCard target={100} suffix="%" label="Data stays inside<br/>your system" delay={160} />
          <StatCard target={0} suffix="leaks" label="No cloud leakage,<br/>no shared data" delay={240} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diffs.map((d, i) => (
            <div
              key={i}
              data-delay={i * 80}
              className="reveal-up flex items-start gap-4 p-6 bg-bg rounded-xl border border-border/40 transition-all hover:border-accent hover:bg-accent/5"
            >
              <d.icon size={24} className="text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-[15px] font-medium leading-snug">{d.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
