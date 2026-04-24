import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { rotatingWords } from "./data";

const polaroids = [
  {
    time: "Tonight, 8pm",
    plan: "Indiranagar food crawl",
    city: "Bangalore",
    tag: "Food",
    rotate: -7,
    color: "bg-paper-warm",
  },
  {
    time: "Tomorrow, 6am",
    plan: "Marine Drive walk",
    city: "Mumbai",
    tag: "Walk",
    rotate: 5,
    color: "bg-mustard/30",
  },
  {
    time: "Sunday eve",
    plan: "Lake Pichola sunset",
    city: "Udaipur",
    tag: "Vibes",
    rotate: -3,
    color: "bg-coral/20",
  },
];

export const Hero = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setI((v) => (v + 1) % rotatingWords.length),
      1800,
    );
    return () => clearInterval(id);
  }, []);

  return (
     <section className="relative min-h-screen flex items-center justify-center px-5 sm:px-8 py-16">
         {/* Background Image */}
         <div
           className="absolute inset-0"
           style={{
             backgroundImage:
               "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1600&auto=format&fit=crop')",
             backgroundSize: "cover",
             backgroundPosition: "center",
           }}
         />
 
         {/* Devanagari Watermark */}
         <div
           aria-hidden
           className="pointer-events-none absolute inset-x-0 -top-10 select-none text-center font-deva text-[30vw] sm:text-[26vw] leading-none text-white/[0.07] blur-[1px] z-[1]"
         >
           ज़िपआउट
         </div>
 
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#f9f5ee]" />
 
         <motion.div
           initial={{ opacity: 0, y: 28 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.85 }}
           className="relative z-10 max-w-3xl w-full text-center"
         >
           <div className="flex items-center justify-center gap-3 mb-5">
             <img
               src="/android-chrome-512x512.png"
               alt="Zipout"
               className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
             />
             <p className="text-white text-2xl md:text-3xl font-medium tracking-tight">
               Zipout
             </p>
           </div>
 
           <h1
             className="text-[2.4rem] sm:text-6xl md:text-7xl text-white leading-[1.05] tracking-tight"
             style={{ fontWeight: 300, fontFamily: " serif" }}
           >
             Aaj ka kya plan hai
             <br />
             <span className="relative inline-block min-h-[1em] min-w-[60%] overflow-hidden align-baseline">
               <AnimatePresence mode="wait">
                 <motion.span
                   key={rotatingWords[i]}
                   initial={{ y: "100%", opacity: 0 }}
                   animate={{ y: "0%", opacity: 1 }}
                   exit={{ y: "-100%", opacity: 0 }}
                   transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                   className="inline-block font-serif-display italic text-[0.9em]"
                 >
                   {rotatingWords[i]} ?
                 </motion.span>
               </AnimatePresence>
             </span>
           </h1>
 
           <p
             className="mt-6 text-base sm:text-xl text-white/80 max-w-xl mx-auto leading-relaxed"
             style={{ fontFamily: "'system-ui', sans-serif", fontWeight: 300 }}
           >
             Someone in your city just posted — lake view tonight, anyone? Food
             crawl at 8, 3 spots left. Bike ride Sunday, just show up.
             <br />
             <br />
             No planning. No group chats. Open plans, real people, and you
             deciding yes or no.
           </p>
 
           <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
             <a
               href="/feed"
               className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm sm:text-base text-white font-medium transition-all duration-300 shadow-md hover:scale-[1.03] active:scale-[0.97] w-full sm:w-auto justify-center"
               style={{
                 backgroundColor: "#FF5A3C",
                 fontFamily: "'system-ui', sans-serif",
               }}
               onMouseEnter={(e) =>
                 (e.currentTarget.style.backgroundColor = "#e84d31")
               }
               onMouseLeave={(e) =>
                 (e.currentTarget.style.backgroundColor = "#FF5A3C")
               }
             >
               See what's happening tonight
               <ArrowUpRight
                 size={17}
                 className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
               />
             </a>
             <a
               href="/plans/create"
               className="inline-flex items-center gap-2 rounded-full border border-ink/30 px-6 py-3.5 font-mono text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
             >
               Post your own plan
             </a>
           </div>
 
           <p
             className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-ink/50"
             style={{ fontFamily: "'system-ui', sans-serif" }}
           >
             Bangalore · Mumbai · Delhi · Udaipur · Indore
           </p>
         </motion.div>
       </section>
  );
};
