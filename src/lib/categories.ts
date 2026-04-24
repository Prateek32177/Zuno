import {
  Sunrise, Footprints, Trophy, UtensilsCrossed, Coffee,
  Music2, Users, CalendarDays, MapPin, Bike, Mountain,
  type LucideIcon
} from 'lucide-react'
import { normalizeCityKey } from './cities';
// ─── Core DB types ───────────────────────────────────────────────
export type PlanCategory =
  | 'outdoor'
  | 'fitness'
  | 'sports'
  | 'food'
  | 'cafe'
  | 'nightlife'
  | 'hangout'
  | 'events'
  | 'trip'
  | 'other'

// ─── Global icon + fallback label map ────────────────────────────
export const CATEGORY_META: Record<
  PlanCategory,
  { label: string; icon: PlanCategory }
> = {
  outdoor:   { label: 'Outdoor / Nature', icon: 'outdoor' },
  fitness:   { label: 'Run Club / Ride', icon: 'fitness' },
  sports:    { label: 'Sports Meetup', icon: 'sports' },
  food:      { label: 'Food Crawl', icon: 'food' },
  cafe:      { label: 'Cafe Hop', icon: 'cafe' },
  nightlife: { label: 'Night Out', icon: 'nightlife' },
  hangout:   { label: 'Chill Hangout', icon: 'hangout' },
  events:    { label: 'Events / Gigs', icon: 'events' },
  trip:      { label: 'Weekend Escape', icon: 'trip' },
  other:     { label: 'Something Else', icon: 'other' },
}

// ─── City-curated labels (icon always from CATEGORY_META) ────────
export const CITY_CATEGORY_LABELS: Record<string, Record<PlanCategory, string>> = {

  udaipur: {
    outdoor:   'Sunrise / Sunset Spot',
    fitness:   'Morning Walk / Run',
    sports:    'Sports Meetup',
    food:      'Food Crawl',
    cafe:      'Chai & Chill',
    nightlife: 'Rooftop Night Out',
    hangout:   'Lake Side Hangout',
    events:    'Cultural Evening',
    trip:      'Road Trip',
    other:     'Something Else',
  },

  mumbai: {
    outdoor:   'Sunrise at the Sea',
    fitness:   'Run Club',
    sports:    'Sports Meetup',
    food:      'Street Food Crawl',
    cafe:      'Cafe Hop',
    nightlife: 'Night Out / Clubbing',
    hangout:   'Chill Hangout',
    events:    'Gig / Open Mic',
    trip:      'Weekend Escape',          // Lonavala, Alibaug
    other:     'Something Else',
  },

  delhi: {
    outdoor:   'Park Walk / Nature',
    fitness:   'Bike Ride / Run Club',    // Delhi cycling clubs are massive
    sports:    'Sports Meetup',
    food:      'Food Trail',
    cafe:      'Cafe Hop',
    nightlife: 'Night Out / Clubbing',
    hangout:   'Chill Hangout',
    events:    'Event / Market',
    trip:      'Weekend Getaway',
    other:     'Something Else',
  },

  bangalore: {
    outdoor:   'Park / Nature Walk',
    fitness:   'Run Club / Bike Ride',    // BRC, Sunday Long Run etc
    sports:    'Sports Meetup',
    food:      'Food Crawl',
    cafe:      'Cafe Hop',
    nightlife: 'Night Out / Clubbing',
    hangout:   'Chill Hangout',
    events:    'Gig / Tech Meetup',
    trip:      'Weekend Hill Escape',     // Coorg, Chikmagalur, Nandi
    other:     'Something Else',
  },

  pune: {
    outdoor:   'Trek / Sunrise Hike',     // Sinhagad, Rajgad every weekend
    fitness:   'Run Club / Bike Ride',
    sports:    'Sports Meetup',
    food:      'Food Crawl',
    cafe:      'Cafe Hop',
    nightlife: 'Night Out / Clubbing',
    hangout:   'Chill Hangout',
    events:    'Gig / Event',
    trip:      'Weekend Escape',          // Mahabaleshwar, Lavasa
    other:     'Something Else',
  },

  indore: {
    outdoor:   'Morning Walk / Nature',
    fitness:   'Run Club / Cycling',
    sports:    'Sports Meetup',
    food:      'Street Food Crawl',       // Sarafa, Chappan Dukan
    cafe:      'Chai & Chill',
    nightlife: 'Night Out',
    hangout:   'Chill Hangout',
    events:    'Event / Gig',
    trip:      'Road Trip',
    other:     'Something Else',
  },

}

// ─── Helper ──────────────────────────────────────────────────────
// Gets the city-specific label, falls back to global label
export function getCategoryLabel(category: PlanCategory, city?: string): string {
  if (city && CITY_CATEGORY_LABELS[city.toLowerCase()]) {
    return CITY_CATEGORY_LABELS[city.toLowerCase()][category]
  }
  return CATEGORY_META[category].label
}

// // Gets the icon (always from CATEGORY_META, city-agnostic)
// export function getCategoryIcon(category: PlanCategory): LucideIcon {
//   return CATEGORY_META[category].icon
// }

// ─── Helper: get all categories with city-specific labels + icons ─
export function getCityCategories(city: string | null | undefined): Array<{
  category: PlanCategory
  label: string
}> {
  const key = normalizeCityKey(city)
  const cityLabels = CITY_CATEGORY_LABELS[key]

  return (Object.keys(CATEGORY_META) as PlanCategory[]).map((category) => ({
    category,
    label: cityLabels?.[category] ?? CATEGORY_META[category].label,
  }))
}
