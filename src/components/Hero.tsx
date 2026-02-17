"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-36 pb-20 overflow-hidden">
      {/* Background grid + glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(204,204,204,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(204,204,204,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%)",
          }}
        />
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(112,9,17,0.06)_0%,transparent_65%)]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="max-w-[560px] lg:max-w-none">
            <div className="reveal-up inline-flex items-center gap-2.5 px-5 py-2 text-[13px] font-semibold text-accent bg-accent/5 border border-accent/10 rounded-full mb-8 tracking-wide">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-dot" />
              Private AI &middot; Aviation-Grade Security
            </div>

            <h1 className="reveal-up text-[clamp(38px,4.5vw,56px)] font-black leading-[1.08] tracking-[-0.035em] mb-6">
              Inspired by aviation,
              <br />
              <span className="text-gradient">crafted for you.</span>
            </h1>

            <p className="reveal-up text-[17px] leading-[1.75] text-text-secondary mb-9">
              AI-powered information search designed to give you answers — fast,
              accurate, and completely private. Say goodbye to PDF keyword
              searching. Say hi to intelligent, contextual answers.
            </p>

            <div className="reveal-up flex items-center gap-2 flex-wrap mb-8">
              <a
                href="#cta"
                className="inline-flex items-center px-10 py-[18px] text-base font-semibold text-white bg-accent rounded-[14px] shadow-[0_4px_14px_rgba(112,9,17,0.25)] hover:bg-accent-light hover:shadow-[0_6px_24px_rgba(112,9,17,0.35)] hover:-translate-y-0.5 transition-all"
              >
                Request a Demo
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-2 py-[14px] text-[15px] font-medium text-text-primary hover:text-accent transition-colors"
              >
                See How It Works
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </a>
            </div>

            <div className="reveal-up flex items-center gap-2.5 text-[13px] font-medium text-text-secondary pt-6 border-t border-border/40">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-accent shrink-0"
              >
                <rect x="3" y="11" width="10" height="5" rx="1" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              You stay in control of your data. Always.
            </div>
          </div>

          {/* Device */}
          <div className="reveal-up animate-float">
            <div className="w-full">
              <div className="bg-[#2d2d2d] rounded-t-xl pt-2.5 flex justify-center">
                <div className="w-[16%] h-1.5 bg-[#1a1a1a] rounded-b-lg" />
              </div>
              <div className="bg-[#1a1a1a] p-0.5 border-x-[3px] border-[#2d2d2d]">
                <Image
                  src="/desktopdocu1.png"
                  alt="Docunarrio Desktop"
                  width={1200}
                  height={750}
                  className="w-full block"
                  priority
                />
              </div>
              <div className="bg-gradient-to-b from-[#c8c8c8] to-[#a8a8a8] h-3.5 rounded-b-lg flex justify-center items-center">
                <div className="w-[20%] h-1 bg-black/8 rounded-b" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
