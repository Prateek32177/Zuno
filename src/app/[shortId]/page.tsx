import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PlanDetailClient from "./PlanDetailClient";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://zipout.in";

// ─── METADATA ─────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { shortId: string };
}): Promise<Metadata> {
 const { shortId } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: plan } = await supabase
    .from("plans")
    .select("title, image_url")
    .eq("short_id", shortId)
    .single();

  if (!plan) return { title: "Plan not found" };

  return {
    metadataBase: new URL(SITE_URL),
    title: plan.title,
    description: "Join this plan on Zipout",
    openGraph: {
      url: `${SITE_URL}/${shortId}`,
      title: plan.title,
      images: [
        {
          url: plan.image_url,
          width: 1200,
          height: 630,
          alt: plan.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: plan.title,
      images: [plan.image_url],
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

  // 👉 existing logic (kept minimal)
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
