import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PlanDetailClient from "./PlanDetailClient";
import { createClient } from "@/lib/supabase/server";
import { computeEffectivePlanStatus, normalizeVisibility } from "@/lib/plan";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1200&auto=format&fit=crop";
const SITE_URL = "https://zunoplan.vercel.app";

// ─── Helpers ────────────────────────────────────────────────────

function formatShareDate(datetime: string) {
  return new Date(datetime).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Build a punchy OG title: no description, just the key facts */
function buildOgTitle(plan: {
  title: string;
  location_name?: string | null;
  datetime: string;
  category?: string | null;
}) {
  const parts: string[] = [plan.title];
  if (plan.location_name) parts.push(plan.location_name);
  parts.push(formatShareDate(plan.datetime));
  return parts.join(" · ");
}

function buildOgDescription(plan: {
  max_people?: number | null;
  joined: number;
  host_name?: string | null;
  category?: string | null;
}) {
  const spotsLeft = Math.max(Number(plan.max_people || 0) - plan.joined, 0);
  const cat = plan.category ? `${plan.category} plan` : "plan";
  const host = plan.host_name ? `by ${plan.host_name}` : "";
  const spots = spotsLeft > 0 ? `${spotsLeft} spots left` : "Fully booked";
  return [host && `A ${cat} ${host}`, spots].filter(Boolean).join(" · ");
}

// ─── Metadata ────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>; // ← Promise type
}): Promise<Metadata> {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: plan, error } = await supabase
    .from("plans")
    .select(
      `
      id, title, category, datetime, location_name, max_people, image_url,
      host:users!plans_host_id_fkey(name),
      participants:plan_participants(status)
    `,
    )
    .eq("id", id)
    .single();
  if (error) console.error("OG metadata fetch failed:", error.message);

  if (!plan) return { title: "Plan not found" };

  const joined = (plan.participants || []).filter(
    (p: any) => p.status === "joined",
  ).length;
  const host = Array.isArray(plan.host) ? plan.host[0] : plan.host;

  const ogTitle = buildOgTitle({
    title: plan.title,
    location_name: plan.location_name,
    datetime: plan.datetime,
    category: plan.category,
  });

  const ogDescription = buildOgDescription({
    max_people: plan.max_people,
    joined,
    host_name: host?.name,
    category: plan.category,
  });

  // Use the plan's own image directly — no processing, no edge function
  // Instead of signed URL, use the public URL directly:
  const ogImage = plan.image_url
    ? plan.image_url.replace("/sign/", "/public/") // strip token
    : FALLBACK_IMAGE;

  const planUrl = `${SITE_URL}/plans/${plan.id}`;

  return {
    title: ogTitle,
    description: ogDescription,
    openGraph: {
      type: "website",
      url: planUrl,
      title: ogTitle,
      description: ogDescription,
      siteName: "Zuno",
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

export default async function Page({ params }: any) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: auth } = await supabase.auth.getUser();

  const { data: plan } = await supabase
    .from("plans")
    .select(
      "*, host:users!plans_host_id_fkey(id,name,avatar_url,gpay_link,instagram_url,upi_payee_name)",
    )
    .eq("id", id)
    .single();
  if (!plan) return notFound();

  const { data: participants } = await supabase
    .from("plan_participants")
    .select(
      "user_id,status,user:users!plan_participants_user_id_fkey(id,name,avatar_url)",
    )
    .eq("plan_id", id)
    .eq("status", "joined");
  const { data: settlements } = await supabase
    .from("expense_settlements")
    .select("user_id,settled,settled_at")
    .eq("plan_id", id);
  const isParticipant = Boolean(
    (participants || []).some((p: any) => p.user_id === auth.user?.id),
  );
  const isHost = auth.user?.id === plan.host_id;
  const effectiveStatus = computeEffectivePlanStatus({ ...plan, participants });
  const visibility = normalizeVisibility(plan.visibility);

  if (visibility === "invite_only" && !(isParticipant || isHost))
    return notFound();
  if (effectiveStatus === "expired" && !(isParticipant || isHost))
    return notFound();

  const { data: favorites } = auth.user
    ? await supabase
        .from("plan_favorites")
        .select("plan_id")
        .eq("plan_id", id)
        .eq("user_id", auth.user.id)
        .maybeSingle()
    : { data: null };
  const { data: currentUser } = auth.user
    ? await supabase
        .from("users")
        .select("gender")
        .eq("id", auth.user.id)
        .maybeSingle()
    : { data: null };

  const safePlan = JSON.parse(
    JSON.stringify({
      ...plan,
      visibility,
      status: effectiveStatus,
      require_approval: !!plan.approval_mode,
      participants: participants || [],
      settlements: settlements || [],
      is_joined: isParticipant,
      is_favorite: Boolean(favorites),
      current_user_id: auth.user?.id || null,
      current_user_gender: currentUser?.gender || null,
    }),
  );

  return <PlanDetailClient initialPlan={safePlan} />;
}
