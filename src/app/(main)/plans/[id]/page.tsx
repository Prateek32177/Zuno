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
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 app-card px-4 py-3 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-brand">
        <button onClick={() => router.back()} className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 app-card inline-flex items-center justify-center transition-all hover:shadow-brand-md hover:scale-110">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="text-sm font-bold">Plan Details</p>
        <button
          onClick={toggleSave}
          className={`h-10 w-10 rounded-full border inline-flex items-center justify-center transition-all duration-200 ${
            isSaved
              ? 'bg-red-500/20 border-red-500/50 shadow-brand-md scale-110'
              : 'border-gray-200 dark:border-gray-700 app-card hover:shadow-brand-md'
          }`}
        >
          <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Image */}
      <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
        <Image
          src={plan.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200'}
          alt={plan.title}
          fill
          className="object-cover transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-black leading-tight tracking-tight">{plan.title}</h1>
          <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            {plan.city || 'General'} · {plan.location_name}
          </p>
        </div>

        {/* Organizer Card */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-700 app-card p-4 shadow-brand">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Organizer</p>
              <p className="mt-2 text-base font-bold">{plan.host?.name || 'Host'}</p>
              {plan.host?.instagram_url && (
                <a href={plan.host.instagram_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-pink-500 text-sm font-semibold hover:underline">
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              )}
            </div>
            <TrustBadge score={plan.host?.reliability_score ?? 100} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-900/20 p-4 shadow-brand">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Date & Time</p>
            <p className="mt-2 font-bold text-sm">{planDate.toLocaleDateString()}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{planDate.toLocaleTimeString()}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-900/20 p-4 shadow-brand">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-700 dark:text-purple-400">Participants</p>
            <p className="mt-2 font-bold text-sm">{participantCount}/{plan.max_people}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{plan.max_people - participantCount} spots left</p>
          </div>
        </div>

        {/* Location & Info */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-900/20 p-4 shadow-brand">
          <div className="flex items-center justify-between gap-2">
            <LocationLink location={plan.location_name} googleMapsLink={plan.google_maps_link} />
          </div>
          <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Info className="h-3.5 w-3.5" /> Host is included in participant count
          </p>
        </div>

        {/* Payment Option */}
        {plan.show_payment_options && plan.host?.gpay_link && (
          <a href={plan.host.gpay_link} target="_blank" rel="noreferrer" className="block rounded-2xl border border-gray-200 dark:border-gray-700 app-card p-4 text-sm font-bold hover:shadow-brand-md transition-all">
            💳 Pay Organizer (GPay)
          </a>
        )}

        {/* WhatsApp */}
        {plan.whatsapp_link && (
          <a
            href={plan.whatsapp_link}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-4 text-center text-sm font-bold text-white shadow-brand-md hover:shadow-brand-lg transition-all hover:scale-105"
          >
            💬 Open WhatsApp Group
          </a>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {isHost ? (
            <button disabled className="rounded-2xl border border-gray-200 dark:border-gray-700 app-card px-4 py-3 text-sm font-bold text-gray-400 cursor-not-allowed">
              You&apos;re the Host
            </button>
          ) : !isJoined ? (
            <button
              onClick={join}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-bold text-white shadow-brand-md hover:shadow-brand-lg transition-all hover:scale-105"
            >
              Join Plan
            </button>
          ) : (
            <button
              onClick={leave}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 app-card px-4 py-3 text-sm font-bold hover:shadow-brand-md transition-all"
            >
              Leave Plan
            </button>
          )}
          <button
            onClick={() => router.push('/feed')}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 app-card px-4 py-3 text-sm font-bold hover:shadow-brand-md transition-all"
          >
            Back to Feed
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
