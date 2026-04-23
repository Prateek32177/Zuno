"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const instantPlans = [
  {
    city: "Bangalore",
    plans: [
      { time: "Tonight, 8pm", plan: "Indiranagar food crawl. 4 already in." },
      { time: "Tomorrow, 6am", plan: "Nandi Hills sunrise. 3 spots left." },
      { time: "This Sunday", plan: "Cubbon Park walk + filter coffee after." },
    ],
  },
  {
    city: "Mumbai",
    plans: [
      { time: "Tonight, 7pm", plan: "Marine Drive walk. Just show up." },
      { time: "Saturday", plan: "Dharavi street food run. Serious eaters only." },
      { time: "Sunday 6am", plan: "Bandra-Worli cycling. Helmets on." },
    ],
  },
  {
    city: "Delhi",
    plans: [
      { time: "Tonight, 9pm", plan: "Hauz Khas after dark. No plans, just vibes." },
      { time: "This Sunday", plan: "Lodi Garden morning walk. No agenda." },
      { time: "Saturday eve", plan: "Chandni Chowk food run. Bring appetite." },
    ],
  },
  {
    city: "Udaipur",
    plans: [
      { time: "Tonight", plan: "Lake Pichola sunset. Bring nothing but yourself." },
      { time: "Tomorrow 7am", plan: "Old city heritage walk. Chai included." },
      { time: "Sunday", plan: "Fateh Sagar cycling. Slow pace welcome." },
    ],
  },
];

const whyCards = [
  {
    label: "No planning paralysis",
    body: "Someone posts. You join. You show up. That's it. No 47-message group chat. No 'we'll plan next week.' Just tonight.",
  },
  {
    label: "Leave anytime",
    body: "No obligation. No awkward exits. If the vibe's off, you're out. Zero drama. Come as you are, stay as long as you want.",
  },
  {
    label: "Women-only plans",
    body: "Any woman can make her plan women-only. No mixed groups unless she says so. Your comfort, your call.",
  },
  {
    label: "Private or open",
    body: "Got a crew? Invite-only. Want to meet randoms with your energy? Open plan. You control who shows up.",
  },
  {
    label: "Ekdum free",
    body: "Koi subscription nahi. Koi hidden charges nahi. The only thing you spend is your time — and that's the whole point.",
  },
  {
    label: "Real people, real plans",
    body: "Not influencers. Not bots. Just someone in your city who woke up and thought — aaj kuch karna chahta hoon. Same as you.",
  },
];

