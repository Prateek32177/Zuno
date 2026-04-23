"use client";

import { useEffect, useState } from "react";

const LINES = [
  "Find a plan for a sunrise hike",
  "Join instantly, just go",
  "Chai + sunset plans",
  "Hit a weekend club crawl",
  "Take that spontaneous trip",
];

export default function ZunoPreloader() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"lines" | "final">("lines");
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    let i = 0;

    const runSequence = async () => {
      while (i < LINES.length) {
        setIndex(i);

        await wait(400); // 👈 readable hold

        setAnimateOut(true);
        await wait(150); // 👈 smooth fade

        setAnimateOut(false);
        i++;
      }

      setPhase("final");

      await wait(1000); // 👈 let brand sit
      setVisible(false);
    };

    runSequence();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden bg-[#0f0d0b]">
      <img
        src="https://images.unsplash.com/photo-1616432119481-2876a5d92249?q=80&w=1400&auto=format&fit=crop"
        className="absolute inset-0 h-full w-full object-cover opacity-80 scale-[1.05] animate-[zunoZoom_10s_ease-in-out_infinite]"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />

      <div className="relative flex h-full flex-col items-center justify-center text-white">
        <div className="mb-4 text-3xl font-semibold tracking-tight">Zipout</div>

        <div className="h-8 flex items-center justify-center">
          {phase === "lines" ? (
            <div
              key={index}
              className={`text-sm text-white/90 transition-all duration-300 ${
                animateOut
                  ? "opacity-0 translate-y-2"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {LINES[index]}
            </div>
          ) : (
            <div className="text-base font-medium tracking-tight animate-[finalReveal_0.9s_ease]">
              Discover plans. Meet people.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
