import type { Metadata } from "next";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import PlanDetailClient from "./PlanDetailClient";
import { createClient } from "@/lib/supabase/server"; // ✅ IMPORTANT

/* ---------- METADATA ---------- */
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: plan, error } = await supabase
    .from("plans")
    .select("*")
    .eq("id", id)
    .single();

  if (!plan || error) {
    return {
      title: "Plan not found",
    };
  }

  /* ✅ Build absolute OG URL */
const headerList = await headers();
const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const ogImageUrl = `${baseUrl}/plans/${id}/opengraph-image`;

  return {
    title: `${plan.title} | Join now`,
    description:
      plan.description || "Join this plan and meet amazing people.",

    openGraph: {
      title: plan.title,
      description: plan.description || "Join this plan",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: plan.title,
      description: plan.description || "Join this plan",
      images: [ogImageUrl],
    },
  };
}

/* ---------- PAGE ---------- */
export default async function Page({ params }: any) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: plan, error } = await supabase
    .from("plans")
    .select("*")
    .eq("id", id)
    .single();

  if (!plan || error) return notFound();

  /* ✅ Ensure serializable */
  const safePlan = JSON.parse(JSON.stringify(plan));

  return <PlanDetailClient initialPlan={safePlan} />;
}