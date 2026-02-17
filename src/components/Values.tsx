const values = [
  {
    num: "01",
    title: "Human-Centric Innovation",
    desc: "We design technology that enhances human performance — never replaces it. Every feature is built around the user, aligned with EASA's vision of safe and explainable AI.",
  },
  {
    num: "02",
    title: "Safety First",
    desc: "Inspired by aviation, safety is not a feature — it is a foundation. Our AI respects privacy, follows regulations, and operates in fully private and isolated environments.",
  },
  {
    num: "03",
    title: "Purposeful Simplicity",
    desc: "Aviation manuals and operational documents are complex. Accessing them shouldn't be. We transform complexity into clarity with intuitive, intelligent search.",
  },
  {
    num: "04",
    title: "Integrity & Trust",
    desc: "Information is one of the most valuable assets any organization has. We build AI solutions that are transparent, controllable, and designed to keep your data protected at all times.",
  },
  {
    num: "05",
    title: "Aviation-Grade Standards",
    desc: "We build with the same principles that define aviation: precision, responsibility, and reliability — in every line of code.",
    accent: true,
  },
];

export default function Values() {
  return (
    <section id="values" className="py-30 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-[620px] mx-auto mb-16 reveal-up">
          <span className="inline-block text-xs font-bold text-accent uppercase tracking-[0.12em] mb-4">
            Our Values
          </span>
          <h2 className="text-[clamp(28px,3.5vw,42px)] font-extrabold leading-[1.15] tracking-[-0.025em] mb-4">
            Built with aviation-grade principles.
          </h2>
          <p className="text-[17px] text-text-secondary leading-[1.7]">
            We build with the same principles that define aviation: precision,
            responsibility, and reliability — in every line of code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <div
              key={v.num}
              data-delay={i * 80}
              className={`reveal-up p-10 rounded-2xl border transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] ${
                v.accent
                  ? "bg-dark border-transparent md:col-span-2 lg:col-span-2"
                  : "bg-bg border-border/40"
              }`}
            >
              <div
                className={`text-[48px] font-black tracking-[-0.04em] leading-none mb-4 ${
                  v.accent ? "text-accent" : "text-cream"
                }`}
              >
                {v.num}
              </div>
              <h3
                className={`text-lg font-bold tracking-[-0.01em] mb-3 ${
                  v.accent ? "text-white/85" : ""
                }`}
              >
                {v.title}
              </h3>
              <p
                className={`text-sm leading-[1.7] ${
                  v.accent ? "text-white/85" : "text-text-secondary"
                }`}
              >
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
