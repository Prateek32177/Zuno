"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LINES = [
  "Find a plan for a sunrise hike",
  "Join instantly, just go",
  "Chai + sunset plans",
  "Hit a weekend club crawl",
  "Take that spontaneous trip",
];

export default function Preloader() {
  const pathname = usePathname();

  // show only on landing + feed
  const shouldShow = pathname === "/" || pathname === "/feed";

  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"lines" | "final">("lines");
  const [animateOut, setAnimateOut] = useState(false);

  // ✅ HARD RESET on mount (prevents stuck states)
  useEffect(() => {
    setVisible(false);
    setAnimateOut(false);
    setPhase("lines");
    setIndex(0);
  }, []);

  // ✅ Fix back/forward navigation (bfcache)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setVisible(false);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // ✅ Run ONLY once per session
  useEffect(() => {
    if (!shouldShow) return;

    // prevent rerun
    if (sessionStorage.getItem("zipout_preloader_seen")) return;

    let cancelled = false;

    const run = async () => {
      // mark immediately (critical)
      sessionStorage.setItem("zipout_preloader_seen", "true");

      await wait(200);
      if (cancelled) return;

      setVisible(true);

      let i = 0;

      while (i < LINES.length && !cancelled) {
        setIndex(i);

        await wait(700);
        setAnimateOut(true);

        await wait(250);
        setAnimateOut(false);

        i++;
      }

      if (cancelled) return;

      setPhase("final");

      await wait(1000);

      setVisible(false);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []); // 🚀 no deps

  // ✅ safety fallback (never let UI get stuck)
  useEffect(() => {
    if (!visible) return;

    const timeout = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [visible]);

  if (!shouldShow || !visible) return null;

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden bg-black">
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1616432119481-2876a5d92249?q=80&w=1400&auto=format&fit=crop"
        className="absolute inset-0 h-full w-full object-cover scale-[1.08] animate-[zoomSlow_12s_ease-in-out_infinite]"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center text-white">
        {/* Logo */}
        <div className="mb-5 text-3xl font-semibold tracking-tight opacity-90">
          Zipout
        </div>

        {/* Animated text */}
        <div className="h-8 flex items-center justify-center overflow-hidden">
          {phase === "lines" ? (
            <div
              key={index}
              className={`text-sm text-white/90 transition-all duration-500 ${
                animateOut
                  ? "opacity-0 translate-y-3 blur-sm"
                  : "opacity-100 translate-y-0 blur-0"
              }`}
            >
              {LINES[index]}
            </div>
          ) : (
            <div className="text-base font-medium tracking-tight animate-[fadeUp_0.9s_ease]">
              Find plans. Join instantly.
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