'use client'

import { useEffect, useMemo, useState } from 'react'
import { PlanCard } from '@/components/PlanCard'
import { BottomNav } from '@/components/BottomNav'
import { Search, Clock3, MapPin } from 'lucide-react'
import type { Plan, PlanCategory } from '@/lib/types'
import { CATEGORY_META } from '@/lib/categories'
import { CategoryIcon } from '@/components/CategoryIcon'
import { DEFAULT_LAUNCH_CITY, INDIA_HIGH_POTENTIAL_CITIES } from '@/lib/cities'

export default function FeedPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<PlanCategory | null>(null)
  const [selectedCity, setSelectedCity] = useState<string>(DEFAULT_LAUNCH_CITY)
  const [query, setQuery] = useState('')

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/plans')
      const data = await response.json()
      setPlans(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch plans:', error)
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const categories = Object.keys(CATEGORY_META) as PlanCategory[]

  const filteredPlans = useMemo(
    () =>
      plans
        .filter((p) => (selectedCategory ? p.category === selectedCategory : true))
        .filter((p) => {
          const city = (p.city || '').toLowerCase().trim()
          const target = selectedCity.toLowerCase()
          return city === target
        })
        .filter((p) => {
          const hay = `${p.title} ${p.description || ''} ${p.location_name}`.toLowerCase()
          return hay.includes(query.toLowerCase())
        })
        .sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime)),
    [plans, selectedCategory, selectedCity, query]
  )

  const nextPlan = filteredPlans.find((p) => +new Date(p.datetime) > Date.now())
  const minutesToNext = nextPlan ? Math.max(1, Math.round((+new Date(nextPlan.datetime) - Date.now()) / 60000)) : null

  const toggleFavorite = async (plan: Plan) => {
    const method = plan.is_favorite ? 'DELETE' : 'POST'
    const res = await fetch(`/api/plans/${plan.id}/favorite`, { method })
    if (res.ok) {
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, is_favorite: !p.is_favorite } : p)))
    }
  }

  return (
    <div className="pb-24 pt-3">
      {/* Header Section */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="mx-auto max-w-2xl px-4 py-4 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Zuno Discover</p>
            <h1 className="text-3xl font-black tracking-tight">Explore Plans</h1>
          </div>

          {/* City & Search Row */}
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 app-card px-3.5 py-2.5 inline-flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-blue-400/50">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold outline-none"
              >
                {INDIA_HIGH_POTENTIAL_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 app-card px-3.5 py-2.5 inline-flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-blue-400/50">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search plans..."
                className="w-full bg-transparent text-sm outline-none placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2 min-w-min">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-brand ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'app-card border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                All Activities
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all inline-flex items-center gap-2 shadow-brand ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white'
                      : 'app-card border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <CategoryIcon icon={CATEGORY_META[cat].icon} className="h-4 w-4" />
                  {CATEGORY_META[cat].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
        {/* Next Plan Alert */}
        {nextPlan && minutesToNext && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-800/50 p-4 shadow-brand">
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-20" />
                <Clock3 className="h-5 w-5 text-blue-600 dark:text-blue-400 relative z-10" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Happening Next</p>
                <p className="text-base font-black mt-1">{nextPlan.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Starts in {minutesToNext} minutes</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl app-card border border-gray-200 dark:border-gray-700 h-72 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPlans.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-6 text-5xl">🏜️</div>
            <h3 className="text-xl font-black mb-2">No plans yet in {selectedCity}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs mx-auto">
              Be the first to create an amazing plan and invite your friends!
            </p>
            <a
              href="/plans/create"
              className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-brand hover:shadow-brand-md transition-all hover:scale-105"
            >
              Create First Plan
            </a>
          </div>
        )}

        {/* Plans Grid */}
        {!loading && filteredPlans.length > 0 && (
          <div className="grid gap-4 pt-2">
            {filteredPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onToggleFavorite={() => toggleFavorite(plan)} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
