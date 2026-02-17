"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/82 backdrop-blur-xl shadow-[0_1px_0_rgba(204,204,204,0.4)] py-3"
          : "py-[18px]"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <a href="#">
          <Image src="/logo.png" alt="Docunarrio" width={130} height={26} className="h-[26px] w-auto" />
        </a>

        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-5 md:gap-9 absolute md:static top-full left-0 right-0 bg-bg/97 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-6 md:p-0 border-b md:border-b-0 border-border/40`}
        >
          {["features", "why", "how-it-works", "values"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-accent after:transition-all hover:after:w-full"
            >
              {id === "features"
                ? "What We Offer"
                : id === "why"
                ? "Why Us"
                : id === "how-it-works"
                ? "How It Works"
                : "Values"}
            </a>
          ))}
        </div>

        <a
          href="#cta"
          className="hidden md:inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-accent rounded-xl shadow-[0_4px_14px_rgba(112,9,17,0.25)] hover:bg-accent-light hover:shadow-[0_6px_24px_rgba(112,9,17,0.35)] hover:-translate-y-0.5 transition-all"
        >
          Request Demo
        </a>

        <button
          className="flex md:hidden flex-col gap-[5px] p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-[22px] h-[2px] bg-text-primary rounded transition-all ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-text-primary rounded transition-all ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-text-primary rounded transition-all ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </div>
    </nav>
  );
}
