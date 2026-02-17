export default function Marquee() {
  const items = [
    "Private AI",
    "Aviation-Grade Safety",
    "EASA Aligned",
    "Fully Isolated",
    "No Cloud Leakage",
    "Human-Centric",
    "Traceable Sources",
  ];

  const repeated = [...items, ...items];

  return (
    <section className="py-5 bg-dark overflow-hidden">
      <div className="flex w-max animate-marquee">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-8 px-4">
            <span className="text-[13px] font-semibold text-white/50 uppercase tracking-[0.1em]">
              {item}
            </span>
            <span className="w-1 h-1 bg-accent rounded-full" />
          </span>
        ))}
      </div>
    </section>
  );
}
