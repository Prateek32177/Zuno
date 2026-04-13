'use client'

import { useEffect, useState } from 'react'
import { PlanCard } from '@/components/PlanCard'
import { BottomNav } from '@/components/BottomNav'
import type { Plan } from '@/lib/types'

export default function MyPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/favorites')
        const data = await response.json()
        setPlans(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch saved plans:', error)
        setPlans([])
      } finally {
        setLoading(false)
      }
    }

    fetchSaved()
  }, [])

  return (
    <div className="pb-24 pt-4">
      <div className="mx-auto max-w-2xl px-4 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Your Collection</p>
        <h1 className="text-3xl font-black tracking-tight mt-1">Saved Plans</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Plans you loved, all in one place</p>
      </div>

      <div className="mx-auto max-w-2xl px-4">
        {loading ? (
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl app-card border border-gray-200 dark:border-gray-700 h-72 animate-pulse" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 dark:border-gray-700 app-card p-12 text-center">
            <div className="text-5xl mb-4">💔</div>
            <p className="font-black text-xl">No saved plans yet</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Heart your favorite plans to build your collection.</p>
            <a
              href="/feed"
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-brand hover:shadow-brand-md transition-all hover:scale-105"
            >
              Explore Plans
            </a>
          </div>
        ) : (
          <div className="grid gap-4 pt-2">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
