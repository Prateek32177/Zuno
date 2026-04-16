"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  Users,
  Lock,
  CheckCircle2,
} from "lucide-react";

export default function PlanDetailClient({ initialPlan }: any) {
  const [plan, setPlan] = useState(initialPlan);
  const [copied, setCopied] = useState(false);
  const [isJoined, setIsJoined] = useState(plan.is_joined);
  const [isSaved, setIsSaved] = useState(plan.is_favorite);

  const planDate = new Date(plan.datetime);

  const joinedCount =
    plan.participants?.filter((p: any) => p.status === "joined")
      .length || 0;

  const spotsLeft = Math.max(
    (plan.max_people || 1) - (joinedCount + 1),
    0
  );

  /* ---------- ACTIONS ---------- */

  const join = async () => {
    const res = await fetch(`/api/plans/${plan.id}/join`, {
      method: "POST",
    });

    if (res.ok) {
      setIsJoined(true);
    }
  };

  const leave = async () => {
    const res = await fetch(`/api/plans/${plan.id}/leave`, {
      method: "POST",
    });

    if (res.ok) {
      setIsJoined(false);
    }
  };

  const toggleSave = async () => {
    const method = isSaved ? "DELETE" : "POST";

    const res = await fetch(`/api/plans/${plan.id}/favorite`, {
      method,
    });

    if (res.ok) {
      setIsSaved(!isSaved);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/plans/${plan.id}`;

    if (navigator.share) {
      await navigator.share({
        title: plan.title,
        text: plan.description,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] pb-24">

      {/* IMAGE */}
      <div className="relative h-[380px] w-full">
        <img
          src={plan.image_url || "https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />

        {/* ACTIONS */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleSave}
            className="bg-white/90 p-2 rounded-full"
          >
            <Heart
              className={`h-5 w-5 ${
                isSaved ? "fill-[#ff5a3c] text-[#ff5a3c]" : ""
              }`}
            />
          </button>

          <button
            onClick={handleShare}
            className="bg-white/90 p-2 rounded-full"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* TITLE */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-3xl font-bold">{plan.title}</h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* ORGANIZER */}
        <Link
          href={`/profile/${plan.host_id}`}
          className="flex items-center gap-3"
        >
          <img
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${plan.host?.name}`}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="text-sm text-[#6e6258]">Hosted by</p>
            <p className="font-semibold">{plan.host?.name}</p>
          </div>
        </Link>

        {/* META */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-white rounded-xl border">
            <Calendar className="h-4 w-4 mb-1" />
            {planDate.toLocaleString()}
          </div>

          <div className="p-4 bg-white rounded-xl border">
            <Users className="h-4 w-4 mb-1" />
            {joinedCount + 1}/{plan.max_people}
          </div>
        </div>

        {/* LOCATION */}
        <a
          href={
            plan.google_maps_link ||
            `https://maps.google.com/?q=${encodeURIComponent(
              plan.location_name
            )}`
          }
          target="_blank"
          className="flex items-center gap-2 text-[#1a1410] font-medium"
        >
          <MapPin className="h-4 w-4" />
          {plan.location_name}
        </a>

        {/* DESCRIPTION */}
        <p className="text-[#6e6258]">{plan.description}</p>

        {/* PARTICIPANTS */}
        <div>
          <p className="font-semibold mb-3">
            People joining ({joinedCount})
          </p>

          <div className="flex items-center">
            {plan.participants?.map((p: any, i: number) => (
              <Link
                key={i}
                href={`/profile/${p.user_id}`}
              >
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${p.user?.name}`}
                  className="h-10 w-10 rounded-full border-2 border-white -ml-3 first:ml-0"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4">
          {isJoined ? (
            <button
              onClick={leave}
              className="w-full py-3 rounded-xl border font-semibold"
            >
              Leave plan
            </button>
          ) : (
            <button
              onClick={join}
              className="w-full py-3 rounded-xl bg-[#1a1410] text-white font-semibold"
            >
              {plan.visibility === "private"
                ? "Request to Join"
                : "Join Plan"}
            </button>
          )}
        </div>

        {/* SPOTS */}
        <p className="text-center text-sm text-[#d4522a] font-semibold">
          {spotsLeft} spots left
        </p>
      </div>
    </div>
  );
}