export const Footer = () => {
  return (
    <footer className="border-t border-ink/10 bg-paper py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="font-serif-display text-5xl leading-none text-ink">
            Zipout<span className="text-coral">.</span>
          </div>
          <div className="mt-3 font-deva text-2xl text-ink/70">ज़िपआउट</div>
          <p className="mt-4 max-w-xs font-mono text-xs leading-relaxed text-ink/55">
            Made with chai (and a little chaos) in India. Bangalore · Mumbai · Delhi · Udaipur.
          </p>
        </div>
        <div>
          <div className="label-eyebrow mb-4">The app</div>
          <ul className="space-y-2 font-mono text-sm text-ink/75">
            <li><a href="/feed" className="hover:text-coral-deep">Live feed</a></li>
            <li><a href="/plans/create" className="hover:text-coral-deep">Post a plan</a></li>
          </ul>
        </div>
        <div>
          <div className="label-eyebrow mb-4">The fine print</div>
          <ul className="space-y-2 font-mono text-sm text-ink/75">
            <li><a href="/terms" className="hover:text-coral-deep">Terms</a></li>
            <li><a href="/privacy" className="hover:text-coral-deep">Privacy</a></li>
            <li><a href="/safety" className="hover:text-coral-deep">Safety</a></li>
            <li><a href="mailto:team.zipout@gmail.com" className="hover:text-coral-deep">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-start justify-between gap-2 border-t border-ink/10 px-6 pt-6 font-mono text-[11px] uppercase tracking-widest text-ink/50 sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} Zipout — open plans, real people.</span>
        <span className="text-coral">⚡ aaj kuch crazy karte hai</span>
      </div>
    </footer>
  );
};