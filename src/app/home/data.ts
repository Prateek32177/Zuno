export const cities = [
  { en: "Bangalore", deva: "बैंगलोर", tint: "forest", live: 37 },
  { en: "Mumbai", deva: "मुंबई", tint: "sea", live: 24 },
  { en: "Delhi", deva: "दिल्ली", tint: "mustard", live: 19 },
  { en: "Udaipur", deva: "उदयपुर", tint: "lake", live: 6 },
] as const;

export const rotatingWords = [
  "bike ride",
  "chai run",
  "sunset walk",
  "gig night",
  "food crawl",
  "lake side",
];

export const instantPlans = [
  {
    city: "Bangalore",
    deva: "बैंगलोर",
    tint: "forest",
    plans: [
      { time: "Tonight, 8pm", plan: "Indiranagar food crawl. 4 already in." },
      { time: "Tomorrow, 6am", plan: "Nandi Hills sunrise. 3 spots left." },
      { time: "This Sunday", plan: "Cubbon Park walk + filter coffee after." },
    ],
  },
  {
    city: "Mumbai",
    deva: "मुंबई",
    tint: "sea",
    plans: [
      { time: "Tonight, 7pm", plan: "Marine Drive walk. Just show up." },
      { time: "Saturday", plan: "Dharavi street food run. Serious eaters only." },
      { time: "Sunday 6am", plan: "Bandra–Worli cycling. Helmets on." },
    ],
  },
  {
    city: "Delhi",
    deva: "दिल्ली",
    tint: "mustard",
    plans: [
      { time: "Tonight, 9pm", plan: "Hauz Khas after dark. No plans, just vibes." },
      { time: "This Sunday", plan: "Lodi Garden morning walk. No agenda." },
      { time: "Saturday eve", plan: "Chandni Chowk food run. Bring appetite." },
    ],
  },
  {
    city: "Udaipur",
    deva: "उदयपुर",
    tint: "lake",
    plans: [
      { time: "Tonight", plan: "Lake Pichola sunset. Bring nothing but yourself." },
      { time: "Tomorrow 7am", plan: "Old city heritage walk. Chai included." },
      { time: "Sunday", plan: "Fateh Sagar cycling. Slow pace welcome." },
    ],
  },
] as const;

export const whyCards = [
  {
    label: "No planning paralysis",
    body: "Someone posts. You join. You show up. That's it. No 47-message group chat. No 'we'll plan next week.' Just tonight.",
  },
  {
    label: "Leave anytime",
    body: "No obligation. No awkward exits. If the vibe's off, you're out. Zero drama. Aao, baith ke nikal jaao — koi judgement nahi.",
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

export const feedPreviews = [
  {
    user: "Ananya",
    city: "Bangalore",
    post: "Anyone up for Indiranagar food crawl tonight? Starting 8pm, ending whenever.",
    tag: "Food",
    joiners: 4,
    tilt: -2.5,
  },
  {
    user: "Rohan",
    city: "Mumbai",
    post: "Bandra to Versova walk Saturday morning. Chai at the end. Easy pace, good talk.",
    tag: "Walk",
    joiners: 2,
    tilt: 1.8,
  },
  {
    user: "Priya",
    city: "Delhi",
    post: "Women-only art gallery visit this Sunday — National Museum. Reply if interested.",
    tag: "Women only",
    joiners: 6,
    tilt: -1.5,
  },
  {
    user: "Karan",
    city: "Udaipur",
    post: "Motorbike ride to Kumbhalgarh tomorrow. Early start, back by evening. 2 spots open.",
    tag: "Ride",
    joiners: 3,
    tilt: 2.2,
  },
  {
    user: "Meher",
    city: "Bangalore",
    post: "Late night chai + filter coffee debate at SLV. Show up by 11. No serious people pls.",
    tag: "Chai",
    joiners: 5,
    tilt: -2,
  },
  {
    user: "Aditya",
    city: "Mumbai",
    post: "Indie gig at G5A on Friday. Buying my own ticket, but who's coming? Khaana after.",
    tag: "Gig",
    joiners: 7,
    tilt: 1.4,
  },
];

export const vibes = [
  { emoji: "☕", label: "Chai runs", live: 12, color: "mustard" },
  { emoji: "🚬", label: "Sutta breaks", live: 8, color: "ink" },
  { emoji: "🏍️", label: "Bike rides", live: 5, color: "coral" },
  { emoji: "🌅", label: "Sunrise treks", live: 3, color: "coral-deep" },
  { emoji: "🎸", label: "Gig nights", live: 7, color: "forest" },
  { emoji: "🍜", label: "Food crawls", live: 14, color: "coral" },
  { emoji: "👯", label: "Women only", live: 9, color: "lake" },
  { emoji: "🎨", label: "Art / gallery", live: 4, color: "sea" },
] as const;

type VersusRow = { q: string; a: string; highlight?: boolean };
export const versus: VersusRow[] = [
  { q: "Instagram", a: "Good for watching others live. Not for actually going." },
  { q: "WhatsApp groups", a: "57 unread messages. Plan still not confirmed." },
  { q: "Event apps", a: "Planned 3 weeks ahead. You needed tonight." },
  { q: "Zipout", a: "Someone posts right now. You join right now. Tonight happens.", highlight: true },
];
