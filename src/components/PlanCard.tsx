import Image from 'next/image'
import Link from 'next/link'
import { Plan } from '@/lib/types'
import { TrustBadge } from './TrustBadge'
import { AvatarStack } from './AvatarStack'
import { MapPin, Users, Calendar, Clock, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function PlanCard({ plan }: { plan: Plan }) {
  if (!plan) return null
  
  const participantCount = plan.participant_count || plan.participants?.length || 0
  const spotsLeft = Math.max(0, (plan.max_people || 10) - participantCount)
  const isFull = spotsLeft === 0

  const planDate = plan.datetime ? new Date(plan.datetime) : new Date()
  const dateStr = planDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const timeStr = planDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/plans/${plan.id}`} className="block overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Image Section */}
        <div className="relative h-40 w-full bg-gradient-to-br from-blue-400 to-purple-400 overflow-hidden">
          <Image 
            src={plan.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800'} 
            alt={plan.title} 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-500" 
            sizes="(max-width: 390px) 100vw, 390px" 
          />

          {/* Overlay with badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 rounded-md text-xs font-semibold bg-white/95 text-gray-900 capitalize">
              {plan.category}
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            {isFull ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-red-500/90 text-white">
                <AlertCircle className="w-3 h-3" />
                Full
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-green-500/90 text-white">
                <CheckCircle2 className="w-3 h-3" />
                {spotsLeft} spots
              </div>
            )}
          </div>

          {/* Women Only Badge */}
          {plan.female_only && (
            <div className="absolute bottom-2 left-2">
              <span className="px-2 py-1 rounded-md text-xs font-semibold bg-pink-500 text-white flex items-center gap-1">
                <Users className="w-3 h-3" /> Women
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight">
            {plan.title}
          </h3>

          {/* Host Info */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">{plan.host?.name || 'Host'}</span>
            <TrustBadge score={plan.host?.reliability_score ?? 100} />
          </div>

          {/* Location & Time */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-1">{plan.location_name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span>{dateStr}</span>
              <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span>{timeStr}</span>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <AvatarStack names={(plan.participants || []).slice(0, 3).map((p) => p.user?.name || 'U')} />
              <span className="text-xs font-semibold text-gray-500">{participantCount}/{plan.max_people}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
