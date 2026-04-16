import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export default async function OG({ params }: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/plans/${params.id}`);
  const plan = await res.json();

  return new ImageResponse(
    (
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
        <div style={{ fontSize: 64, fontWeight: 700 }}>
          {plan.title}
        </div>

        {/* Date */}
        <div style={{ fontSize: 32 }}>
          {new Date(plan.datetime).toDateString()}
        </div>

        {/* Location */}
        <div style={{ fontSize: 28 }}>
          📍 {plan.location_name}
        </div>

        {/* Footer */}
        <div style={{ fontSize: 24 }}>
          {plan.max_people} spots • Join now
        </div>
      </div>
    ),
    size
  );
}