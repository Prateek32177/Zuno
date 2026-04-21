"use client";

import { useState } from "react";

export function inferCategory(title: string): PlanCategory {
  const t = (title ?? "").toLowerCase();
  if (/chai|tea|coffee|brunch|caf|eat|food|dinner|lunch/.test(t)) return "food";
  if (/morning|sunrise|breakfast/.test(t)) return "morning";
  if (/trek|hike|trail|walk|run|cycle/.test(t)) return "outdoor";
  if (/lake|sunset|river|beach|shore|pichola|marine/.test(t)) return "lake";
  if (/rooftop|night|evening|lights/.test(t)) return "evening";
  return "social";
}

export type PlanCategory =
  | "evening"
  | "morning"
  | "outdoor"
  | "lake"
  | "food"
  | "social";

export interface ZunoPlan {
  id: string;
  slug?: string;
  title: string;
  location: string;
  datetime: string | Date;
  spotsLeft: number;
  totalSpots: number;
  city: string;
  category?: PlanCategory;
  participants?: { initials: string; color: string }[];
}

export default function PlanShareCardOG({ plan }: { plan: any }) {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  

  // 🔥 Build OG URL (SOURCE OF TRUTH)
  const params = new URLSearchParams({
    title: plan.title,
    location: plan.location,
    city: plan.city,
    date: formatDate(plan.datetime),
    spots: String(plan.spotsLeft),
    slug: shortSlug(plan),
    category: plan.category || inferCategory(plan.title),
  });

  const ogUrl = `/api/og?${params.toString()}`;

  // ─── DOWNLOAD (REAL IMAGE) ─────────────────────────────

  async function handleDownload() {
    setDownloading(true);

    try {
      const res = await fetch(ogUrl);
      if (!res.ok) throw new Error("OG failed");

      const blob = await res.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `zuno-${shortSlug(plan)}.png`;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  }

  // ─── SHARE ─────────────────────────────────────────────

  async function handleShare() {
    setSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: plan.title,
          text: `${plan.title} · ${plan.location}`,
          url: `https://zuno.app/p/${plan.id}`,
        });
      } else {
        await navigator.clipboard.writeText(
          `https://zuno.app/p/${plan.id}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}

    setSharing(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(
      `https://zuno.app/p/${plan.id}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ─── UI ────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      {/* 🔥 REAL OG PREVIEW */}
      <div
        style={{
          width: 270,
          height: 337, // 4:5 ratio
          borderRadius: 16,
          overflow: "hidden",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.25), 0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={ogUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* BUTTONS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: 260,
        }}
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={btnPrimary}
        >
          {downloading ? "Saving..." : "Save image for story"}
        </button>

        <button
          onClick={handleShare}
          disabled={sharing}
          style={btnSecondary}
        >
          {sharing ? "Opening..." : "Share link"}
        </button>

        <button onClick={handleCopy} style={btnGhost}>
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────

const btnPrimary = {
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "14px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const btnSecondary = {
  background: "transparent",
  color: "#111",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 12,
  padding: "14px",
  fontSize: 14,
  cursor: "pointer",
};

const btnGhost = {
  background: "transparent",
  color: "rgba(0,0,0,0.5)",
  border: "none",
  fontSize: 12,
  cursor: "pointer",
};

// ─── HELPERS (reuse yours) ─────────────────────────────

function shortSlug(plan: any) {
  return plan.slug || plan.id.slice(0, 8);
}

function formatDate(dt: any) {
  const d = new Date(dt);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

