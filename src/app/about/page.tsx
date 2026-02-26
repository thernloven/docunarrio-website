"use client";

import { useReveal } from "@/components/useReveal";
import Nav from "@/components/Nav";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function AboutPage() {
  useReveal();

  return (
    <>
      <Nav />
      <div className="pt-28" />
      <About />
      <Footer />
    </>
  );
}
