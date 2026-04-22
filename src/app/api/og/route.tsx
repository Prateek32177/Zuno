import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
const { searchParams } = new URL(req.url);

const planId = searchParams.get("planId");

let isFallback = false;

let title = searchParams.get('title') || "Discover real plans";
let date = "";
let spots = "";
let city = searchParams.get('city') || "";

// ✅ PRIORITY: fetch from planId
if (planId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/plans/${planId}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("no plan");

    const plan = await res.json();

    title = plan.title || searchParams.get('title')  || title;
    city = plan.city || searchParams.get('city') || "";

    date = new Date(plan.datetime || searchParams.get('date')).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });

    const joined =
      plan.participants?.filter((p: any) => p.status === "joined").length || 0;

    spots = String(Math.max((plan.max_people || 0) - joined, 0));
  } catch {
    isFallback = true;
  }
} else {
  // ✅ fallback mode (no planId)
  isFallback = true;

  // optional: allow manual params override
  title = searchParams.get("title") || title;
  date = searchParams.get("date") || date;
  spots = searchParams.get("spots") || spots;
  city = searchParams.get('city') || '';
}

  // Curated high-quality outdoor/nature backgrounds
  const BACKGROUNDS = [
    "https://i.pinimg.com/1200x/48/01/96/480196cc8ff08c6e3e48890f98eb330d.jpg", // sunset beach
    "https://i.pinimg.com/1200x/2c/91/22/2c9122441b827a1d83ca9614ac0ea263.jpg", // lake mountains
    "https://i.pinimg.com/736x/ca/0b/eb/ca0beb3d1be9716b6c147f82a2de27a6.jpg", // mountain lake
    "https://i.pinimg.com/736x/58/33/5c/58335c8ff9174ed9be4e511a437bfe47.jpg", // dramatic nature
    "https://i.pinimg.com/736x/f3/96/70/f39670c6c3d29469d126c696e2383240.jpg", // adventure
  ];

  const imageUrl =
    BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)] +
    "?w=1200&q=85&auto=format&fit=crop&crop=center";

  // Fetch and convert to base64 for edge compatibility
  const res = await fetch(imageUrl);
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const bgSrc = `data:image/jpeg;base64,${base64}`;

  // Split title for two-line dramatic layout (matches the screenshot)
  // Title words are split so line 1 = first word(s), line 2 = rest — override via titleLine1/titleLine2
  const titleLine1 =
    searchParams.get("titleLine1") ||
    title
      .split(" ")
      .slice(0, Math.ceil(title.split(" ").length / 2))
      .join(" ");
  const titleLine2 =
    searchParams.get("titleLine2") ||
    title
      .split(" ")
      .slice(Math.ceil(title.split(" ").length / 2))
      .join(" ");

  return new ImageResponse(
    <div
      style={{
        width: 1080,
        height: 1350,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background: "#0a0a0a",
      }}
    >
      {/* === BACKGROUND PHOTO === */}
      <img
        src={bgSrc}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 40%",
          filter: "brightness(0.55) saturate(1.2) contrast(1.1)",
        }}
      />

      {/* === PREMIUM GRADIENT OVERLAY === */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(20,20,40,0.5) 35%, rgba(10,10,25,0.3) 60%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* === DYNAMIC GLOW EFFECT === */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "radial-gradient(ellipse 800px 600px at 50% 30%, rgba(255, 213, 74, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* === ENHANCED VIGNETTE === */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* === CONTENT WRAPPER === */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: "100%",
          padding: "60px 70px 72px",
          gap: 0,
        }}
      >
        {/* ─── TOP: BRAND ─── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            marginBottom: "-40px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Left line */}
          <div
            style={{
              display: "flex",
              height: 2,
              width: 100,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 100%)",
            }}
          />
          {/* Diamond ornament - Left */}
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              background: "linear-gradient(135deg, #FFD54A 0%, #FFC107 100%)",
              transform: "rotate(45deg)",
              boxShadow: "0 0 20px rgba(255, 213, 74, 0.4)",
            }}
          />
          {/* Brand name */}
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 800,
              color: "white",
              letterSpacing: "8px",
              textTransform: "uppercase",
              fontFamily: "serif",
              textShadow: "0 4px 20px rgba(255, 213, 74, 0.3), 0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            zuno
          </div>
          {/* Diamond ornament - Right */}
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              background: "linear-gradient(135deg, #FFD54A 0%, #FFC107 100%)",
              transform: "rotate(45deg)",
              boxShadow: "0 0 20px rgba(255, 213, 74, 0.4)",
            }}
          />
          {/* Right line */}
          <div
            style={{
              display: "flex",
              height: 2,
              width: 100,
              background: "linear-gradient(90deg, rgba(255,255,255,0.6) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* ─── CENTER: TITLE ─── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 0,
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Line 1 — White italic with enhanced shadow */}
          <div
            style={{
              display: "flex",
              fontSize: 100,
              fontWeight: 800,
              fontStyle: "italic",
              color: "white",
              lineHeight: 0.95,
              letterSpacing: "-3px",
              textShadow: "0 8px 32px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            {titleLine1}
          </div>

          {/* Line 2 — Vibrant Yellow italic with glow */}
          <div
            style={{
              display: "flex",
              fontSize: 100,
              fontWeight: 800,
              fontStyle: "italic",
              color: "#FFE54A",
              lineHeight: 0.95,
              textShadow:
                "0 8px 40px rgba(255, 213, 74, 0.5), 0 4px 20px rgba(255,180,0,0.4), 0 2px 8px rgba(0,0,0,0.6)",
              letterSpacing: "-3px",
            }}
          >
            {titleLine2}
          </div>

          {/* ─── META ROW: Date + Location ─── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 50,
              gap: 0,
              background: "rgba(0,0,0,0.5)",
              borderRadius: 120,
              border: "2px solid rgba(255, 213, 74, 0.4)",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(255, 213, 74, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Date pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "20px 38px",
                fontSize: 28,
                color: "white",
                fontWeight: 600,
                position: "relative",
              }}
            >
              {/* Calendar icon */}
              <div
                style={{
                  display: "flex",
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "3px solid rgba(255, 213, 74, 0.7)",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: "rgba(255, 213, 74, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#FFD54A",
                  }}
                >
                  31
                </div>
              </div>
              {date}
            </div>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                width: 2,
                height: 50,
                background: "linear-gradient(180deg, transparent 0%, rgba(255, 213, 74, 0.3) 50%, transparent 100%)",
              }}
            />

            {/* Location pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "20px 38px",
                fontSize: 28,
                color: "white",
                fontWeight: 600,
              }}
            >
              {/* Pin icon */}
              <div style={{ fontSize: 32 }}>📍</div>
              <span>{city}</span>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM ─── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            marginTop: "-80px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* SPOTS BADGE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              border: "3px solid rgba(255, 213, 74, 0.8)",
              padding: "28px 56px",
              borderRadius: 30,
              background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(20,10,0,0.3) 100%)",
              boxShadow: "0 12px 48px rgba(255, 213, 74, 0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* People icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                position: "relative",
                width: 52,
                height: 42,
              }}
            >
              {/* Person 1 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "absolute",
                  left: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.7)",
                    background: "transparent",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    width: 24,
                    height: 18,
                    borderRadius: "12px 12px 0 0",
                    border: "2px solid rgba(255,255,255,0.7)",
                    borderBottom: "none",
                    marginTop: 3,
                    background: "transparent",
                  }}
                />
              </div>
              {/* Person 2 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "absolute",
                  left: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.7)",
                    background: "transparent",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    width: 24,
                    height: 18,
                    borderRadius: "12px 12px 0 0",
                    border: "2px solid rgba(255,255,255,0.7)",
                    borderBottom: "none",
                    marginTop: 3,
                    background: "transparent",
                  }}
                />
              </div>
              {/* Person 3 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "absolute",
                  left: 34,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.7)",
                    background: "transparent",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    width: 24,
                    height: 18,
                    borderRadius: "12px 12px 0 0",
                    border: "2px solid rgba(255,255,255,0.7)",
                    borderBottom: "none",
                    marginTop: 3,
                    background: "transparent",
                  }}
                />
              </div>
            </div>

            {/* Number */}
            <div
              style={{
                display: "flex",
                fontSize: 92,
                fontWeight: 900,
                color: "#FFD54A",
                lineHeight: 1,
                textShadow: "0 4px 16px rgba(255, 213, 74, 0.4)",
              }}
            >
              {spots}
            </div>

            {/* Label */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                }}
              >
                SPOTS
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  color: "rgba(255,255,255,0.75)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                LEFT
              </div>
            </div>
          </div>

          {/* CTA BUTTON */}
          <div
            style={{
              display: "flex",
              background: "linear-gradient(135deg, #FFE54A 0%, #FFD54A 100%)",
              color: "#0a0a0a",
              padding: "26px 92px",
              borderRadius: 120,
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: "2px",
              textTransform: "uppercase",
              boxShadow: "0 16px 48px rgba(255, 213, 74, 0.35), 0 8px 24px rgba(0,0,0,0.3)",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            Join This Plan
          </div>

          {/* FOOTER LINK */}
          {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 20,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "1px",
              }}
            >
              zuno.app/p/{slug}
            </div> */}
        </div>
      </div>
    </div>,
    {
      width: 1080,
      height: 1350,
    },
  );
}
