import Image from "next/image";
import { Check } from "lucide-react";

export default function DesktopShowcase() {
  return (
    <section id="desktop-showcase" className="py-30 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
          {/* Device */}
          <div className="reveal-up">
            <div className="w-full">
              <div className="bg-[#2d2d2d] rounded-t-xl pt-2.5 flex justify-center">
                <div className="w-[16%] h-1.5 bg-[#1a1a1a] rounded-b-lg" />
              </div>
              <div className="bg-[#1a1a1a] p-0.5 border-x-[3px] border-[#2d2d2d]">
                <Image
                  src="/desktopdocu2.png"
                  alt="Docunarrio Desktop App"
                  width={1200}
                  height={750}
                  className="w-full block"
                />
              </div>
              <div className="bg-gradient-to-b from-[#c8c8c8] to-[#a8a8a8] h-3.5 rounded-b-lg flex justify-center items-center">
                <div className="w-[20%] h-1 bg-black/8 rounded-b" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="reveal-up max-w-[480px]">
            <span className="inline-block text-xs font-bold text-accent uppercase tracking-[0.12em] mb-4">
              Desktop App
            </span>
            <h2 className="text-[clamp(26px,2.8vw,34px)] font-extrabold leading-[1.2] tracking-[-0.02em] mb-4">
              Your entire operations library, one question away.
            </h2>
            <p className="text-base leading-[1.75] text-text-secondary mb-7">
              The native macOS app gives your team a distraction-free workspace
              to search manuals, SOPs, and operational documents — with
              conversation history and traceable sources.
            </p>
            <ul className="flex flex-col gap-3.5">
              {[
                "Multi-session conversation management",
                "Fully traceable source attribution",
                "Works with Vistair & existing document hubs",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] font-medium">
                  <Check size={20} className="text-accent shrink-0" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
