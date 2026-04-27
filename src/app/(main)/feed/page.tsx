"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { PlanCard } from "@/components/PlanCard";
import { BottomNav } from "@/components/BottomNav";
import { Lock, Search, Plus, MapPin, X, SlidersHorizontal } from "lucide-react";
import type { Plan } from "@/lib/types";
import type { PlanCategory } from "@/lib/categories";
import { CATEGORY_META } from "@/lib/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useCity } from "@/components/CityContext";
import { normalizeCityKey, INDIA_HIGH_POTENTIAL_CITIES } from "@/lib/cities";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { SignInDialog } from "@/components/auth/SignInDialog";
import Link from "next/link";
import { computeEffectivePlanStatus } from "@/lib/plan";
import { PlanCardSkeleton } from "@/components/PlanCardSkeleton";
import { getCityCategories } from "@/lib/categories";

export default function FeedPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PlanCategory | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { selectedCity, setSelectedCity } = useCity();

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/plans", { cache: "no-store" });
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    createClient()
      .auth.getUser()
      .then(({ data }) => setIsAuthed(!!data.user));
  }, []);

  const filteredPlans = useMemo(
    () =>
      plans
        .filter((p) => p.visibility === "public")
        .filter((p) =>
          selectedCategory ? p.category === selectedCategory : true,
        )
        .filter(
          (p) => normalizeCityKey(p.city) === normalizeCityKey(selectedCity),
        )
        .filter((p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .filter((p) => computeEffectivePlanStatus(p as any) !== "expired")
        .sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime)),
    [plans, selectedCategory, selectedCity, searchQuery],
  );

  const visiblePlans = isAuthed ? filteredPlans : filteredPlans.slice(0, 5);
  const lockedCount = Math.max(filteredPlans.length - 5, 0);

  const toggleFavorite = async (plan: Plan) => {
    if (!isAuthed) return;
    const method = plan.is_favorite ? "DELETE" : "POST";
    setPlans((prev) =>
      prev.map((p) =>
        p.id === plan.id ? { ...p, is_favorite: !p.is_favorite } : p,
      ),
    );
    const res = await fetch(`/api/plans/${plan.id}/favorite`, { method });
    if (!res.ok)
      setPlans((prev) =>
        prev.map((p) =>
          p.id === plan.id ? { ...p, is_favorite: !!plan.is_favorite } : p,
        ),
      );
  };

  const activeCatCount = selectedCategory ? 1 : 0;
  const activeSearchCount = searchQuery ? 1 : 0;
  const filtersActive = activeCatCount + activeSearchCount;

  return (
    <div className="feed-root min-h-screen pb-28 bg-[#F7F2EC]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

        .feed-root { font-family: 'DM Sans', sans-serif; }
        .feed-serif { font-family: 'Sora', sans-serif; }

        /* Plan card shell */
        .plan-card {
          border: 1px solid rgba(42,31,26,0.07);
          box-shadow: 0 2px 12px rgba(42,31,26,0.06);
          transition: transform 0.2s cubic-bezier(0.34,1.1,0.64,1),
                      box-shadow 0.2s ease;
        }
        .plan-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(42,31,26,0.12);
        }
        .plan-card:active { transform: scale(0.985); }

        /* Plan title font */
        .plan-title { font-family: 'Sora', sans-serif; }

        /* Heart pop */
        @keyframes heartPop {
          0% { transform: scale(1); }
          40% { transform: scale(1.45); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .heart-pop { animation: heartPop 0.5s cubic-bezier(0.34,1.56,0.64,1); }

        /* Category chip */
        .cat-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 999px;
          font-size: 12px; font-weight: 500; cursor: pointer;
          white-space: nowrap; transition: all 0.15s;
          border: 1.5px solid transparent;
          font-family: 'DM Sans', sans-serif;
        }
        .cat-chip.all { background: #F0E8DF; color: #5C4A38; }
        .cat-chip.all.active { background: #2A1F1A; color: #F7EEE5; }
        .cat-chip.cat { background: #F0E8DF; color: #5C4A38; }
        .cat-chip.cat.active { background: #2A1F1A; color: #F7EEE5; }
        .cat-chip:hover:not(.active) { border-color: #C4A882; }

        /* Search input */
        .search-input {
          width: 100%; background: #EEE5DA;
          border: 1.5px solid transparent; border-radius: 14px;
          padding: 9px 14px 9px 40px;
          font-size: 13.5px; font-family: 'DM Sans', sans-serif;
          color: #2A1F1A; outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .search-input:focus { border-color: #C4856A; background: #E8DDD2; }
        .search-input::placeholder { color: #B8A898; }

        /* City pill */
        .city-pill {
          display: inline-flex; align-items: center; gap: 5px;
          background: #EEE5DA; border-radius: 999px;
          padding: 6px 12px; font-size: 12.5px;
          font-weight: 600; color: #5C4A38; cursor: pointer;
          border: 1.5px solid transparent;
          transition: border-color 0.12s;
        }
        .city-pill:hover { border-color: #C4856A; }

        /* Greeting */
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .greet-anim { animation: fadeSlideDown 0.4s ease both; }

        /* Card stagger */
        .card-item { animation: fadeSlideUp 0.35s ease both; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Lock gate */
        .lock-gate {
          background: linear-gradient(to top, #F7F2EC 40%, transparent);
          pointer-events: none;
        }

        /* Create FAB */
        .create-fab {
          display: flex; align-items: center; gap: 8px;
          background: #2A1F1A; color: #F7EEE5;
          border-radius: 999px; padding: 13px 20px;
          font-size: 13.5px; font-weight: 700;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 8px 24px rgba(42,31,26,0.30);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .create-fab:hover { transform: translateY(-1px); box-shadow: 0 12px 28px rgba(42,31,26,0.35); }
        .create-fab:active { transform: scale(0.97); }

        /* City picker backdrop */
        .city-backdrop {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
          display: flex; align-items: flex-end; justify-content: center;
          padding: 16px;
        }
        .city-sheet {
          width: 100%; max-width: 448px; background: white;
          border-radius: 24px; max-height: 70vh;
          overflow-y: auto; padding-bottom: 8px;
        }

        /* Skeleton shimmer */
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #EAE0D5 0%, #F3EDE6 50%, #EAE0D5 100%);
          background-size: 800px 100%;
          animation: shimmer 1.4s ease infinite;
        }

        /* Scrollbar hide */
        .noscroll::-webkit-scrollbar { display: none; }
        .noscroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* Stat pill */
        .stat-pill {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.8); border-radius: 999px;
          padding: 5px 12px; font-size: 11.5px; font-weight: 600;
          color: #5C4A38; backdrop-filter: blur(6px);
          border: 1px solid rgba(196,133,106,0.2);
        }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-30 bg-[#F7F2EC]/95 backdrop-blur-sm">
        {/* Top bar */}
        <div className="mx-auto max-w-md px-4 pt-5 pb-2">
          <div className="greet-anim">
            <h1 className=" text-[18px] font-semibold text-[#1A1410] tracking-tight leading-tight">
              Something’s up outside
            </h1>
            <p className="mt-1 text-[13px] text-[#7A6A64]">
              Find something or jump in
            </p>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8917E]" />
            <input
              type="text"
              placeholder="Search plans, vibes, places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-5 rounded-full bg-[#C4B5A5] flex items-center justify-center"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Category row */}
        <div className="border-b border-[#EAE0D5]">
          <div className="mx-auto max-w-md px-4 py-3">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`cat-chip all flex-shrink-0 ${selectedCategory === null ? "active" : ""}`}
              >
                All plans
              </button>
              {getCityCategories(selectedCity).map((cat) => (
                <button
                  key={cat.category}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.category ? null : cat.category,
                    )
                  }
                  className={`cat-chip cat flex-shrink-0 ${
                    selectedCategory === cat.category ? "active" : ""
                  }`}
                >
                  <CategoryIcon
                    icon={CATEGORY_META[cat.category].icon}
                    className="h-3.5 w-3.5"
                  />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FEED BODY ── */}
      <div className="mx-auto max-w-md px-4 pt-5">
        {/* Results context */}
        {!loading && filteredPlans.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            {filtersActive > 0 && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="text-[12px] text-[#C4856A] font-semibold"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Skeleton loading */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        ) : visiblePlans.length === 0 ? (
          <EmptyState
            isAuthed={isAuthed}
            hasFilters={filtersActive > 0}
            onClear={() => {
              setSelectedCategory(null);
              setSearchQuery("");
            }}
            onAuth={() => setShowAuthDialog(true)}
            city={selectedCity}
          />
        ) : (
          <div className="space-y-4">
            {visiblePlans.map((plan, i) => (
              <div
                key={plan.id}
                className="card-item"
                style={{ animationDelay: `${Math.min(i * 0.06, 0.3)}s` }}
              >
                <PlanCard
                  plan={plan}
                  onToggleFavorite={() => toggleFavorite(plan)}
                  isAuthed={isAuthed}
                />
              </div>
            ))}
          </div>
        )}

        {/* Auth gate */}
        {!isAuthed && filteredPlans.length > 5 && (
          <div className="relative -mt-12">
            <div className="lock-gate h-32 w-full pointer-events-none" />
            <div className="relative flex flex-col items-center pb-4 bg-[#F7F2EC]">
              <p className="text-[12.5px] text-[#9A8880] mb-3">
                {lockedCount} more plans waiting for you
              </p>
              <button
                onClick={() => setShowAuthDialog(true)}
                className="inline-flex items-center gap-2 bg-[#2A1F1A] text-[#F7EEE5] rounded-full px-6 py-3 text-[13px] font-bold shadow-lg"
              >
                <Lock className="h-4 w-4" />
                Unlock {lockedCount} plans
              </button>
            </div>
          </div>
        )}

        <div className="h-6" />
      </div>

      <SignInDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        nextPath="/feed"
      />
      {isAuthed && <BottomNav />}

      <Suspense fallback={null}>
        <SearchParamHandler onSignin={() => setShowAuthDialog(true)} />
      </Suspense>
    </div>
  );
}

function EmptyState({
  isAuthed,
  hasFilters,
  onClear,
  onAuth,
  city,
}: {
  isAuthed: boolean;
  hasFilters: boolean;
  onClear: () => void;
  onAuth: () => void;
  city: string;
}) {
  return (
    <div className="py-16 flex flex-col items-center text-center px-4">
      <div className="h-16 w-16 rounded-full bg-[#EEE5DA] flex items-center justify-center mb-4">
        <MapPin className="h-7 w-7 text-[#C4856A]" />
      </div>
      <p className="feed-serif font-bold text-[#2A1F1A] text-[17px]">
        {hasFilters ? "No matches" : `Nothing in ${city} yet`}
      </p>
      <p className="text-[13px] text-[#9A8880] mt-2 max-w-[240px] leading-relaxed">
        {hasFilters
          ? "Try a different category or clear your search."
          : "Be the first to create a plan here and bring people together."}
      </p>
      <div className="mt-5 flex gap-2 flex-wrap justify-center">
        {hasFilters && (
          <button
            onClick={onClear}
            className="rounded-full border-2 border-[#DDD5CB] px-4 py-2 text-[12px] font-semibold text-[#5C4A38]"
          >
            Clear filters
          </button>
        )}
        {isAuthed ? (
          <Link
            href="/plans/create"
            className="inline-flex rounded-full bg-[#2A1F1A] px-4 py-2 text-[12px] font-bold text-white"
          >
            Create a plan
          </Link>
        ) : (
          <button
            onClick={onAuth}
            className="rounded-full bg-[#2A1F1A] px-4 py-2 text-[12px] font-bold text-white"
          >
            Join and create
          </button>
        )}
      </div>
    </div>
  );
}

function SearchParamHandler({ onSignin }: { onSignin: () => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (
      searchParams.get("auth") === "required" ||
      searchParams.get("signin") === "1"
    ) {
      onSignin();
    }
  }, [searchParams, onSignin]);
  return null;
}
