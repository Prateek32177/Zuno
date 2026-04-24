import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section id="post" className="relative overflow-hidden bg-coral py-28 text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      >
        <div className="absolute -left-8 top-4 font-deva text-[26vw] leading-none text-paper/[0.08]">
          निकल लो
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <div className="label-eyebrow mb-6 text-paper/70">No. 08 / The whole point</div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-serif-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl"
        >
          Yeh app unke liye hai
          <br />
          <em className="text-ink">jo bas nikalna chahte hain.</em>
        </motion.h2>

        <p className="mx-auto mt-8 max-w-2xl font-mono text-[15px] leading-relaxed text-paper/90">
          No performance. No filters. You're not here to impress anyone. You're here
          because your city has more to offer than your apartment ceiling — and you
          already know that.
        </p>
        <p className="mx-auto mt-4 max-w-2xl font-mono text-[15px] leading-relaxed text-paper/75">
          New city, no friends yet? Post a plan. Introverted but restless? Just join
          one. Already have a crew but want new people in the mix? Open plan, done.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="/feed"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-mono text-sm font-medium text-paper transition hover:-translate-y-0.5"
          >
            Dekho kya chal raha hai
            <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="/plans/create"
            className="inline-flex items-center gap-2 rounded-full border border-paper px-7 py-4 font-mono text-sm font-medium text-paper transition hover:bg-paper hover:text-ink"
          >
            Ya apna plan daalo
          </a>
        </div>

        <div className="mt-8 inline-block rotate-[-2deg] rounded-full bg-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-paper">
          Free. Forever. Promise.
        </div>
      </div>
    </section>
  );
};