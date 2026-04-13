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
    <Link href={`/plans/${plan.id}`} className="block overflow-hidden rounded-2xl">
      {/* Large Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={plan.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800'}
          alt={plan.title}
          fill
          className="object-cover"
          sizes="(max-width: 390px) 100vw, 390px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Category Badge - Top Left */}
        <div className="absolute left-3 top-3 rounded-lg bg-black/40 backdrop-blur-sm px-2 py-1 text-xs font-semibold text-white inline-flex items-center gap-1">
          <CategoryIcon icon={category.icon} className="h-3 w-3" />
          <span className="hidden xs:inline">{category.label}</span>
        </div>

        {/* Favorite Button - Bottom Right Small */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleFavorite?.()
          }}
          className="absolute right-3 bottom-3 rounded-full bg-black/50 backdrop-blur-sm p-1.5 text-white transition-all hover:bg-black/70"
          aria-label="toggle favorite"
        >
          <Heart className={`h-4 w-4 ${plan.is_favorite ? 'fill-red-400 text-red-400' : ''}`} />
        </button>
      </div>

      {/* Content - Minimal */}
      <div className="p-4 app-card space-y-3">
        <div>
          <h3 className="font-semibold text-base leading-tight">{plan.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{plan.location_name}</p>
        </div>

        {/* Host Info - Compact */}
        <div className="flex items-center gap-2">
          {plan.host?.avatar_url && (
            <Image
              src={plan.host.avatar_url}
              alt={plan.host.name}
              width={24}
              height={24}
              className="h-6 w-6 rounded-full object-cover"
            />
          )}
          <span className="text-xs font-medium">{plan.host?.name || 'Host'}</span>
          {plan.host?.instagram_url && (
            <button
              type="button"
              className="text-gray-400 hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(plan.host?.instagram_url, '_blank')
              }}
              aria-label="Instagram"
            >
              <Instagram className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Date, Time, People - Inline */}
        <div className="flex items-center gap-4 text-xs app-muted">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dateStr}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeStr}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" />
            {participantCount}/{plan.max_people}
          </span>
        </div>
      </div>
    </Link>
  )
}
