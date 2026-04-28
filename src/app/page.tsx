"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Download,
  MapPin,
  Users,
  PenLine,
  Compass,
  HandCoins,
} from "lucide-react";

const rotatingWords = [
  "bike ride",
  "chai run",
  "sunset walk",
  "gig night",
  "food crawl",
  "lake side",
];

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const Wordmark = ({ tone = "light" }: { tone?: "light" | "dark" }) => (
  <a href="/" className="flex items-center gap-2.5">
    <img
      src="/android-chrome-512x512.png"
      alt="Zipout logo"
      className="h-9 w-9 rounded-xl object-cover ring-1 ring-black/5"
    />
    <span
      className={`text-lg font-semibold tracking-tight ${
        tone === "light" ? "text-paper" : "text-ink"
      }`}
    >
      zipout
    </span>
  </a>
);

export default function page() {
  const [wordIndex, setWordIndex] = useState(0);
  const [installEvent, setInstallEvent] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((v) => (v + 1) % rotatingWords.length),
      1900,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BIPEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setInstallEvent(null);
      return;
    }
    window.location.href = "/feed";
  };

  const installLabel = installed
    ? "Open app"
    : installEvent
      ? "Install app"
      : "Open app";

  return (
    <main className="min-h-screen bg-paper text-ink antialiased">
      {/* ============== HERO ============== */}
      <section className="relative isolate overflow-hidden bg-coral text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.19]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--paper) / 0.9) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 pt-7">
          <Wordmark tone="light" />
          <span className="hidden rounded-full border border-paper/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/90 sm:inline-block">
            Bangalore & beyond
          </span>
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
              Create the plan.
              <br />
              Join the moment.
            </h1>

            <div className="mt-5 flex items-baseline gap-2 text-2xl text-paper/85 sm:text-3xl">
              <span className="font-light">tonight's</span>
              <span className="relative inline-block h-[1.2em] min-w-[8ch] overflow-hidden align-baseline">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-110%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block italic text-paper"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {rotatingWords[wordIndex]}?
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-paper/85 sm:text-lg">
              Drop a thought, scroll the feed, show up. Split the bill or go for
              free. No Reddit threads, no WhatsApp groups, no planning committee
              — just plans, people, and yes or no.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={handleInstall}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-paper px-7 py-4 text-sm font-semibold text-coral-deep shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 sm:text-base"
              >
                <Download className="size-4" />
                {installLabel}
              </button>
              <a
                href="/feed"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-paper/60 px-7 py-4 text-sm font-semibold text-paper transition hover:bg-paper hover:text-coral-deep sm:text-base"
              >
                See the feed
                <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-paper/70">
              Bangalore · Mumbai · Delhi · Udaipur · Indore
            </p>
          </motion.div>

          {/* Right: plan cards with unsplash bg */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative mx-auto h-[460px] w-full max-w-md sm:h-[500px]"
          >
            <PlanCard
              tilt={-7}
              offset="left-0 top-2"
              image="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80"
              time="20 mins"
              title="Chai + sunset at Cubbon"
              meta="2 going · 3 spots"
            />
            <PlanCard
              tilt={5}
              offset="left-10 top-36 sm:left-16"
              image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"
              time="Tonight 8:30"
              title="Food crawl in Indiranagar"
              meta="5 going · split ₹400"
            />
            <PlanCard
              tilt={-4}
              offset="left-2 top-72 sm:left-6 sm:top-80"
              image="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80"
              time="Sun 6 AM"
              title="Lake-side cycle, Hebbal"
              meta="11 going · open invite"
            />
          </motion.div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="relative bg-paper-soft py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-coral/10 to-transparent" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-coral-deep">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-coral" />
              How Zipout works
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-coral" />
            </span>
            <h2 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
              Three taps.{" "}
              <span className="text-ink/40">That's the whole app.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Step
              num="01"
              tint="bg-tint-peach"
              accent="text-coral-deep"
              icon={<PenLine className="size-6" strokeWidth={2.2} />}
              title="Drop a thought"
              line="Lake at 7? Coffee in 20? Post it in seconds, no overthinking."
              delay={0}
            />
            <Step
              num="02"
              tint="bg-tint-mint"
              accent="text-emerald-700"
              icon={<Compass className="size-6" strokeWidth={2.2} />}
              title="Scroll the feed"
              line="See what's near you right now. Tap what looks fun."
              delay={0.08}
            />
            <Step
              num="03"
              tint="bg-tint-sky"
              accent="text-sky-700"
              icon={<HandCoins className="size-6" strokeWidth={2.2} />}
              title="Split or go free"
              line="Share the bill in-app, or just show up. Your call."
              delay={0.16}
            />
          </div>

          <p className="mt-12 text-center text-sm text-ink/55">
            No DMs to chase. No groups to manage. Just plans, people, and yes or
            no.
          </p>
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="bg-paper px-4 pb-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-coral px-6 py-24 text-paper sm:py-32">
          {/* huge background word */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span
              className="select-none whitespace-nowrap text-[22vw] font-bold leading-none tracking-tighter text-paper/[0.10] sm:text-[18vw]"
              style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              nikal lo
            </span>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-paper/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-[280px] w-[280px] rounded-full bg-paper/15 blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto max-w-3xl text-center"
          >
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-paper/80">
              Zyada sochoge toh reh jaoge
            </p>
            <h2 className="text-5xl font-semibold leading-[1.0] tracking-[-0.025em] sm:text-6xl lg:text-7xl">
              Yeh app unke liye hai{" "}
              <em
                className="font-normal text-ink"
                style={{ fontFamily: "Georgia, serif" }}
              >
                jo bas nikalna chahte hain.
              </em>
            </h2>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={handleInstall}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-paper transition hover:-translate-y-0.5 sm:text-base"
              >
                <Download className="size-4" />
                {installLabel}
              </button>
              <a
                href="/feed"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-paper/70 px-7 py-4 text-sm font-semibold text-paper transition hover:bg-paper hover:text-coral-deep sm:text-base"
              >
                Scene dekho
                <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            <p className="mt-8 inline-block rotate-[-2deg] rounded-full bg-ink px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper">
              Free · Bas aa jao
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Wordmark tone="dark" />
          <nav className="flex items-center gap-6 text-sm text-ink/60">
            <a href="/terms" className="transition hover:text-coral-deep">
              Terms
            </a>
            <a href="/privacy" className="transition hover:text-coral-deep">
              Privacy
            </a>
            <a href="/safety" className="transition hover:text-coral-deep">
              Safety
            </a>
          </nav>
          <p className="text-xs text-ink/45">© 2026 Zipout</p>
        </div>
      </footer>
    </main>
  );
}

/* ---------- subcomponents ---------- */

const PlanCard = ({
  tilt,
  offset,
  image,
  time,
  title,
  meta,
}: {
  tilt: number;
  offset: string;
  image: string;
  time: string;
  title: string;
  meta: string;
}) => (
  <div
    className={`absolute ${offset} w-[88%] max-w-[360px] overflow-hidden rounded-2xl bg-paper shadow-[var(--shadow-soft)] ring-1 ring-ink/5 transition-transform`}
    style={{ transform: `rotate(${tilt}deg)` }}
  >
    <div className="relative h-32 w-full overflow-hidden">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink/80">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-coral" />
        {time}
      </span>
      <MapPin className="absolute right-3 top-3 size-4 text-paper drop-shadow" />
    </div>
    <div className="p-4 text-ink">
      <p className="text-base font-semibold leading-snug">{title}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-ink/60">
        <Users className="size-3.5" />
        {meta}
      </div>
    </div>
  </div>
);

const Step = ({
  num,
  tint,
  accent,
  icon,
  title,
  line,
  delay,
}: {
  num: string;
  tint: string;
  accent: string;
  icon: React.ReactNode;
  title: string;
  line: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.55, delay }}
    className={`group relative overflow-hidden rounded-3xl ${tint} p-8 ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]`}
  >
    <span
      className={`absolute right-6 top-6 text-xs font-semibold tracking-widest ${accent} opacity-60`}
    >
      {num}
    </span>
    <div
      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-paper ${accent} ring-1 ring-ink/5`}
    >
      {icon}
    </div>
    <h3 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h3>
    <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{line}</p>
  </motion.div>
);