const feedPreviews = [
  {
    user: "Ananya, Bangalore",
    post: "Anyone up for Indiranagar food crawl tonight? Starting 8pm, ending whenever. 4 people already in.",
    tag: "Food",
    joiners: 4,
  },
  {
    user: "Rohan, Mumbai",
    post: "Bandra to Versova walk Saturday morning. Chai at the end. Easy pace, good conversation.",
    tag: "Walk",
    joiners: 2,
  },
  {
    user: "Priya, Delhi",
    post: "Women-only art gallery visit this Sunday — National Museum. Anyone interested just reply.",
    tag: "Women only",
    joiners: 6,
  },
  {
    user: "Karan, Udaipur",
    post: "Motorbike ride to Kumbhalgarh tomorrow. Early start, back by evening. 2 spots open.",
    tag: "Ride",
    joiners: 3,
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen text-[#1a1208] overflow-hidden"
      style={{ backgroundColor: "#f9f5ee", fontFamily: "'Georgia', serif" }}
    >
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-5 sm:px-8 py-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1600&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
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
            <span style={{ fontStyle: "italic" }}>Bike ride ?</span>
          </h1>

          <p
            className="mt-6 text-base sm:text-xl text-white/80 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'system-ui', sans-serif", fontWeight: 300 }}
          >
            Someone in your city just posted — lake view tonight, anyone?
            Food crawl at 8, 3 spots left. Bike ride Sunday, just show up.
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
              href="/create"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm sm:text-base text-white/80 border border-white/30 transition-all duration-300 hover:border-white/70 hover:text-white w-full sm:w-auto justify-center"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            >
              Post your own plan
            </a>
          </div>

          <p
            className="mt-8 text-xs  tracking-widest uppercase"
            style={{ fontFamily: "'system-ui', sans-serif" }}
          >
            Bangalore · Mumbai · Delhi · Udaipur
          </p>
        </motion.div>
      </section>

      {/* The Real Thing */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p
              className="text-3xl sm:text-2xl md:text-4xl text-[#1a1208] leading-tight"
              style={{ fontWeight: 300 }}
            >
             You’re not looking for a plan.
              <br />
              <span style={{ fontStyle: "italic", color: "#a07860" }}>
               You’re looking for people to make it real.
              </span>
            </p>

            <p
              className="mt-7 text-base sm:text-lg text-[#5a4a3a] leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: "'system-ui', sans-serif", fontWeight: 400 }}
            >
              Zipout is not a ticketing app. Not an event page. No performers,
              no sponsors, no curated experience.
              <br />
              <br />
              It is just people — in Bangalore, Mumbai, Delhi, Udaipur — waking
              up and saying{" "}
              <em>aaj kuch crazy karte hai</em>. And other people saying yes.
              <br />
              <br />
              You post a plan. Whoever wants in, joins. You all show up.
              Something real happens.
            </p>
          </motion.div>

          {/* Vs others */}
          <div className="bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden">
            <div className="px-6 sm:px-8 py-4 border-b border-[#e8ddd0]">
              <p
                className="text-xs text-[#8a7060] uppercase tracking-widest"
                style={{ fontFamily: "'system-ui', sans-serif" }}
              >
                Why not Instagram / WhatsApp / Meetup
              </p>
            </div>
            {[
              {
                q: "Instagram",
                a: "Good for watching others live. Not for actually going.",
              },
              {
                q: "WhatsApp groups",
                a: "57 unread messages. Plan still not confirmed.",
              },
              {
                q: "Event apps",
                a: "Planned 3 weeks ahead. You need tonight.",
              },
              {
                q: "Zipout",
                a: "Someone posts right now. You join right now. Tonight happens.",
                highlight: true,
              },
            ].map((row, i) => (
              <div
                key={i}
                className="px-6 sm:px-8 py-4 border-b border-[#e8ddd0] last:border-0 flex items-start gap-4"
                style={{
                  backgroundColor: row.highlight ? "#fff8f4" : "transparent",
                }}
              >
                <span
                  className="text-sm font-medium min-w-[90px] sm:min-w-[110px] pt-0.5 flex-shrink-0"
                  style={{
                    fontFamily: "'system-ui', sans-serif",
                    color: row.highlight ? "#FF5A3C" : "#8a7060",
                  }}
                >
                  {row.q}
                </span>
                <span
                  className="text-sm text-[#3a2e26] leading-relaxed"
                  style={{ fontFamily: "'system-ui', sans-serif" }}
                >
                  {row.a}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live feed preview */}
      <section className="px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p
              className="text-2xl sm:text-3xl text-[#1a1208]"
              style={{ fontWeight: 300 }}
            >
              What is actually on right now
            </p>
            <p
              className="mt-2 text-sm text-[#8a7060]"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            >
              Real plans. Real people. Posted today.
            </p>
          </div>

          <div className="space-y-3">
            {feedPreviews.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-[#e8ddd0] px-5 sm:px-6 py-4 sm:py-5 flex items-start gap-4"
              >
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium text-white mt-0.5"
                  style={{
                    backgroundColor: "#FF5A3C",
                    fontFamily: "'system-ui', sans-serif",
                  }}
                >
                  {item.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className="text-xs text-[#8a7060]"
                      style={{ fontFamily: "'system-ui', sans-serif" }}
                    >
                      {item.user}
                    </span>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full"
                      style={{
                        fontFamily: "'system-ui', sans-serif",
                        backgroundColor:
                          item.tag === "Women only" ? "#fce7f0" : "#f0ebe3",
                        color:
                          item.tag === "Women only" ? "#b03060" : "#6a5040",
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <p
                    className="text-sm sm:text-base text-[#1a1208] leading-snug"
                    style={{ fontFamily: "'system-ui', sans-serif" }}
                  >
                    {item.post}
                  </p>
                  <p
                    className="mt-2 text-xs text-[#a08070]"
                    style={{ fontFamily: "'system-ui', sans-serif" }}
                  >
                    {item.joiners} joined already
                  </p>
                </div>
                <button
                  className="flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 hover:scale-[1.04]"
                  style={{
                    fontFamily: "'system-ui', sans-serif",
                    borderColor: "#FF5A3C",
                    color: "#FF5A3C",
                    backgroundColor: "transparent",
                  }}
                >
                  Join
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href="/feed"
              className="inline-flex items-center gap-2 text-sm text-[#FF5A3C] transition-opacity hover:opacity-70"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            >
              See all plans in your city
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* City plans */}
      <section className="px-5 sm:px-8 pb-20 sm:pb-28 bg-white">
        <div className="max-w-5xl mx-auto pt-16 sm:pt-20">
          <div className="text-center mb-12">
            <p
              className="text-2xl sm:text-3xl text-[#1a1208]"
              style={{ fontWeight: 300 }}
            >
              Your city, right now
            </p>
            <p
              className="mt-2 text-sm text-[#8a7060]"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            >
              The kind of plans people actually want to go for.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {instantPlans.map((city, ci) => (
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.08 }}
                className="rounded-2xl border border-[#e8ddd0] overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b border-[#e8ddd0] bg-[#faf6ef]">
                  <p
                    className="text-xs text-[#8a7060] uppercase tracking-widest"
                    style={{ fontFamily: "'system-ui', sans-serif" }}
                  >
                    {city.city}
                  </p>
                </div>
                <div className="divide-y divide-[#f0e8df] bg-white">
                  {city.plans.map((p, pi) => (
                    <div key={pi} className="px-5 py-4 flex items-start gap-3">
                      <span
                        className="text-xs text-[#a08070] min-w-[80px] pt-0.5 leading-snug flex-shrink-0"
                        style={{ fontFamily: "'system-ui', sans-serif" }}
                      >
                        {p.time}
                      </span>
                      <span
                        className="text-sm text-[#1a1208] leading-snug"
                        style={{ fontFamily: "'system-ui', sans-serif" }}
                      >
                        {p.plan}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Zipout */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-2xl sm:text-3xl text-[#1a1208]"
              style={{ fontWeight: 300 }}
            >
              How it actually works
            </p>
            <p
              className="mt-2 text-sm text-[#8a7060]"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            >
              No rules. No pressure. Just the stuff worth saying out loud.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {whyCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-[#e8ddd0] px-5 sm:px-6 py-5 sm:py-6"
              >
                <p
                  className="text-sm font-medium text-[#1a1208] mb-2"
                  style={{ fontFamily: "'system-ui', sans-serif" }}
                >
                  {card.label}
                </p>
                <p
                  className="text-sm text-[#5a4a3a] leading-relaxed"
                  style={{ fontFamily: "'system-ui', sans-serif" }}
                >
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 sm:px-8 pb-24 sm:pb-32">
        
        <div className="max-w-3xl mx-auto">
          
        <div className="max-w-4xl mx-auto rounded-[32px] bg-white p-10 md:p-16 text-center shadow-xl border border-[#efe7dc]">
            


            <p
              className="text-2xl sm:text-3xl md:text-4xl  leading-snug"
              style={{ fontWeight: 300 }}
            >
              Yeh app unke liye hai
              <br />
              <span style={{ fontStyle: "italic", color: "#a0877a" }}>
                jo bas nikalna chahte hain.
              </span>
            </p>

            <p
              className="mt-6 text-sm sm:text-base text-[#65584d]max-w-xl mx-auto leading-relaxed"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            >
              No performance. No filters. You are not here to impress anyone.
              You are here because your city has more to offer than your apartment
              ceiling — and you already know that.
              <br />
              <br />
              New city, no friends yet? Post a plan. Introverted but restless?
              Just join one. Already have a crew but want new people in the mix?
              Open plan, done.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/feed"
                className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm text-white font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] w-full sm:w-auto justify-center"
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
                Dekho kya chal raha hai
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="/create"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm  border  transition-all duration-300  w-full sm:w-auto justify-center"
                style={{ fontFamily: "'system-ui', sans-serif" }}
              >
                Ya apna plan daalo
              </a>
            </div>

            <p
              className="mt-6 text-xs text-white/35 tracking-wide"
              style={{ fontFamily: "'system-ui', sans-serif" }}
            >
              Free.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8ddd0] bg-white px-5 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-sm text-[#8a7060]"
            style={{ fontFamily: "'system-ui', sans-serif" }}
          >
            © {new Date().getFullYear()} Zipout
          </p>
          <div
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#8a7060]"
            style={{ fontFamily: "'system-ui', sans-serif" }}
          >
            <a href="/terms" className="hover:text-[#1a1208] transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-[#1a1208] transition-colors">Privacy</a>
            <a href="/safety" className="hover:text-[#1a1208] transition-colors">Safety</a>
            <a href="mailto:team.zipout@gmail.com" className="hover:text-[#1a1208] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}