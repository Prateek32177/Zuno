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
    <div className="pb-24 pt-2">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-900">
        <div className="mx-auto max-w-2xl px-4 py-5">
          <h1 className="text-2xl font-bold mb-4">Explore</h1>

          {/* City & Search Row */}
          <div className="flex gap-2 mb-4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 app-card px-3 py-2 text-sm outline-none"
            >
              {INDIA_HIGH_POTENTIAL_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <div className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 app-card px-3 py-2 inline-flex items-center gap-2">
              <Search className="h-4 w-4 app-muted flex-shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Category Filter - Horizontal Scroll */}
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <div className="flex gap-2 min-w-min">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === null
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors inline-flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-var(--brand) text-white'
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                  style={selectedCategory === cat ? { backgroundColor: 'var(--brand)' } : {}}
                >
                  <CategoryIcon icon={CATEGORY_META[cat].icon} className="h-3 w-3" />
                  <span className="hidden sm:inline">{CATEGORY_META[cat].label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-3">
        {/* Next Plan */}
        {nextPlan && minutesToNext && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm">
            <p className="text-xs app-muted font-semibold mb-1">Next in {minutesToNext} min</p>
            <p className="font-semibold">{nextPlan.title}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg h-48 bg-gray-100 dark:bg-gray-900 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPlans.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-semibold mb-2">No plans in {selectedCity}</p>
            <p className="text-xs app-muted mb-6">Be the first to create one</p>
            <a
              href="/plans/create"
              className="inline-block rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-semibold"
            >
              Create Plan
            </a>
          </div>
        )}

        {/* Plans */}
        {!loading && filteredPlans.length > 0 && (
          <div className="space-y-3">
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
