import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase.from('plans').select('*, host:users(*)').order('datetime', { ascending: true }).limit(20)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const payload = {
    host_id: auth.user.id,
    title: body.title,
    description: body.description ?? null,
    category: body.category ?? 'other',
    location_name: body.location_name,
    datetime: body.datetime,
    max_people: Number(body.max_people || 8),
    whatsapp_link: body.whatsapp_link || '',
    approval_mode: !!body.approval_mode,
    female_only: !!body.female_only,
    image_url: body.image_url || null,
    google_maps_link: body.google_maps_link || null,
  }

  let { data, error } = await supabase.from('plans').insert(payload).select().single()

  // Backward compatibility if DB is missing google_maps_link column
  if (error?.message?.includes('google_maps_link')) {
    const { google_maps_link, ...fallbackPayload } = payload
    const retry = await supabase.from('plans').insert(fallbackPayload).select().single()
    data = retry.data
    error = retry.error
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
