"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Share2, Users, Zap, Lock, Clock } from "lucide-react";
import { Plan } from "@/lib/types";
import { CATEGORY_META } from "@/lib/categories";
import { parseDatetimeLocal, formatDate, formatTime } from "@/lib/datetime";
import { CategoryIcon } from "@/components/CategoryIcon";
import {
  computeEffectivePlanStatus,
  getJoinedParticipantsCount,
  getParticipantCapacity,
  isHostIncludedInSpots,
  normalizeVisibility,
  statusLabel,
  statusBadge,
} from "@/lib/plan";
import { buildDicebearAvatarUrl, generateAvatarSeed } from "@/lib/avatar";

const AVATAR_COLORS = [
  "#FED7AA",
  "#DBEAFE",
  "#DCFCE7",
  "#F5D0FE",
  "#FDE68A",
  "#BFDBFE",
  "#FBCFE8",
  "#DDD6FE",
];

function hashCode(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h << 5) - h + value.charCodeAt(i);
  return h;
}

// Deterministic seed from participant id so avatars don't re-randomise on re-render
function seedFromId(id: string) {
  let h = Math.abs(hashCode(id));
  return h.toString(36).padStart(12, "0").slice(0, 12);
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getUrgencySignal(
  spotsLeft: number,
  joinedCount: number,
): {
  text: string;
  type: "fire" | "warn" | "new" | null;
} {
  if (spotsLeft === 0) return { text: "Full", type: null };
  if (spotsLeft === 1) return { text: "Last spot!", type: "fire" };
  if (spotsLeft <= 3) return { text: `${spotsLeft} spots left`, type: "warn" };
  if (joinedCount === 0) return { text: "Be first to join", type: "new" };
  return { text: `${spotsLeft} spots open`, type: null };
}

export function PlanCard({
  plan,
  onToggleFavorite,
}: {
  plan: Plan;
  onToggleFavorite?: () => void;
  isAuthed?: boolean;
}) {
  const [heartAnim, setHeartAnim] = useState(false);

  if (!plan) return null;

  const planDate = plan.datetime
    ? parseDatetimeLocal(plan.datetime)
    : new Date();
  const joinedParticipants = (plan.participants || []).filter(
    (p: any) => p.status === "joined",
  );
  const joinedCount = getJoinedParticipantsCount(plan.participants);
  const participantCapacity = getParticipantCapacity(plan);
  const spotsLeft = Math.max(participantCapacity - joinedCount, 0);
  const effectiveStatus = computeEffectivePlanStatus(plan as any);
  const badge = statusBadge(effectiveStatus);
  const visibility = normalizeVisibility(plan.visibility);
  const isHost = plan.current_user_id && plan.host_id === plan.current_user_id;
  const userHasJoined = !!plan.is_joined;

  const hostIncluded = isHostIncludedInSpots(plan);
  const genderAggregate = joinedParticipants.reduce(
    (acc: any, p: any) => {
      const g = String(p.user?.gender || "").toLowerCase();
      if (g === "male") acc.male += 1;
      else if (g === "female") acc.female += 1;
      return acc;
    },
    { male: 0, female: 0 },
  );
  if (hostIncluded) {
    const hg = String((plan as any).host?.gender || "").toLowerCase();
    if (hg === "male") genderAggregate.male += 1;
    else if (hg === "female") genderAggregate.female += 1;
  }

  const urgency = getUrgencySignal(spotsLeft, joinedCount);

  // Fake-but-plausible "recent join" signal derived deterministically from plan id
  const recentJoinName =
    joinedParticipants.length > 0
      ? (joinedParticipants[0] as any)?.user?.name?.split(" ")[0]
      : null;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/${plan.short_id}`;
    if (navigator.share) navigator.share({ title: plan.title, url });
    else navigator.clipboard.writeText(url);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 600);
    onToggleFavorite?.();
  };

  const isOpen = effectiveStatus === "open" && spotsLeft > 0;
  const categoryMeta =
    CATEGORY_META[plan.category as keyof typeof CATEGORY_META];

  return (
    <Link href={`/plans/${plan.id}`} className="block group">
      <article className="plan-card overflow-hidden rounded-[22px] bg-white">
        {/* ── IMAGE ZONE ── */}
        <div className="relative h-40 overflow-hidden bg-[#EAE0D5]">
          <img
            src={
              plan.image_url ||
              "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800"
            }
            alt={plan.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />

          {/* Multi-stop gradient for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.58) 100%)",
            }}
          />

          {/* Top-left: category chip */}
          <div className="absolute left-3 top-3">
            <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#2A1F1A] shadow-sm backdrop-blur-sm">
              <CategoryIcon
                icon={categoryMeta?.icon || "sparkles"}
                className="h-3 w-3"
              />
              {categoryMeta?.label || "Plan"}
            </div>
          </div>

          {/* Top-right: status badge OR private */}
          <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
            {(visibility === "invite_only" || visibility === "private") && (
              <div className="flex items-center gap-1 rounded-full bg-[#1a1410]/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                <Lock className="h-2.5 w-2.5" />
                {visibility === "private" ? "Private" : "Invite only"}
              </div>
            )}
            {plan.female_only && (
              <div className="rounded-full bg-pink-500/90 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                Women only
              </div>
            )}
            {badge && effectiveStatus !== "open" && (
              <div
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm ${badge.className}`}
              >
                {badge.text}
              </div>
            )}
          </div>

          {/* Bottom-left: live activity signal */}
          {recentJoinName && joinedCount > 0 && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-white">
                  {recentJoinName} joined
                  {joinedCount > 1 ? ` + ${joinedCount - 1} more` : ""}
                </span>
              </div>
            </div>
          )}

          {/* Bottom-right: heart */}
          <button
            onClick={handleFavorite}
            className={`absolute bottom-3 right-3 heart-btn rounded-full p-2.5 shadow-lg backdrop-blur-sm transition-all ${
              plan.is_favorite ? "bg-red-500" : "bg-white/85"
            } ${heartAnim ? "heart-pop" : ""}`}
          >
            <Heart
              className={`h-3 w-3 transition-colors ${
                plan.is_favorite ? "fill-white text-white" : "text-[#5a4e42]"
              }`}
            />
          </button>
        </div>

        {/* ── CONTENT ZONE ── */}
        <div className="p-3">
          {/* Title + date row */}
          <h3 className="plan-title text-[15.5px] font-bold leading-snug text-[#1a1410] line-clamp-2 flex-1">
            {plan.title}
          </h3>
          <div className="flex items-center justify-between mb-1.5">
            <div className="mt-2 flex items-center gap-2 text-[12px] font-semibold text-[#6e6258]">
              <p className="text-[12px] font-bold ">{formatDate(planDate)}</p>
              <p className="text-[11px] ">{formatTime(planDate)}</p>
            </div>
            {/* Urgency tag */}
            <UrgencyChip urgency={urgency} effectiveStatus={effectiveStatus} />
          </div>

          {/* Divider */}
          <div className="my-2 h-px bg-[#F0E8DF]" />

          {/* Bottom row: cost + CTA */}
          <div className="flex items-center justify-between gap-3">
            {/* Capacity bar */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <AvatarStack participants={joinedParticipants} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="h-9 w-9 rounded-full bg-[#F3EDE6] flex items-center justify-center text-[#7A6455] transition-colors hover:bg-[#EAE0D5]"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
              {isHost ? (
                <ActionPill label="Hosting" variant="host" />
              ) : userHasJoined ? (
                <ActionPill label="Joined" variant="joined" />
              ) : (
                <ActionPill
                  label={
                    effectiveStatus === "open" && spotsLeft > 0
                      ? "Join plan"
                      : statusLabel(spotsLeft === 0 ? "full" : effectiveStatus)
                  }
                  variant={isOpen ? "join" : "disabled"}
                  disabled={!isOpen}
                />
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function UrgencyChip({
  urgency,
  effectiveStatus,
}: {
  urgency: ReturnType<typeof getUrgencySignal>;
  effectiveStatus: string;
}) {
  if (effectiveStatus !== "open") return null;
  if (!urgency.text) return null;

  const styles: Record<string, string> = {
    fire: "bg-red-50 text-red-600 border border-red-200",
    warn: "bg-amber-50 text-amber-700 border border-amber-200",
    new: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };

  const icons: Record<string, React.ReactNode> = {
    fire: <Zap className="h-2.5 w-2.5" />,
    warn: <Clock className="h-2.5 w-2.5" />,
    new: <Zap className="h-2.5 w-2.5" />,
  };

  const cls = urgency.type
    ? styles[urgency.type]
    : "bg-[#F3EDE6] text-[#7A6455]";
  const icon = urgency.type ? (
    icons[urgency.type]
  ) : (
    <Users className="h-2.5 w-2.5" />
  );

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${cls}`}
    >
      {icon}
      {urgency.text}
    </div>
  );
}

function ActionPill({
  label,
  variant,
  disabled,
}: {
  label: string;
  variant: "join" | "host" | "joined" | "disabled";
  disabled?: boolean;
}) {
  const styles = {
    join: "bg-[#1a1410] text-white hover:bg-[#2e251e] shadow-sm shadow-black/10",
    host: "bg-[#4a3a2f] text-white",
    joined: "bg-emerald-600 text-white",
    disabled: "bg-[#EAE0D5] text-[#B0A090] cursor-not-allowed",
  };

  return (
    <button
      disabled={disabled}
      className={`rounded-full px-4 py-2 text-[12px] font-bold transition-all ${styles[variant]}`}
    >
      {label}
    </button>
  );
}

function AvatarStack({ participants }: { participants: any[] }) {
  if (!participants.length) return;

  const visible = participants.slice(0, 5);
  const extra = participants.length - visible.length;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {visible.map((p, i) => {
          const uid = p.user_id || String(i);
          const avatarUrl = p.user?.avatar_url;
          const color =
            AVATAR_COLORS[Math.abs(hashCode(uid)) % AVATAR_COLORS.length];
          const seed = seedFromId(uid);

          return (
            <div
              key={uid}
              className="-ml-2 first:ml-0 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm"
              style={{ background: color }}
              title={p.user?.name}
            >
              <img
                src={avatarUrl || buildDicebearAvatarUrl(seed)}
                alt={p.user?.name || ""}
                className="h-full w-full object-cover"
              />
            </div>
          );
        })}
      </div>
      <p className="text-[11.5px] text-[#9A8880]">
        {participants.length === 1
          ? `${participants[0]?.user?.name?.split(" ")[0] || "1 person"} joined`
          : `${participants.length} people in`}
        {extra > 0 ? ` +${extra}` : ""}
      </p>
    </div>
  );
}
