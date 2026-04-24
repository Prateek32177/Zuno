import { motion } from "framer-motion";
import { whyCards } from "./data";

const styles = [
  { col: "md:col-span-2", bg: "bg-paper-warm", rotate: -1.2 },
  { col: "", bg: "bg-mustard/25", rotate: 1.4 },
  { col: "", bg: "bg-coral text-paper", rotate: -2 },
  { col: "md:col-span-2", bg: "bg-card", rotate: 0.8 },
  { col: "", bg: "bg-forest/15", rotate: -1 },
  { col: "md:col-span-3", bg: "bg-ink text-paper", rotate: 0.4 },
];

export const WhyCards = () => {
  return (
    <section className="border-b border-ink/10 bg-paper-warm py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="label-eyebrow mb-3">No. 07 / Why we exist</div>
            <h2 className="font-serif-display text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              No rules. No pressure.
              <br />
              <em className="text-coral-deep">Bas yeh.</em>
            </h2>
          </div>
          <p className="max-w-xs font-mono text-sm text-ink/60">
            The stuff worth saying out loud — pinned to the board.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {whyCards.map((card, i) => {
            const s = styles[i % styles.length];
            const isDark = s.bg.includes("ink") || s.bg.includes("coral text-paper");
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: s.rotate }}
                whileHover={{ rotate: 0, y: -4 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={`relative ${s.col} ${s.bg} rounded-sm p-7 shadow-[0_14px_40px_-22px_rgba(26,18,8,0.35)] ring-1 ring-ink/10`}
              >
                <span className="absolute right-4 top-4 size-2 rounded-full bg-coral animate-blink" />
                <h3 className={`font-serif-display text-2xl leading-tight ${isDark ? "text-paper" : "text-ink"}`}>
                  {card.label}
                </h3>
                <p className={`mt-4 font-mono text-sm leading-relaxed ${isDark ? "text-paper/80" : "text-ink/70"}`}>
                  {card.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};