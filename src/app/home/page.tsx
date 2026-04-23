"use client";

import { motion } from "framer-motion";

const vibeCards = [
  {
    title: "Sunrise Plans ☀️",
    text: "Wanna come for sunrise tomorrow? Coffee after, maybe silence first.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Run Club Energy 🏃",
    text: "Morning runs feel easier when someone says let’s go together.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Weekend Hikes ⛰️",
    text: "That one hike you keep planning? Someone else is waiting for it too.",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Food Crawls 🍜",
    text: "Street food tastes better when laughter is part of the menu.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Cricket Turf Nights 🏏",
    text: "One message. One turf booking. Suddenly, a memory is made.",
    image:
      "https://images.unsplash.com/photo-1761757107088-9089fe9ad094?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Pickleball & New People 🎾",
    text: "Some friendships begin with: Anyone up for a game?",
    image:
      "https://images.unsplash.com/photo-1665855031742-a87f5964adf1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf6ef] text-[#2f241d] overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1600&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-[#faf6ef]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <img
              src="/android-chrome-192x192.png"
              alt="Zipout"
              className="w-12 h-12 object-contain"
            />
            <p className="text-white text-2xl md:text-3xl font-medium tracking-tight">
              Zipout
            </p>
          </div>

          <p className="text-white/90 text-sm mb-8 font-light flex items-center gap-2 justify-center">
            Discover plans. Meet people. Create memories
            <span className="text-white text-base">♡</span>
          </p>
          <h1 className="text-4xl md:text-7xl font-light text-white leading-tight">
            Plans feel beautiful.
            <br />
            The right people make them unforgettable.
          </h1>

          <p className="mt-8 text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed font-light">
            A sunrise, a run club, a food crawl, a late-night cricket turf, a
            weekend hike — most plans stay in our heads because we don’t have
            the right people. Zipout helps you find them.
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href="/feed"
              className="group inline-flex items-center gap-3 rounded-full px-8 py-5 text-base font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 shadow-lg"
            >
              Explore Plans or Create Yours
              <span className="text-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                ↗
              </span>
            </a>
          </div>

          <p className="mt-8  text-sm">
            Coming soon to Bengaluru • Mumbai • Delhi • Udaipur ✨
          </p>
        </motion.div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-3xl md:text-5xl leading-tight font-light">
            We all have plans we never do.
            <br />
            Not because we don’t want to.
            <br />
            Because beautiful moments feel incomplete alone.
          </p>

          <p className="mt-8 text-lg text-[#5f5148] max-w-2xl mx-auto leading-relaxed">
            The best memories rarely come from perfect planning. They begin when
            someone simply says, “I’m in.”
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vibeCards.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-3xl overflow-hidden bg-white shadow-lg border border-white/60"
              >
                <div
                  className="h-56"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <div className="p-6">
                  <h3 className="text-xl font-medium">{item.title}</h3>
                  <p className="mt-3 text-sm text-[#6b5d52] leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="max-w-4xl mx-auto rounded-[32px] bg-white p-10 md:p-16 text-center shadow-xl border border-[#efe7dc]">
          <h2 className="text-4xl md:text-5xl font-light leading-tight">
            Life feels lighter
            <br />
            when plans become real.
          </h2>

          <p className="mt-6 text-lg text-[#65584d] max-w-2xl mx-auto leading-relaxed">
            Stop waiting for the perfect group. Find your people. Join the
            moment. Explore something new every day.
          </p>

          <a
            href="/feed"
            className="inline-flex items-center gap-3 mt-8 rounded-full px-10 py-6 text-base bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300"
          >
            Explore Plans
            <span>↗</span>
          </a>
        </div>
      </section>

      <footer className="border-t border-[#efe7dc] bg-white/80 backdrop-blur-sm px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6b5d52]">
            © {new Date().getFullYear()} Zipout
          </p>

          <div className="flex items-center gap-6 text-sm text-[#6b5d52]">
            <a href="/terms" className="hover:text-black transition-colors">
              Terms
            </a>
            <a href="/privacy" className="hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="/safety" className="hover:text-black transition-colors">
              Safety Guidelines
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
