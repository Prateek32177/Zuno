import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PlanDetailClient from "../../(main)/plans/[id]/PlanDetailClient";
import { createClient } from "@/lib/supabase/server";
import { parseDatetimeLocal, formatDateTime } from "@/lib/datetime";
import { getParticipantCapacity } from "@/lib/plan";
import { getJoinedParticipantsCount } from "@/lib/plan";

const SITE_URL = "https://www.zipout.in";

// ─── METADATA ─────────────────────────
function buildOgTitle(plan: {
  title: string;
  datetime: string;
  city?: string | null;
}) {
  const date = new Date(plan.datetime).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const parts = [plan.title];
  if (plan.city) parts.push(plan.city);
  parts.push(date);
  return parts.join(" · ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shortId: string }>;
}): Promise<Metadata> {
  const { shortId } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: plan, error } = await supabase
    .from("plans")
    .select(
      `
      id, title, category, datetime, city, location_name, max_people, image_url, short_id,
      host:users!plans_host_id_fkey(name),
      participants:plan_participants(status)
    `
    )
    .eq("short_id", shortId) // ✅ key change
    .single();

  if (error) console.error("OG metadata fetch failed:", error.message);

  if (!plan) return { title: "Plan not found" };

  // ─── SAME LOGIC (unchanged) ─────────────────

  const ogTitle = buildOgTitle({
    title: plan.title,
    datetime: plan.datetime,
    city: plan.city,
  });

  const planDate = parseDatetimeLocal(plan.datetime);
  const participantCapacity = getParticipantCapacity(plan as any);
  const joinedCount = getJoinedParticipantsCount(plan.participants);
  const spotsOpen = Math.max(participantCapacity - joinedCount, 0);

  const ogDescription = `${spotsOpen} spot${spotsOpen === 1 ? "" : "s"} left · Join plan now.`;

  const ogImage =
    plan?.image_url ||
    `${SITE_URL}/api/og-standard?title=${encodeURIComponent(plan.title)}&city=${encodeURIComponent(plan.city || "")}&date=${encodeURIComponent(formatDateTime(planDate))}&spots=${spotsOpen}`;

  // 🔥 UPDATED CLEAN URL
  const planUrl = `${SITE_URL}/${plan.short_id}`;

  return {
    metadataBase: new URL(SITE_URL),

    title: ogTitle,
    description: ogDescription,

    openGraph: {
      type: "website",
      url: planUrl, // ✅ updated
      title: ogTitle,
      description: ogDescription,
      siteName: "Zipout",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: plan.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

// ─── PAGE ─────────────────────────

export default async function Page({
  params,
}: {
  params: { shortId: string };
}) {
  const { shortId } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("short_id", shortId)
    .single();

  if (!plan) return notFound();


  const { data: auth } = await supabase.auth.getUser();

  const { data: participants } = await supabase
    .from("plan_participants")
    .select("*")
    .eq("plan_id", plan.id)
    .eq("status", "joined");

  const safePlan = {
    ...plan,
    participants: participants || [],
    current_user_id: auth.user?.id || null,
  };

  return <PlanDetailClient initialPlan={safePlan} />;
}
