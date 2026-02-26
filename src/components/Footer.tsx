import Image from "next/image";

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 bg-dark border-t border-white/6">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <Image
              src="/logo.png"
              alt="Docunarrio"
              width={130}
              height={22}
              className="h-[22px] w-auto brightness-0 invert mb-4"
            />
            <p className="text-sm text-white/35 leading-[1.7] max-w-[280px]">
              Private AI-powered document intelligence, built with
              aviation-grade safety principles.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white/45 uppercase tracking-[0.08em] mb-4">
              Product
            </h4>
            <a href="/#features" className="block text-sm text-white/35 mb-2.5 hover:text-white transition-colors">What We Offer</a>
            <a href="/#how-it-works" className="block text-sm text-white/35 mb-2.5 hover:text-white transition-colors">How It Works</a>
            <a href="/#why" className="block text-sm text-white/35 mb-2.5 hover:text-white transition-colors">Why Us</a>
            <a href="/#values" className="block text-sm text-white/35 mb-2.5 hover:text-white transition-colors">Values</a>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white/45 uppercase tracking-[0.08em] mb-4">
              Company
            </h4>
            <a href="/about" className="block text-sm text-white/35 mb-2.5 hover:text-white transition-colors">About</a>
            <a href="/contact" className="block text-sm text-white/35 mb-2.5 hover:text-white transition-colors">Contact</a>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white/45 uppercase tracking-[0.08em] mb-4">
              Legal
            </h4>
            <a href="#" className="block text-sm text-white/35 mb-2.5 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="block text-sm text-white/35 mb-2.5 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="block text-sm text-white/35 mb-2.5 hover:text-white transition-colors">Security</a>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5">
          <p className="text-[13px] text-white/20">&copy; 2026 Docunarrio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
