import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section id="post" className="relative overflow-hidden bg-coral py-28 text-paper">
      
      {/* Background word */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-6 top-6 font-deva text-[26vw] text-paper/[0.08]">
          निकल लो
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
        >
         Yeh app unke liye hai
          <br />
          <em className="text-ink">jo bas nikalna chahte hain.</em>
        </motion.h2>

        <p className="mt-6 font-mono text-sm text-paper/80">
          Zyada sochoge toh reh jaoge.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="/feed"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-mono text-sm text-paper transition hover:-translate-y-0.5"
          >
            Scene dekho
            <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href="/plans/create"
            className="inline-flex items-center gap-2 rounded-full border border-paper px-7 py-4 font-mono text-sm text-paper transition hover:bg-paper hover:text-ink"
          >
            Main aa raha hoon
          </a>
        </div>

        <div className="mt-8 inline-block rotate-[-2deg] rounded-full bg-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-paper">
          Free. Bas aa jao.
        </div>
      </div>
    </section>
  );
};