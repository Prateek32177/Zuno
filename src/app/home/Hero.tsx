"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Download,
  MapPin,
  Users,
  PenLine,
  Compass,
  HandCoins,
} from "lucide-react";

const rotatingWords = [
  "bike ride",
  "chai run",
  "sunset walk",
  "gig night",
  "food crawl",
  "lake side",
];

export default function Page() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((v) => (v + 1) % rotatingWords.length),
      1900
    );
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen bg-paper text-ink antialiased">
      
      {/* ================= HERO ================= */}
<section className="relative isolate overflow-hidden text-paper">

  {/* 🌈 gradient base */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#ff7a5c] via-[#ff5c8a] to-[#7b61ff]" />

  {/* 💡 big lighting */}
  <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-white/20 blur-[120px]" />
  <div className="pointer-events-none absolute bottom-[-200px] right-[-120px] h-[500px] w-[500px] rounded-full bg-black/30 blur-[140px]" />

  {/* 🌫️ texture */}
  <div
    className="pointer-events-none absolute inset-0 opacity-[0.05]"
    style={{
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
      backgroundSize: "3px 3px",
    }}
  />

  {/* content */}
  <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-36 pt-24 lg:grid-cols-[1.1fr_0.9fr]">
    
    <div>
      <h1 className="text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
        Create the plan.
        <br />
        Join the moment.
      </h1>

      <p className="mt-6 max-w-xl text-paper/85 text-lg">
        No WhatsApp groups. No planning stress. Just plans, people, and yes or no.
      </p>

      <div className="mt-8 flex gap-3">
        <button className="rounded-full bg-white px-7 py-4 font-semibold text-black shadow-lg">
          Open app
        </button>
        <button className="rounded-full border border-white/60 px-7 py-4">
          See feed
        </button>
      </div>
    </div>

    {/* cards */}
    <div className="relative mx-auto h-[480px] w-full max-w-md">
      <PlanCard tilt={-6} offset="left-0 top-6" />
      <PlanCard tilt={6} offset="left-16 top-44" />
    </div>

  </div>
</section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative -mt-32 rounded-t-[3rem] bg-paper-soft py-32 shadow-[0_-30px_80px_rgba(0,0,0,0.2)]">
        
        {/* subtle carry-over glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-coral/20 to-transparent" />

        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-4xl font-semibold sm:text-5xl">
            Three taps. <span className="text-ink/40">That's it.</span>
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step title="Drop a thought" />
            <Step title="Scroll feed" />
            <Step title="Join instantly" />
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- components ---------- */

const PlanCard = ({
  tilt,
  offset,
  image,
  title,
}: any) => (
  <div
    className={`absolute ${offset} w-[85%] overflow-hidden rounded-2xl bg-paper shadow-xl`}
    style={{ transform: `rotate(${tilt}deg)` }}
  >
    <img src={image} className="h-40 w-full object-cover" />
    <div className="p-4 font-semibold">{title}</div>
  </div>
);

const Step = ({ title }: any) => (
  <div className="rounded-3xl bg-white p-8 shadow-sm hover:shadow-lg transition">
    <p className="text-xl font-semibold">{title}</p>
  </div>
);