'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Settings, Share2, MessageCircle, Award, TrendingUp, Users, LogOut, ChevronLeft, Edit2 } from 'lucide-react'
import { TrustBadge } from '@/components/TrustBadge'
import { BottomNav } from '@/components/BottomNav'
import type { User } from '@/lib/types'

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isOwnProfile = params.id === 'me'

  useEffect(() => {
    // In a real app, fetch user data from API
    // For now, show mock data
    setUser({
      id: '1',
      name: 'Rahul Kumar',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
      instagram_handle: '@rahul.k',
      phone_verified: true,
      reliability_score: 94,
      total_joined: 12,
      total_attended: 10,
      created_at: new Date().toISOString()
    })
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-24">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-96 bg-gray-200 w-full"
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pb-24">
        <div className="text-6xl mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold"
        >
          Go Back
        </motion.button>
      </div>
    )
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between p-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <h2 className="text-lg font-bold text-gray-900">Profile</h2>
        {isOwnProfile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-4xl font-bold text-white">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">{user.name}</h1>
          {user.instagram_handle && (
            <p className="text-sm text-blue-600 font-medium mb-3">{user.instagram_handle}</p>
          )}

          <div className="flex justify-center mb-4">
            <TrustBadge score={user.reliability_score} />
          </div>

          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
            {user.phone_verified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-xs">
                ✓ Verified
              </span>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        {!isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-500 text-blue-600 font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Message
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share
            </motion.button>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.reliability_score}%</p>
            <p className="text-xs text-gray-600 font-medium">Reliable</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.total_joined}</p>
            <p className="text-xs text-gray-600 font-medium">Joined</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.total_attended}</p>
            <p className="text-xs text-gray-600 font-medium">Attended</p>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
          <p className="text-gray-700 leading-relaxed">
            A fun-loving explorer who enjoys hiking, food adventures, and meeting new people. Let's create memories together!
          </p>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {['Hiking', 'Food', 'Music', 'Travel', 'Photography'].map((interest, i) => (
              <span key={i} className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 border border-gray-300">
                {interest}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Reviews/Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">⭐ Reviews (8)</h3>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg p-3">
                <p className="text-sm text-gray-700">Great person to hang out with! Very reliable and fun. Would definitely join plans with them again.</p>
                <p className="text-xs text-gray-500 mt-2">- Priya S.</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Logout Button */}
        {isOwnProfile && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-3 rounded-xl border-2 border-red-500 text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
