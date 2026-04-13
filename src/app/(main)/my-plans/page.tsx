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
    <div className="pb-24 pt-3">
      <div className="mx-auto max-w-2xl px-4 mb-5">
        <h1 className="text-2xl font-bold">Saved</h1>
      </div>

      <div className="mx-auto max-w-2xl px-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg h-48 bg-gray-100 dark:bg-gray-900 animate-pulse" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-semibold mb-2">No saved plans</p>
            <p className="text-xs app-muted mb-6">Heart plans to save them here</p>
            <a
              href="/feed"
              className="inline-block rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-semibold"
            >
              Explore Plans
            </a>
          </div>
        ) : (
          <div className="space-y-3">
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
