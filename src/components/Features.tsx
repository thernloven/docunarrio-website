import {
  Search,
  FileCheck,
  Zap,
  Shield,
  PlusSquare,
  Monitor,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Natural-Language Search",
    desc: "Ask a question the way you think it. Our AI understands context, intent, and nuance — returning clear, precise answers instead of a list of documents.",
  },
  {
    icon: FileCheck,
    title: "Deep Query Understanding",
    desc: "AI that can think in steps — handling complex, multi-layered questions across operational documents.",
  },
  {
    icon: Zap,
    title: "Fast Onboarding",
    desc: "Customized to your operational workflows. Up and running in days, not months.",
  },
  {
    icon: Shield,
    title: "Fully Private & Isolated",
    desc: "Your data stays inside your walls. Private, isolated AI environments — no cloud leakage, no shared data.",
  },
  {
    icon: PlusSquare,
    title: "System Integration",
    desc: "Connects with any platform, intranets, document hubs, and more — bringing all your knowledge into one place.",
  },
  {
    icon: Monitor,
    title: "Cross-Platform",
    desc: "Native macOS and iOS apps. Access your operational documents from the office or on the ramp.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-30">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-[620px] mx-auto mb-16 reveal-up">
          <span className="inline-block text-xs font-bold text-accent uppercase tracking-[0.12em] mb-4">
            What We Offer
          </span>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-extrabold leading-[1.15] tracking-[-0.025em] mb-4">
            We make information
            <br />
            accessible — <span className="text-gradient">instantly.</span>
          </h2>
          <p className="text-[17px] text-text-secondary leading-[1.7]">
            No more guessing keywords or scrolling through endless PDFs and
            manuals. Ask a question, get a clear answer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-delay={i * 80}
              className="reveal-up group relative bg-white border border-border/40 rounded-2xl p-9 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-transparent overflow-hidden
                before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-accent before:to-secondary before:opacity-0 before:transition-opacity group-hover:before:opacity-100"
            >
              <div className="w-[52px] h-[52px] bg-accent/5 rounded-[14px] flex items-center justify-center text-accent mb-[22px] transition-all group-hover:bg-accent group-hover:text-white">
                <f.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-[17px] font-bold tracking-[-0.01em] mb-2.5">
                {f.title}
              </h3>
              <p className="text-sm leading-[1.7] text-text-secondary">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
