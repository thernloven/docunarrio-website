"use client";

import { useReveal } from "@/components/useReveal";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Features from "@/components/Features";
import BigQuote from "@/components/BigQuote";
import DesktopShowcase from "@/components/DesktopShowcase";
import MobileShowcase from "@/components/MobileShowcase";
import WhyUs from "@/components/WhyUs";
import HowItWorks from "@/components/HowItWorks";
import Values from "@/components/Values";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  useReveal();

  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Features />
      <BigQuote />
      <DesktopShowcase />
      <MobileShowcase />
      <WhyUs />
      <HowItWorks />
      <Values />
      <CTA />
      <Footer />
    </>
  );
}
