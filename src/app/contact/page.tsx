"use client";

import { useReveal } from "@/components/useReveal";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function ContactPage() {
  useReveal();

  return (
    <>
      <Nav />
      <div className="pt-28" />
      <Contact />
      <Footer />
    </>
  );
}
