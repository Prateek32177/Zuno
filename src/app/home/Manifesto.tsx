import { motion } from "framer-motion";
import { versus } from "./data";

export const Manifesto = () => {
  return (
    <section className="relative border-b border-ink/10 bg-paper-warm py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Label */}
        <div className="mb-12 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-end">
          <div className="label-eyebrow">No. 02 / Manifesto</div>
          <div className="h-px w-full bg-ink/15" />
        </div>

        <div className="grid gap-12 lg:grid-cols-12">

          {/* HEADLINE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <h2 className="font-serif-display text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-[4.2rem]">
              Plan nahi chahiye.
              <br />
              <span className="marker-underline px-1">Log chahiye.</span>
            </h2>
          </motion.div>

          {/* BODY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <p className="font-mono text-[15px] leading-relaxed text-ink/70">
              Koi bolta hai — <span className="text-ink">“chal na”</span>.
              <br />
              Tum bolte ho — <span className="text-coral-deep font-semibold">“aa raha hoon”</span>.
            </p>

            <p className="mt-5 border-l-2 border-coral pl-4 font-serif-display text-lg italic leading-snug text-ink">
              Bas itna hi hai.
            </p>
          </motion.div>
        </div>

        {/* VS SECTION */}
        <div className="mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h3 className="font-serif-display text-3xl leading-tight text-ink sm:text-4xl">
              Baaki apps?
            </h3>
            <span className="label-eyebrow hidden sm:block">thoda reality check</span>
          </div>

          <div className="grid gap-3">
            {versus.map((row, i) => (
              <motion.div
                key={row.q}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={
                  row.highlight
                    ? "relative -mx-2 grid grid-cols-[1fr_2fr] items-center gap-6 rounded-md bg-coral px-6 py-6 text-paper shadow-[0_18px_40px_-22px_rgba(255,90,60,0.7)] sm:-mx-4 sm:grid-cols-[260px_1fr] sm:rotate-[-0.6deg]"
                    : "grid grid-cols-[1fr_2fr] items-center gap-6 border-b border-ink/15 py-4 sm:grid-cols-[260px_1fr]"
                }
              >
                <div
                  className={`font-serif-display ${
                    row.highlight ? "text-3xl sm:text-4xl" : "text-xl text-ink"
                  }`}
                >
                  {row.q}
                </div>

                <div
                  className={`font-mono text-sm leading-relaxed ${
                    row.highlight ? "text-paper/95" : "text-ink/60"
                  }`}
                >
                  {row.highlight
                    ? "Abhi post. Abhi join. Aaj milte hain."
                    : row.q === "Instagram"
                    ? "Scroll karte raho."
                    : row.q === "WhatsApp"
                    ? "Plan kabhi fix nahi hota."
                    : "3 hafte baad ka plan."}
                </div>

                {row.highlight && (
                  <span className="absolute -right-3 -top-4 rotate-[14deg] rounded-full bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-paper">
                    yeh wala ✦
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};