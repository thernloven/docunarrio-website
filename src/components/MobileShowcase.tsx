import Image from "next/image";
import { Check } from "lucide-react";

export default function MobileShowcase() {
  return (
    <section className="py-30">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="reveal-up max-w-[480px] order-1">
            <span className="inline-block text-xs font-bold text-accent uppercase tracking-[0.12em] mb-4">
              Mobile App
            </span>
            <h2 className="text-[clamp(26px,2.8vw,34px)] font-extrabold leading-[1.2] tracking-[-0.02em] mb-4">
              Operational answers,
              <br />
              wherever you are.
            </h2>
            <p className="text-base leading-[1.75] text-text-secondary mb-7">
              On the ramp, in a briefing, or during a layover — the iOS app puts
              your entire knowledge base in your pocket. Ask questions like you
              would ask a colleague.
            </p>
            <ul className="flex flex-col gap-3.5">
              {[
                "Native iOS experience",
                "Ask in natural language",
                "Answers with traceable sources",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] font-medium">
                  <Check size={20} className="text-accent shrink-0" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* iPhone */}
          <div className="reveal-up order-2 flex justify-center">
            <div className="w-[280px] relative">
              <div className="relative aspect-[9/19.5] w-full rounded-[3rem] bg-[#0a0a0a] shadow-[0_2px_8px_rgba(0,0,0,0.12),0_12px_40px_rgba(0,0,0,0.15)]">
                <div className="absolute inset-[3px] rounded-[2.8rem] overflow-hidden bg-black">
                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-[90px] h-[22px] bg-black rounded-full" />
                  {/* Screen */}
                  <Image
                    src="/mobiledocu.png"
                    alt="Docunarrio Mobile App"
                    width={560}
                    height={1218}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 w-[120px] h-[5px] bg-white/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
