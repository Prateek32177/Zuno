import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { instantPlans } from "./data";

const tintMap: Record<string, string> = {
  forest: "from-forest/10 to-transparent",
  sea: "from-sea/10 to-transparent",
  mustard: "from-mustard/20 to-transparent",
  lake: "from-lake/10 to-transparent",
};

export const CityPlans = () => {
  return (
    <section className="relative overflow-hidden border-b border-ink/10 bg-paper py-24 text-ink">
      {/* Background devanagari watermarks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      >
        <div className="absolute -left-10 top-8 font-deva text-[22vw] font-bold leading-none text-ink/[0.05]">
          शहर
        </div>
        <div className="absolute -right-6 bottom-10 font-deva text-[14vw] leading-none text-coral/[0.08]">
          ज़िपआउट
        </div>
      </div>

      {/* Soft warm overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-mustard/[0.04] via-transparent to-coral/[0.04]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="label-eyebrow mb-3 text-ink/50">No. 05 / Tumhaare sheher mein</div>
            <h2 className="font-serif-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Your city,
              <br />
              <em className="text-coral">right now.</em>
            </h2>
          </div>
          <p className="max-w-sm font-mono text-sm text-ink/60">
            The kind of plans people actually want to go for.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {instantPlans.map((city, ci) => (
            <motion.article
              key={city.city}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: ci * 0.08 }}
              className={`relative overflow-hidden rounded-sm border border-ink/10 bg-paper/70 backdrop-blur-sm bg-gradient-to-br ${tintMap[city.tint]} p-7 transition-shadow hover:shadow-[0_20px_40px_-20px_hsl(var(--ink)/0.15)]`}
            >
              <div className="flex items-end justify-between gap-6">
                <div>
                  <div className="font-deva text-6xl font-bold leading-none text-ink sm:text-7xl">
                    {city.deva}
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/55">
                    {city.city}
                  </div>
                </div>
                <span className="rounded-full bg-coral px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-paper">
                  Live
                </span>
              </div>

              <ul className="mt-8 divide-y divide-ink/10">
                {city.plans.map((p) => (
                  <li key={p.plan} className="grid grid-cols-[110px_1fr] gap-4 py-4">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">
                      {p.time}
                    </span>
                    <span className="font-serif-display text-lg leading-snug text-ink">
                      {p.plan}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="/feed"
                className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-coral hover:text-ink"
              >
                See all in {city.city}
                <ArrowUpRight className="size-3.5" />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};