'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {  Users, Calendar, Heart, ChevronLeft, Info, Instagram } from 'lucide-react'
import Image from 'next/image'
import { BottomNav } from '@/components/BottomNav'
import { LocationLink } from '@/components/LocationLink'
import { TrustBadge } from '@/components/TrustBadge'
import type { Plan } from '@/lib/types'

export default function PlanPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [isJoined, setIsJoined] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const response = await fetch(`/api/plans/${params.id}`)
    if (response.ok) {
      const data = await response.json()
      setPlan(data)
      setLoadError(null)
      const mine = (data.participants || []).some((p: any) => p.user_id === data.current_user_id && p.status === 'joined')
      setIsJoined(mine)
    } else {
      const err = await response.json().catch(() => ({ error: 'Plan not found' }))
      setLoadError(err.error || 'Plan not found')
    }

    const favResp = await fetch('/api/favorites')
    if (favResp.ok) {
      const favs = await favResp.json()
      setIsSaved((favs || []).some((p: Plan) => p.id === params.id))
    }

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [params.id])

  const participantCount = useMemo(() => ((plan?.participants || []).filter((p: any) => p.status === 'joined').length || 0) + 1, [plan])
  const isHost = (plan as any)?.current_user_id && (plan as any).current_user_id === plan?.host_id

  const join = async () => {
    const resp = await fetch(`/api/plans/${params.id}/join`, { method: 'POST' })
    if (resp.ok) {
      setIsJoined(true)
      load()
    } else {
      const err = await resp.json()
      alert(err.error || 'Unable to join')
    }
  }

  const leave = async () => {
    const resp = await fetch(`/api/plans/${params.id}/leave`, { method: 'POST' })
    if (resp.ok) {
      setIsJoined(false)
      load()
    }
  }

  const toggleSave = async () => {
    const method = isSaved ? 'DELETE' : 'POST'
    const resp = await fetch(`/api/plans/${params.id}/favorite`, { method })
    if (resp.ok) setIsSaved(!isSaved)
  }

  if (loading) return <div className="min-h-screen pb-24" />

  if (!plan) {
    return (
      <div className="min-h-screen px-4 py-20 text-center">
        <p className="text-base font-semibold">{loadError || 'Plan not found'}</p>
        <button onClick={load} className="mt-4 rounded-xl border app-card px-4 py-2 text-sm font-medium">Retry</button>
      </div>
    )
  }

  const planDate = new Date(plan.datetime)

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 app-card px-4 py-3 bg-white dark:bg-black">
        <button onClick={() => router.back()} className="p-2">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={toggleSave}
          className="p-2 transition-colors"
        >
          <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={plan.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200'}
          alt={plan.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold">{plan.title}</h1>
          <p className="text-xs app-muted mt-1">{plan.location_name}</p>
        </div>

        {/* Host Info */}
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <p className="text-xs font-semibold app-muted mb-2">Organizer</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{plan.host?.name || 'Host'}</p>
              <div className="flex items-center gap-2 mt-1">
                <TrustBadge score={plan.host?.reliability_score ?? 100} />
                {plan.host?.instagram_url && (
                  <a href={plan.host.instagram_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="app-muted">Date</span>
            <span className="font-semibold">{planDate.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="app-muted">Time</span>
            <span className="font-semibold">{planDate.toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="app-muted">Participants</span>
            <span className="font-semibold">{participantCount}/{plan.max_people}</span>
          </div>
        </div>

        {/* Location */}
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <LocationLink location={plan.location_name} googleMapsLink={plan.google_maps_link} />
        </div>

        {/* WhatsApp */}
        {plan.whatsapp_link && (
          <a
            href={plan.whatsapp_link}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg text-center py-3 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: 'var(--brand)' }}
          >
            Open WhatsApp Group
          </a>
        )}

        {/* Payment Option */}
        {plan.show_payment_options && plan.host?.gpay_link && (
          <a href={plan.host.gpay_link} target="_blank" rel="noreferrer" className="block rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm font-semibold text-center">
            Pay Organizer (GPay)
          </a>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {isHost ? (
            <button disabled className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed">
              You&apos;re the Host
            </button>
          ) : !isJoined ? (
            <button
              onClick={join}
              className="flex-1 rounded-lg py-3 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: 'var(--brand)' }}
            >
              Join
            </button>
          ) : (
            <button
              onClick={leave}
              className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 py-3 text-sm font-semibold"
            >
              Leave
            </button>
          )}
          <button
            onClick={() => router.push('/feed')}
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 py-3 text-sm font-semibold"
          >
            Back
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
