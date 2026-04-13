import Image from 'next/image'
import Link from 'next/link'
import { Plan } from '@/lib/types'
import { TrustBadge } from './TrustBadge'
import { AvatarStack } from './AvatarStack'
import { MapPin, Users, Calendar, Clock, ChevronRight, Instagram, Info, Heart, CheckCircle2 } from 'lucide-react'
import { CATEGORY_META } from '@/lib/categories'
import { LocationLink } from './LocationLink'
import { CategoryIcon } from './CategoryIcon'

export function PlanCard({ plan, onToggleFavorite }: { plan: Plan; onToggleFavorite?: () => void }) {
  if (!plan) return null

  const joinedParticipants = (plan.participant_count || plan.participants?.length || 0)
  const participantCount = joinedParticipants + 1
  const spotsLeft = Math.max(0, (plan.max_people || 10) - participantCount)
  const planDate = plan.datetime ? new Date(plan.datetime) : new Date()
  const dateStr = planDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const timeStr = planDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const category = CATEGORY_META[plan.category]

  return (
    <Link href={`/plans/${plan.id}`} className="block overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-brand-lg shadow-brand-md">
      {/* Image Container with Overlay */}
      <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
        <Image
          src={plan.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800'}
          alt={plan.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 390px) 100vw, 390px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

        {/* Top Left Badge - Category */}
        <div className="absolute left-4 top-4 rounded-2xl bg-white/95 px-3 py-2 text-xs font-bold text-gray-900 inline-flex items-center gap-2 shadow-brand-md backdrop-blur-sm">
          <CategoryIcon icon={category.icon} className="h-3.5 w-3.5" /> <span>{category.label}</span>
        </div>

        {/* Top Right Badge - Spots Available */}
        <div className={`absolute right-4 top-4 rounded-2xl px-3 py-2 text-xs font-bold text-white inline-flex items-center gap-1 shadow-brand-md backdrop-blur-sm ${spotsLeft === 0 ? 'bg-red-500/90' : 'bg-green-500/90'}`}>
          {spotsLeft === 0 ? '✕ Full' : `✓ ${spotsLeft} spots`}
        </div>

        {/* Bottom Right - Heart/Favorite */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleFavorite?.()
          }}
          className={`absolute right-4 bottom-4 rounded-full p-2.5 transition-all duration-200 shadow-brand-md backdrop-blur-sm ${
            plan.is_favorite 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white/90 text-gray-400 hover:scale-105'
          }`}
          aria-label="toggle favorite"
        >
          <Heart className={`h-5 w-5 ${plan.is_favorite ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Left - Joined Badge */}
        {plan.is_joined && (
          <div className="absolute left-4 bottom-4 rounded-2xl bg-green-500 px-3 py-2 text-xs font-bold text-white inline-flex items-center gap-1.5 shadow-brand-md">
            <CheckCircle2 className="h-3.5 w-3.5" /> Joined
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="space-y-3.5 p-5 app-card">
        {/* Title */}
        <h3 className="text-lg font-bold leading-snug text-balance">{plan.title}</h3>

        {/* Host Info Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {plan.host?.avatar_url && (
              <Image
                src={plan.host.avatar_url}
                alt={plan.host.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-brand"
              />
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{plan.host?.name || 'Host'}</span>
              <div className="flex items-center gap-1">
                <TrustBadge score={plan.host?.reliability_score ?? 100} />
                {plan.host?.instagram_url && (
                  <button
                    type="button"
                    className="text-pink-500 hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      window.open(plan.host?.instagram_url, '_blank')
                    }}
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 app-muted opacity-50" />
        </div>

        {/* Date, Time, Participants Row */}
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-900 p-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Date</span>
            <span className="text-sm font-bold">{dateStr}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Time</span>
            <span className="text-sm font-bold">{timeStr}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">People</span>
            <span className="text-sm font-bold">{participantCount}/{plan.max_people}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-900 p-3">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
          <LocationLink location={plan.location_name} googleMapsLink={plan.google_maps_link} />
        </div>

        {/* Participants Stack */}
        {plan.participants && plan.participants.length > 0 && (
          <AvatarStack names={(plan.participants || []).slice(0, 3).map((p) => p.user?.name || 'U')} />
        )}

        {/* Description (if exists) */}
        {plan.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{plan.description}</p>
        )}
      </div>
    </Link>
  )
}
