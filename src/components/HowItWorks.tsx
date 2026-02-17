const steps = [
  { title: "Connect", desc: "We link our system to your manuals, operational documents, and internal platforms." },
  { title: "Understand", desc: "The AI analyzes your content inside your private environment — nothing leaves your system." },
  { title: "Ask", desc: "Your staff asks questions in natural language, just like they would ask a colleague." },
  { title: "Respond", desc: "The system provides a clear, concise answer with fully traceable sources." },
  { title: "Empower", desc: "Decision-making becomes faster, safer, and more consistent across your organization." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-30">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-[620px] mx-auto mb-16 reveal-up">
          <span className="inline-block text-xs font-bold text-accent uppercase tracking-[0.12em] mb-4">
            How It Works
          </span>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-extrabold leading-[1.15] tracking-[-0.025em]">
            Five steps to operational clarity.
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-start">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-start">
              <div
                data-delay={i * 120}
                className="reveal-up flex-1 text-center px-4 min-w-[180px] max-w-[220px] mb-8"
              >
                <div className="w-[52px] h-[52px] bg-accent text-white rounded-full flex items-center justify-center text-xl font-extrabold mx-auto mb-5 shadow-[0_4px_14px_rgba(112,9,17,0.2)]">
                  {i + 1}
                </div>
                <h3 className="text-[17px] font-bold tracking-[-0.01em] mb-2.5">
                  {step.title}
                </h3>
                <p className="text-sm leading-[1.65] text-text-secondary">
                  {step.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block w-12 h-0.5 bg-border mt-[26px] shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
