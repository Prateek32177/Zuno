"use client";

import { FinalCTA } from "./home/FinalCta";
import { Footer } from "./home/Footer";
import { CityPlans } from "./home/CityPlans";
import { WhyCards } from "./home/Whyweexist";
import { Hero } from "./home/Hero";
import { useState, useEffect } from "react";
import { LiveFeed } from "./home/Livefeed";
import { Manifesto } from "./home/Manifesto";

export const rotatingWords = [
  "bike ride",
  "chai run",
  "sunset walk",
  "gig night",
  "food crawl",
  "lake side",
];

export default function Home() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setI((v) => (v + 1) % rotatingWords.length),
      1800,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <Hero />

      {/* The Real Thing */}
      <Manifesto />
      {/* Live feed preview */}
      <LiveFeed />

      {/* City plans */}

      <CityPlans />
      {/* Why Zipout */}

      <WhyCards />

      <FinalCTA />

      {/* Footer */}
      <Footer />
    </section>
  );
}
