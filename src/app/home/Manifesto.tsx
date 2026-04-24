import { motion } from "framer-motion";
import { versus } from "./data";

export const Manifesto = () => {
  return (
    <section className="relative border-b border-ink/10 bg-paper-warm py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Magazine label */}
        <div className="mb-12 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-end">
          <div className="label-eyebrow">No. 02 / Manifesto</div>
          <div className="h-px w-full bg-ink/15" />
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <h2 className="font-serif-display text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-[4.2rem]">
              You're not looking for a{" "}
              <span className="marker-underline px-1">plan</span>.
              <br />
              You're looking for{" "}
              <em className="text-coral-deep">people</em> to make it{" "}
              <span className="italic underline decoration-coral decoration-[6px] underline-offset-[10px]">
                real
              </span>
              .
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <p className="font-mono text-[15px] leading-relaxed text-ink/75">
              Zipout is not a ticketing app. Not an event page. No performers, no
              sponsors, no curated experience.
            </p>
            <p className="mt-5 font-mono text-[15px] leading-relaxed text-ink/75">
              It is just people — in Bangalore, Mumbai, Delhi, Udaipur — waking up
              and saying <em className="not-italic text-ink">aaj kuch crazy karte hai</em>. And other people
              saying <span className="text-coral-deep font-semibold">yes</span>.
            </p>
            <p className="mt-5 border-l-2 border-coral pl-4 font-serif-display text-xl italic leading-snug text-ink">
              "You post a plan. Whoever wants in, joins. You all show up. Something real happens."
            </p>
          </motion.div>
        </div>

        {/* Vs others */}
        <div className="mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h3 className="font-serif-display text-3xl leading-tight text-ink sm:text-4xl">
              Why not Instagram / WhatsApp / Meetup?
            </h3>
            <span className="label-eyebrow hidden sm:block">A short roast</span>
          </div>

          <div className="grid gap-3">
            {versus.map((row, i) => (
              <motion.div
                key={row.q}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={
                  row.highlight
                    ? "relative -mx-2 grid grid-cols-[1fr_2fr] items-center gap-6 rounded-md bg-coral px-6 py-7 text-paper shadow-[0_18px_40px_-22px_rgba(255,90,60,0.7)] sm:-mx-4 sm:grid-cols-[260px_1fr] sm:rotate-[-0.6deg]"
                    : "grid grid-cols-[1fr_2fr] items-center gap-6 border-b border-ink/15 py-5 sm:grid-cols-[260px_1fr]"
                }
              >
                <div
                  className={`font-serif-display ${row.highlight ? "text-3xl sm:text-4xl" : "text-2xl text-ink"}`}
                >
                  {row.q}
                </div>
                <div
                  className={`font-mono text-sm leading-relaxed ${row.highlight ? "text-paper/95" : "text-ink/65"}`}
                >
                  {row.a}
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