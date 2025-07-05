"use client";

import Features from "@/components/layout/landing/features";
import Header from "@/components/layout/landing/header";
import Footer from "@/components/layout/landing/footer";
import Hero from "@/components/layout/landing/hero";

export default function Home() {
  return (
    <div className="new-container relative !border-none sm:!border-dashed">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
