import { Metadata } from "next";
import { notFound } from "next/navigation";
import PlanDetailClient from "./PlanDetailClient";

/* ✅ FIX 1: await params */
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;

const res = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""}/api/plans/${id}`, {
  cache: "no-store",
});

  if (!res.ok) return {};

  const plan = await res.json();

  return {
    title: `${plan.title} | Join now`,
    description: plan.description || "Join this plan",
    openGraph: {
      title: plan.title,
      description: plan.description,
      images: [`/plans/${id}/opengraph-image`],
    },
  };
}

export default async function Page({ params }: any) {
  const { id } = await params;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/plans/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const plan = await res.json();

  return <PlanDetailClient initialPlan={plan} />;
}