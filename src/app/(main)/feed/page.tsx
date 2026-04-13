'use client'

import { useEffect, useState } from 'react'
import { PlanCard } from '@/components/PlanCard'
import { BottomNav } from '@/components/BottomNav'
import { motion } from 'framer-motion'
import { Search, Flame } from 'lucide-react'
import type { Plan } from '@/lib/types'

export default function FeedPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/plans')
        if (!response.ok) throw new Error(`API error: ${response.status}`)
        const data = await response.json()
        // Ensure data is always an array
        const plansArray = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : [])
        setPlans(plansArray)
      } catch (error) {
        console.error('Failed to fetch plans:', error)
        setPlans([]) // Fallback to empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const categories = ['hiking', 'food', 'music', 'cycling', 'art', 'travel', 'sports', 'other']
  // Ensure plans is always an array before filtering
  const plansArray = Array.isArray(plans) ? plans : []
  const filteredPlans = selectedCategory
    ? plansArray.filter(p => p.category === selectedCategory)
    : plansArray

  return (
    <div className="pb-24 pt-2">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-6 h-6 text-orange-500" />
              </motion.div>
              <h1 className="text-2xl font-black text-gray-900">Discover</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>

          {/* Category Filter */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 pb-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full font-semibold text-xs whitespace-nowrap transition-all ${
                  selectedCategory === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </motion.button>
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-semibold text-xs whitespace-nowrap transition-all capitalize ${
                    selectedCategory === cat
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-72 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"
              />
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No plans found</h3>
            <p className="text-sm text-gray-600 mb-6">Try another category or create the first plan</p>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/plans/create"
              className="inline-block bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Create Plan
            </motion.a>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-4"
          >
            {filteredPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
