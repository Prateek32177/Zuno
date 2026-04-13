'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PlanCard } from '@/components/PlanCard'
import { BottomNav } from '@/components/BottomNav'
import { Heart, CalendarOff, Clock } from 'lucide-react'
import type { Plan } from '@/lib/types'

export default function MyPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'hosting'>('upcoming')

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        // This would fetch user's plans from API
        // const response = await fetch('/api/my-plans?filter=' + filter)
        // if (!response.ok) throw new Error('Failed to fetch plans')
        // const data = await response.json()
        // const plansArray = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : [])
        // setPlans(plansArray)
        setPlans([]) // Empty state for now
      } catch (error) {
        console.error('Failed to fetch plans:', error)
        setPlans([]) // Fallback to empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [filter])

  const filters = [
    { id: 'upcoming', label: '📅 Upcoming', icon: Clock },
    { id: 'past', label: '✓ Past', icon: CalendarOff },
    { id: 'hosting', label: '🎯 Hosting', icon: Heart },
  ]

  return (
    <div className="pb-24 pt-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Plans
          </h1>
          <p className="text-gray-600">Track your planned activities and memories</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-72 bg-gray-200 rounded-2xl"
              />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No plans yet</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'hosting' ? 'Create your first plan' : 'Join some plans'}
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={filter === 'hosting' ? '/plans/create' : '/feed'}
              className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-shadow"
            >
              {filter === 'hosting' ? '✨ Create Plan' : '🔍 Discover Plans'}
            </motion.a>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-4"
          >
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
