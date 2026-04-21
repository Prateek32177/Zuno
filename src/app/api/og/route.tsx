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
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800", // sunset beach
    "https://images.unsplash.com/photo-1629185752152-fe65698ddee4", // lake mountains
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470", // mountain lake
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e", // dramatic nature
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", // adventure
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
          filter: "brightness(0.65)",
        }}
      />

      {/* === MULTI-STOP GRADIENT OVERLAY === */}
      {/* Top fade for brand area */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 28%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.75) 75%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* === SUBTLE SIDE VIGNETTE === */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
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
            gap: 16,
            marginBottom: "-50px",
          }}
        >
          {/* Left line */}
          <div
            style={{
              display: "flex",
              height: 1.5,
              width: 80,
              background: "rgba(255,255,255,0.5)",
            }}
          />
          {/* Diamond ornament */}
          <div
            style={{
              display: "flex",
              width: 10,
              height: 10,
              background: "#FFD54A",
              transform: "rotate(45deg)",
            }}
          />
          {/* Brand name */}
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 700,
              color: "white",
              letterSpacing: "6px",
              textTransform: "uppercase",
              fontFamily: "serif",
            }}
          >
            zuno
          </div>
          {/* Diamond ornament */}
          <div
            style={{
              display: "flex",
              width: 10,
              height: 10,
              background: "#FFD54A",
              transform: "rotate(45deg)",
            }}
          />
          {/* Right line */}
          <div
            style={{
              display: "flex",
              height: 1.5,
              width: 80,
              background: "rgba(255,255,255,0.5)",
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
          }}
        >
          {/* Line 1 — White italic */}
          <div
            style={{
              display: "flex",
              fontSize: 90,
              fontWeight: 700,
              fontStyle: "italic",
              color: "white",
              lineHeight: 1.0,
              letterSpacing: "-2px",
            }}
          >
            {titleLine1}
          </div>

          {/* Line 2 — Yellow italic */}
          <div
            style={{
              display: "flex",
              fontSize: 90,
              fontWeight: 700,
              fontStyle: "italic",
              color: "#FFD54A",
              lineHeight: 1.0,
              textShadow:
                "0 4px 32px rgba(0,0,0,0.4), 0 2px 12px rgba(255,180,0,0.3)",
              letterSpacing: "-2px",
            }}
          >
            {titleLine2}
          </div>

          {/* ─── META ROW: Date + Location ─── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 40,
              gap: 0,
              background: "rgba(0,0,0,0.35)",
              borderRadius: 100,
              border: "1px solid rgba(255,255,255,0.18)",
              overflow: "hidden",
            }}
          >
            {/* Date pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "18px 34px",
                fontSize: 26,
                color: "white",
                fontWeight: 500,
              }}
            >
              {/* Calendar icon */}
              <div
                style={{
                  display: "flex",
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: "2.5px solid rgba(255,255,255,0.7)",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "white",
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
                width: 1,
                height: 40,
                background: "rgba(255,255,255,0.25)",
              }}
            />

            {/* Location pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "18px 34px",
                fontSize: 26,
                color: "white",
                fontWeight: 500,
              }}
            >
              {/* Pin icon */}
              📍<span style={{ marginLeft: "2px" }}>{city}</span>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM ─── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            marginTop: "-100px",
          }}
        >
          {/* SPOTS BADGE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              border: "2.5px solid rgba(255, 213, 74, 0.75)",
              padding: "20px 48px",
              borderRadius: 20,
              background: "rgba(0,0,0,0.3)",
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
                fontSize: 80,
                fontWeight: 900,
                color: "#FFD54A",
                lineHeight: 1,
              }}
            >
              {spots}
            </div>

            {/* Label */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                SPOTS
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  color: "rgba(255,255,255,0.65)",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
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
              background: "#FFD54A",
              color: "#111111",
              padding: "22px 80px",
              borderRadius: 100,
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: "1.5px",
            }}
          >
            Join this plan on Zuno
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
