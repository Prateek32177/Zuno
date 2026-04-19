import { ImageResponse } from 'next/og'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const runtime = 'edge'

// Category → emoji
const CAT_EMOJI: Record<string, string> = {
  travel: '✈️', food: '🍽️', trek: '🥾', hike: '🏔️',
  sports: '⚽', music: '🎵', art: '🎨', photography: '📷',
  coffee: '☕', party: '🎉', camping: '⛺', cycling: '🚴',
  other: '📍',
}

// Try to fetch an image URL and return base64, or null if it fails
async function fetchImageAsBase64(url: string): Promise<string | null> {
  if (!url) return null
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const mime = res.headers.get('content-type') || 'image/jpeg'
    const b64 = Buffer.from(buf).toString('base64')
    return `data:${mime};base64,${b64}`
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const planId = searchParams.get('planId')
  if (!planId) return new Response('Missing planId', { status: 400 })

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )

  const { data: plan } = await supabase
    .from('plans')
    .select(`
      id, title, category, datetime, location_name, max_people, image_url,
      host:users!plans_host_id_fkey(name, avatar_url),
      participants:plan_participants(status)
    `)
    .eq('id', planId)
    .single()

  if (!plan) return new Response('Plan not found', { status: 404 })

  const joined = (plan.participants || []).filter((p: any) => p.status === 'joined').length
  const host = Array.isArray(plan.host) ? plan.host[0] : plan.host
  const spotsLeft = Math.max(Number(plan.max_people || 0) - joined, 0)
  const isFull = spotsLeft === 0

  const dateText = new Date(plan.datetime).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const emoji = CAT_EMOJI[(plan.category || '').toLowerCase()] ?? '📍'

  // Attempt to load images as base64 (safe for edge)
  const [heroB64, avatarB64] = await Promise.all([
    plan.image_url ? fetchImageAsBase64(plan.image_url) : Promise.resolve(null),
    host?.avatar_url ? fetchImageAsBase64(host.avatar_url) : Promise.resolve(null),
  ])

  // Gradient backgrounds per category for fallback (no image)
  const gradients: Record<string, string> = {
    travel:      'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    trek:        'linear-gradient(135deg, #1a2a1a 0%, #2d4a1e 100%)',
    hike:        'linear-gradient(135deg, #1a2a1a 0%, #2d4a1e 100%)',
    food:        'linear-gradient(135deg, #1a0a00 0%, #3d1f00 100%)',
    music:       'linear-gradient(135deg, #0d0d2b 0%, #1a1a4e 100%)',
    photography: 'linear-gradient(135deg, #0d0d0d 0%, #2a2a2a 100%)',
    sports:      'linear-gradient(135deg, #001a33 0%, #003366 100%)',
    camping:     'linear-gradient(135deg, #0f1a0f 0%, #1e3a1e 100%)',
    party:       'linear-gradient(135deg, #1a0033 0%, #330066 100%)',
    other:       'linear-gradient(135deg, #1C0F0A 0%, #3D1F12 100%)',
  }
  const bgGradient = gradients[(plan.category || '').toLowerCase()] ?? gradients.other

  const titleFontSize = plan.title.length > 45 ? 54 : plan.title.length > 28 ? 64 : 74

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Georgia, serif',
          background: bgGradient,
        }}
      >
        {/* ── Hero photo (if loaded) ── */}
        {heroB64 && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroB64}
              width={1200}
              height={630}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            {/* Darkening overlays */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,3,1,0.95) 0%, rgba(6,3,1,0.65) 38%, rgba(6,3,1,0.2) 70%, rgba(6,3,1,0.1) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,3,1,0.5) 0%, transparent 60%)' }} />
          </>
        )}

        {/* ── No-image: subtle texture pattern ── */}
        {!heroB64 && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)',
          }} />
        )}

        {/* ── Content ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '40px 52px 44px',
          }}
        >
          {/* Top: ZUNO brand + spots */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              fontSize: 13, fontWeight: 700, letterSpacing: 4,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'system-ui, sans-serif',
              textTransform: 'uppercase',
            }}>
              ZUNO
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: isFull ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.12)',
              border: `1px solid ${isFull ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: 9999,
              padding: '8px 18px',
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: 9999,
                background: isFull ? '#ef4444' : '#4ade80',
              }} />
              <div style={{ fontSize: 17, color: 'white', fontFamily: 'system-ui, sans-serif', fontWeight: 500 }}>
                {isFull ? 'Fully booked' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
              </div>
            </div>
          </div>

          {/* Middle: category + title + date/location */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 900 }}>
            {/* Category pill */}
            <div style={{
              display: 'flex', alignItems: 'center',
              marginBottom: 16,
              fontSize: 15,
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 500,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}>
              {emoji}  {plan.category || 'Plan'}
            </div>

            {/* Title */}
            <div style={{
              fontSize: titleFontSize,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: -1.5,
              fontFamily: 'Georgia, serif',
            }}>
              {plan.title.length > 70 ? plan.title.slice(0, 70) + '…' : plan.title}
            </div>

            {/* Date + location row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginTop: 18,
              fontSize: 20,
              color: 'rgba(255,255,255,0.72)',
              fontFamily: 'system-ui, sans-serif',
            }}>
              <span style={{ fontSize: 18 }}>📅</span>
              <span>{dateText}</span>
              {plan.location_name && (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 6px' }}>·</span>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <span>{plan.location_name}</span>
                </>
              )}
            </div>
          </div>

          {/* Bottom: host */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {avatarB64
              ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarB64}
                  width={48}
                  height={48}
                  style={{ borderRadius: 9999, border: '2px solid rgba(255,255,255,0.35)', objectFit: 'cover' }}
                />
              )
              : (
                <div style={{
                  width: 48, height: 48, borderRadius: 9999,
                  background: 'rgba(255,255,255,0.15)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: 'white',
                  fontFamily: 'system-ui, sans-serif',
                }}>
                  {(host?.name || 'H')[0].toUpperCase()}
                </div>
              )
            }
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui, sans-serif', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
                HOSTED BY
              </div>
              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)', fontFamily: 'Georgia, serif', fontWeight: 600 }}>
                {host?.name || 'Anonymous'}
              </div>
            </div>

            {/* Joined count */}
            {joined > 0 && (
              <div style={{
                marginLeft: 24,
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 16,
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'system-ui, sans-serif',
              }}>
                <span>👥</span>
                <span>{joined} joined</span>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
