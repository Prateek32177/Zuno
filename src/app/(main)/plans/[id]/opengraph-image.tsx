import { headers } from "next/headers";
import { ImageResponse } from "next/og";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server"; // ← server, not client

export const alt = "Plan preview";
export const size = {
  width: 1200,
  height: 630,
};

export const runtime = "edge"; // ← add this

export default async function OG({ params }: any) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("id", id)
    .single();

  if (!plan) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", background: "#faf8f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
        Plan not found
      </div>,
      size
    );
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#faf8f4",
        padding: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Title */}
      <div style={{ fontSize: 64, fontWeight: 700 }}>{plan.title}</div>

      {/* Date */}
      <div style={{ fontSize: 32 }}>
        {new Date(plan.datetime).toDateString()}
      </div>

      {/* Location */}
      <div style={{ fontSize: 28 }}>📍 {plan.location_name}</div>

      {/* Footer */}
      <div style={{ fontSize: 24 }}>{plan.max_people} spots • Join now</div>
    </div>,
    size,
  );
}
