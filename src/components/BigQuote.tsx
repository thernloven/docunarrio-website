export default function BigQuote() {
  return (
    <section className="py-[100px] text-center bg-dark relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(112,9,17,0.12)_0%,transparent_60%)]" />
      <div className="max-w-[1200px] mx-auto px-6 relative">
        <blockquote className="reveal-up text-[clamp(32px,5vw,56px)] font-extrabold text-white tracking-[-0.03em] leading-[1.15] max-w-[800px] mx-auto mb-5">
          <span className="text-accent">&ldquo;</span>
          Stay private, isolated and safe.
          <span className="text-accent">&rdquo;</span>
        </blockquote>
        <p className="reveal-up text-base text-white/40 font-medium">
          This is more than a tagline — it&apos;s our principle.
        </p>
      </div>
    </section>
  );
}
