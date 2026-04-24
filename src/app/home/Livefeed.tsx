import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { feedPreviews } from "./data";

export const LiveFeed = () => {
  return (
    <section id="feed" className="relative border-b border-ink/10 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="label-eyebrow mb-3">No. 03 / Abhi ke plans</div>
            <h2 className="font-serif-display text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              What is{" "}
              <em className="text-coral-deep">actually</em> on
              <br />
              right now.
            </h2>
          </div>
          <p className="font-mono text-sm text-ink/60">Real plans. Real people. Posted today.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {feedPreviews.map((item, i) => (
            <motion.article
              key={item.user + item.post}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: item.tilt }}
              whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative bg-card p-6 shadow-[0_14px_40px_-22px_rgba(26,18,8,0.35)] ring-1 ring-ink/10"
            >
              {/* torn-edge top */}
              <span
                aria-hidden
                className="absolute inset-x-0 -top-1 h-2"
                style={{
                  background:
                    "radial-gradient(circle at 6px 0, hsl(var(--paper)) 4px, transparent 4px) 0 0/12px 8px",
                }}
              />
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-ink font-serif-display text-lg text-paper">
                  {item.user[0]}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-xs uppercase tracking-widest text-ink">
                    {item.user}
                    <span className="ml-1 text-ink/40">· {item.city}</span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
                    item.tag === "Women only"
                      ? "bg-coral/15 text-coral-deep"
                      : "bg-ink/8 bg-ink/10 text-ink/70"
                  }`}
                >
                  {item.tag}
                </span>
              </div>

              <p className="mt-4 font-serif-display text-xl leading-snug text-ink">
                "{item.post}"
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {Array.from({ length: Math.min(4, item.joiners) }).map((_, k) => (
                      <span
                        key={k}
                        className="inline-block size-6 rounded-full ring-2 ring-card"
                        style={{
                          background: ["hsl(var(--coral))", "hsl(var(--mustard))", "hsl(var(--forest))", "hsl(var(--lake))"][k % 4],
                        }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-ink/60">
                    {item.joiners} joined already
                  </span>
                </div>
                <button className="group/btn relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-ink px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:text-paper">
                  <span className="absolute inset-0 -z-0 origin-left scale-x-0 bg-coral transition-transform duration-300 group-hover/btn:scale-x-100" />
                  <span className="relative">Join</span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="/feed"
            className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-ink underline-offset-8 hover:underline"
          >
            See all plans in your city
            <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};