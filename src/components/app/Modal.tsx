"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

// Figma "Web / Library — Upload modal": 560 wide, r20, ink scrim at 40%.
export default function Modal({ title, subtitle, onClose, children, footer }: { title: string; subtitle?: string; onClose: () => void; children: ReactNode; footer: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative w-full max-w-[560px] rounded-[20px] bg-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18)] px-7 py-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h2 className="font-display text-[24px] leading-8 font-semibold">{title}</h2>
            {subtitle && <p className="text-[14px] leading-[22px] text-stone mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-lg text-stone hover:text-ink hover:bg-sand-tint" aria-label="Close"><X className="size-5" strokeWidth={1.5} /></button>
        </div>
        {children}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-sand">{footer}</div>
      </div>
    </div>
  );
}
