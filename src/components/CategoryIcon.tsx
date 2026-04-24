import {
  Sunrise,
  Bike,
  Trophy,
  UtensilsCrossed,
  Coffee,
  Music2,
  Users,
  CalendarDays,
  Mountain,
  Sparkles,
  type LucideIcon
} from 'lucide-react'

import type { PlanCategory } from '@/lib/categories'

export function CategoryIcon({
  icon,
  className = 'h-3.5 w-3.5',
}: {
  icon: PlanCategory
  className?: string
}) {
  const map: Record<PlanCategory, LucideIcon> = {
    outdoor: Sunrise,
    fitness: Bike,
    sports: Trophy,
    food: UtensilsCrossed,
    cafe: Coffee,
    nightlife: Music2,
    hangout: Users,
    events: CalendarDays,
    trip: Mountain,
    other: Sparkles,
  }

  const Icon = map[icon]
  if (!Icon) return null // Safety fallback
  return <Icon className={className} />
}