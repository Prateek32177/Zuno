"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Calendar,
  IndianRupee,
  Info,
  X,
  Camera,
  ImageIcon,
  Trash2,
  Globe,
  Lock,
  UserCheck,
  Zap,
  Check,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { CATEGORY_META, getCityCategories } from "@/lib/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { DEFAULT_LAUNCH_CITY, INDIA_HIGH_POTENTIAL_CITIES } from "@/lib/cities";
import { useCity } from "@/components/CityContext";
import { RichTextEditor, RichTextDisplay } from "@/components/RichTextEditor";
import { createClient } from "@/lib/supabase/client";
import type { PlanCategory } from "@/lib/categories";

const steps = ["Details", "Meetup", "Settings", "Review"];

const DEFAULT_BANNER_URL = "https://i.pinimg.com/736x/0d/e0/41/0de041a6672a9b2eaa49f19f4d3bf03b.jpg";
const MAX_PEOPLE_PRESETS = [2, 4, 6, 10, 15, 20, 50];
const COST_PRESETS = [0, 100, 200, 500, 1000, 2000];

function toDatetimeLocalValue(date: Date) {
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getDatePresets() {
  const now = new Date();
  const presets: { label: string; value: Date }[] = [];
  const todayEvening = new Date(now);
  todayEvening.setHours(19, 0, 0, 0);
  if (todayEvening > now)
    presets.push({ label: "Tonight 7 PM", value: todayEvening });
  const tomorrowEvening = new Date(now);
  tomorrowEvening.setDate(now.getDate() + 1);
  tomorrowEvening.setHours(18, 0, 0, 0);
  presets.push({ label: "Tomorrow 6 PM", value: tomorrowEvening });
  const sat = new Date(now);
  const daysToSat = (6 - now.getDay() + 7) % 7 || 7;
  sat.setDate(now.getDate() + daysToSat);
  sat.setHours(11, 0, 0, 0);
  presets.push({ label: "Sat 11 AM", value: sat });
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  sun.setHours(10, 0, 0, 0);
  presets.push({ label: "Sun 10 AM", value: sun });
  return presets;
}

function formatDateTime(dateString: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-IN", { month: "long" });
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const time =
    minutes === 0
      ? `${hours} ${ampm}`
      : `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  return `${day} ${month}, ${time}`;
}

export default function CreatePlanPage() {
  const router = useRouter();
  const { selectedCity, setSelectedCity } = useCity();
  const [showInfo, setShowInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentUserGender, setCurrentUserGender] = useState("");
  const [bannerUploading, setBannerUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other" as PlanCategory,
    city: DEFAULT_LAUNCH_CITY,
    location_name: "",
    google_maps_link: "",
    datetime: toDatetimeLocalValue(new Date()),
    max_people: "4",
    whatsapp_link: "",
    requireApproval: false,
    female_only: false,
    visibility: "public",
    image_url: DEFAULT_BANNER_URL,
    cost_mode: "per_person" as "per_person" | "total",
    cost_amount: "",
    host_included_in_spots_and_splits: true,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      city: selectedCity || DEFAULT_LAUNCH_CITY,
    }));
  }, [selectedCity]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data: me } = await supabase
        .from("users")
        .select("gender")
        .eq("id", auth.user.id)
        .maybeSingle();
      setCurrentUserGender(String(me?.gender || "").toLowerCase());
    };
    loadCurrentUser();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "city") setSelectedCity(value);
  };

  const isDescriptionEmpty = (html: string) => {
    if (!html) return true;
    return html.replace(/<[^>]*>/g, "").trim().length === 0;
  };

  const handleBannerUpload = async (file: File) => {
    try {
      setBannerUploading(true);
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");
      const ext = file.name.split(".").pop();
      // Path: plans/<userId>/<timestamp>.<ext>
      // foldername[1] = "plans", foldername[2] = userId — matches fixed RLS
      const path = `plans/${auth.user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("plan-banners")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from("plan-banners")
        .getPublicUrl(path);
      setFormData((prev) => ({ ...prev, image_url: urlData.publicUrl }));
      toast.success("Banner uploaded");
    } catch (err: any) {
      toast.error("Upload failed", { description: err.message });
    } finally {
      setBannerUploading(false);
    }
  };

  const canProceed = () =>
    currentStep === 0
      ? !!(formData.title.trim() && !isDescriptionEmpty(formData.description))
      : currentStep === 1
        ? !!(formData.location_name.trim() && formData.datetime)
        : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep((p) => p + 1);
      return;
    }
    try {
      if (new Date(formData.datetime).getTime() < Date.now()) {
        toast.error("Please choose a future date and time");
        setCurrentStep(1);
        return;
      }
      if (formData.female_only && currentUserGender !== "female") {
        toast.error("Women-only plans can only be hosted by women");
        setCurrentStep(2);
        return;
      }
      setLoading(true);
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image_url: formData.image_url || DEFAULT_BANNER_URL,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/plans/${data.id}`);
      } else {
        const err = await res.json();
        toast.error("Failed to create plan", { description: err.error });
      }
    } finally {
      setLoading(false);
    }
  };

  const datePresets = getDatePresets();

  return (
    <div className="min-h-screen bg-[#F7F3EF] pb-28 text-sm">
      <style>{`
        /* ── Typography ── */
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .cp-root { font-family: 'DM Sans', sans-serif; }
        .cp-heading { font-family: 'Lora', serif; }

        /* ── Token chip ── */
        .chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 13px; border-radius: 8px;
          font-size: 12px; font-weight: 500; cursor: pointer;
          white-space: nowrap; transition: all 0.12s;
          background: #EDE7DF; color: #5C4A38;
          border: 1.5px solid transparent;
        }
        .chip.on { background: #3D2B1F; color: #F7EEE5; border-color: #3D2B1F; }
        .chip:hover:not(.on) { border-color: #B89B84; }

        /* ── Segment ── */
        .seg {
          border-radius: 10px; padding: 10px 0;
          font-size: 12.5px; font-weight: 600;
          transition: all 0.12s; cursor: pointer;
          background: #EDE7DF; color: #5C4A38;
          border: 1.5px solid transparent;
          display: flex; align-items: center;
          justify-content: center; gap: 6px;
        }
        .seg.on { background: #3D2B1F; color: #F7EEE5; border-color: #3D2B1F; }
        .seg:hover:not(.on) { border-color: #B89B84; }

        /* ── Input ── */
        .field {
          width: 100%; border-radius: 10px;
          background: #EDE7DF; border: 1.5px solid transparent;
          padding: 12px 14px; font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          outline: none; color: #2A1F1A;
          transition: border-color 0.15s;
        }
        .field:focus { border-color: #B89B84; background: #EAE3DA; }
        .field::placeholder { color: #C4B5A5; }

        /* ── Section label ── */
        .lbl {
          display: block; font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #A8917E; margin-bottom: 8px;
        }

        /* ── Banner ── */
        .banner-shell {
          position: relative; height: 172px; border-radius: 14px;
          overflow: hidden; background: #EDE7DF;
          cursor: pointer; display: block;
        }
        .banner-shell img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .banner-empty {
          width: 100%; height: 100%; display: flex;
          flex-direction: column; align-items: center;
          justify-content: center; gap: 10px;
        }
        .banner-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
          display: flex; align-items: flex-end; padding: 12px 14px; gap: 8px;
          opacity: 0; transition: opacity 0.2s;
        }
        .banner-shell:hover .banner-scrim,
        .banner-shell:focus-within .banner-scrim { opacity: 1; }
        .bact {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 8px; border: none;
          font-size: 11.5px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Progress ── */
        .prog-dot {
          height: 6px; border-radius: 3px;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* ── Toggle switch ── */
        .toggle-track {
          width: 36px; height: 20px; border-radius: 10px;
          background: #D6CCBF; transition: background 0.2s;
          position: relative; cursor: pointer; flex-shrink: 0;
        }
        .toggle-track.on { background: #3D2B1F; }
        .toggle-thumb {
          position: absolute; top: 2px; left: 2px;
          width: 16px; height: 16px; border-radius: 8px;
          background: white; transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .toggle-track.on .toggle-thumb { transform: translateX(16px); }

        /* ── Info card ── */
        .info-card {
          border-radius: 10px; background: #EDE7DF;
          padding: 12px 14px; display: flex;
          align-items: flex-start; justify-content: space-between; gap: 12px;
        }

        /* ── Review card ── */
        .rmeta { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #7A6455; }

        /* ── Scrollbar hide ── */
        .noscroll::-webkit-scrollbar { display: none; }
        .noscroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── CTA ── */
        .cta-btn {
          width: 100%; border-radius: 12px;
          background: #3D2B1F; color: #F7EEE5;
          padding: 14px 0; font-size: 13.5px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.15s, transform 0.1s;
          border: none; cursor: pointer;
        }
        .cta-btn:hover:not(:disabled) { opacity: 0.9; }
        .cta-btn:active:not(:disabled) { transform: scale(0.99); }
        .cta-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .cta-btn.publish { background: linear-gradient(135deg, #C84B31 0%, #3D2B1F 100%); }

        /* ── Step heading ── */
        .step-sub { font-size: 12px; color: #A8917E; margin-top: 2px; }
      `}</style>

      {/* ── HEADER ── */}
      <div className="sticky top-0 z-40 bg-[#F7F3EF]/96 backdrop-blur-sm border-b border-[#EAE3DA]">
        <div className="mx-auto max-w-md px-4 pt-5 pb-4 cp-root">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() =>
                currentStep ? setCurrentStep((p) => p - 1) : router.back()
              }
              className="h-8 w-8 rounded-full bg-[#EDE7DF] flex items-center justify-center transition-transform active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 text-[#5C4A38]" />
            </button>
            <div className="text-center">
              <p className="cp-heading font-semibold text-[#2A1F1A] text-[14px] tracking-tight">
                Create Plan
              </p>
              <p className="step-sub">{steps[currentStep]}</p>
            </div>
            <span className="text-[11px] font-semibold text-[#A8917E] tabular-nums">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className="prog-dot flex-1"
                style={{
                  background:
                    i < currentStep
                      ? "#A8917E"
                      : i === currentStep
                        ? "#3D2B1F"
                        : "#DDD5CB",
                  opacity: i < currentStep ? 0.45 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── FORM ── */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md px-4 pt-6 pb-6 space-y-6 cp-root"
      >
        {/* Step heading */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="cp-heading text-[18px] font-bold text-[#2A1F1A] tracking-tight leading-tight">
              {currentStep === 0 && "What's the plan?"}
              {currentStep === 1 && "Where and when?"}
              {currentStep === 2 && "Settings"}
              {currentStep === 3 && "Looks good?"}
            </h2>
            <p className="step-sub mt-1">
              {currentStep === 0 && "Banner, title and vibe"}
              {currentStep === 1 && "Spot and time"}
              {currentStep === 2 && "Who can join and cost"}
              {currentStep === 3 && "Review before publishing"}
            </p>
          </div>
          {currentStep === 2 && (
            <button
              type="button"
              onClick={() => setShowInfo(true)}
              className="h-8 w-8 rounded-full bg-[#EDE7DF] flex items-center justify-center text-[#A8917E] mt-1"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* ════════════════════════════
            STEP 0 — Details
        ════════════════════════════ */}
        {currentStep === 0 && (
          <div className="space-y-5">
            {/* Banner */}
            <div>
              <span className="lbl">Banner</span>
              <div
                className="banner-shell"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && fileInputRef.current?.click()
                }
              >
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Banner" />
                ) : (
                  <div className="banner-empty">
                    <ImageIcon className="h-6 w-6 text-[#C4B5A5]" />
                    <p className="text-xs text-[#C4B5A5] font-medium">
                      Tap to add a banner photo
                    </p>
                  </div>
                )}
                <div className="banner-scrim">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="bact bg-white text-[#3A2E2A]"
                    disabled={bannerUploading}
                  >
                    <Camera className="h-3 w-3" />
                    {bannerUploading ? "Uploading..." : "Change photo"}
                  </button>
                  {formData.image_url &&
                    formData.image_url !== DEFAULT_BANNER_URL && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((p) => ({
                            ...p,
                            image_url: DEFAULT_BANNER_URL,
                          }));
                        }}
                        className="bact bg-white/20 text-white"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleBannerUpload(file);
                  e.target.value = "";
                }}
              />
              <p className="text-[11px] text-[#C4B5A5] mt-1.5 text-center">
                Default banner used if skipped
              </p>
            </div>

            {/* Title */}
            <div>
              <span className="lbl">Title</span>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Goa trip this weekend"
                className="field text-[14px] font-semibold"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <span className="lbl">Details</span>
              <RichTextEditor
                value={formData.description}
                onChange={(html) =>
                  setFormData((p) => ({ ...p, description: html }))
                }
                placeholder="What's the vibe? Itinerary, dress code, what's included..."
              />
            </div>

            {/* City */}
            <div>
              <span className="lbl">City</span>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="field"
              >
                {INDIA_HIGH_POTENTIAL_CITIES.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <span className="lbl">Category</span>
              <div className="flex gap-2 flex-wrap">
                {getCityCategories(formData.city).map((cat) => (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, category: cat.category }))
                    }
                    className={`chip ${formData.category === cat.category ? "on" : ""}`}
                  >
                    <CategoryIcon
                      icon={CATEGORY_META[cat.category].icon}
                      className="h-3 w-3"
                    />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════
            STEP 1 — Meetup
        ════════════════════════════ */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <span className="lbl">Meetup spot</span>
              <input
                name="location_name"
                value={formData.location_name}
                onChange={handleChange}
                placeholder="Cubbon Park, Koramangala Social..."
                className="field"
                autoFocus
              />
            </div>
            <div>
              <span className="lbl">
                Google Maps link{" "}
                <span className="normal-case font-normal text-[#C4B5A5]">
                  (optional)
                </span>
              </span>
              <input
                name="google_maps_link"
                value={formData.google_maps_link}
                onChange={handleChange}
                placeholder="maps.app.goo.gl/..."
                className="field"
              />
            </div>

            {/* Date quick picks */}
            <div>
              <span className="lbl">When</span>
              <div className="flex gap-2 overflow-x-auto pb-1 noscroll">
                {datePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        datetime: toDatetimeLocalValue(preset.value),
                      }))
                    }
                    className={`chip flex-shrink-0 ${
                      formData.datetime === toDatetimeLocalValue(preset.value)
                        ? "on"
                        : ""
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="mt-2.5">
                <input
                  type="datetime-local"
                  name="datetime"
                  value={formData.datetime}
                  onChange={handleChange}
                  min={toDatetimeLocalValue(new Date())}
                  className="field"
                />
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════
            STEP 2 — Settings
        ════════════════════════════ */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Max people */}
            <div>
              <span className="lbl">Max people</span>
              <div className="flex gap-2 flex-wrap mb-2.5">
                {MAX_PEOPLE_PRESETS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, max_people: String(n) }))
                    }
                    className={`chip ${formData.max_people === String(n) ? "on" : ""}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <input
                type="number"
                name="max_people"
                value={formData.max_people}
                min={1}
                step="1"
                inputMode="numeric"
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || Number(v) >= 1) handleChange(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                placeholder="Custom number"
                className="field"
              />
            </div>

            {/* Visibility */}
            <div>
              <span className="lbl">Visibility</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      visibility: "public",
                      requireApproval: false,
                    }))
                  }
                  className={`seg ${formData.visibility === "public" ? "on" : ""}`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  Public
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      visibility: "invite_only",
                      requireApproval: false,
                    }))
                  }
                  className={`seg ${formData.visibility === "invite_only" ? "on" : ""}`}
                >
                  <Lock className="h-3.5 w-3.5" />
                  Private
                </button>
              </div>
            </div>

            {formData.visibility === "public" && (
              <div>
                <span className="lbl">Joining</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, requireApproval: true }))
                    }
                    className={`seg ${formData.requireApproval ? "on" : ""}`}
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Approval
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, requireApproval: false }))
                    }
                    className={`seg ${!formData.requireApproval ? "on" : ""}`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Open to all
                  </button>
                </div>
              </div>
            )}

            {/* Cost */}
            <div>
              <span className="lbl">
                Cost{" "}
                <span className="normal-case font-normal text-[#C4B5A5]">
                  (optional)
                </span>
              </span>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, cost_mode: "per_person" }))
                  }
                  className={`seg ${formData.cost_mode === "per_person" ? "on" : ""}`}
                >
                  Per person
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, cost_mode: "total" }))
                  }
                  className={`seg ${formData.cost_mode === "total" ? "on" : ""}`}
                >
                  Total
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mb-2.5">
                {COST_PRESETS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        cost_amount: n === 0 ? "" : String(n),
                      }))
                    }
                    className={`chip ${
                      (n === 0 && formData.cost_amount === "") ||
                      formData.cost_amount === String(n)
                        ? "on"
                        : ""
                    }`}
                  >
                    {n === 0 ? "Free" : `₹${n}`}
                  </button>
                ))}
              </div>
              <input
                name="cost_amount"
                value={formData.cost_amount}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || Number(v) >= 0) handleChange(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Custom amount (₹)"
                className="field"
              />
              <div className="info-card mt-2.5">
                <div>
                  <p className="text-[12.5px] font-semibold text-[#2A1F1A]">
                    Include host in spots and split
                  </p>
                  <p className="text-[11px] text-[#A8917E] mt-0.5">
                    Max people count includes you as host
                  </p>
                </div>
                <div
                  className={`toggle-track ${formData.host_included_in_spots_and_splits ? "on" : ""}`}
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      host_included_in_spots_and_splits:
                        !p.host_included_in_spots_and_splits,
                    }))
                  }
                >
                  <div className="toggle-thumb" />
                </div>
              </div>
            </div>

            {/* Optional extras */}
            <div className="space-y-2.5">
              <span className="lbl">Optional extras</span>
              <input
                name="whatsapp_link"
                value={formData.whatsapp_link}
                onChange={handleChange}
                placeholder="WhatsApp group link"
                className="field"
              />
              <div className="info-card">
                <div>
                  <p className="text-[12.5px] font-semibold text-[#2A1F1A]">
                    Women only
                  </p>
                  <p className="text-[11px] text-[#A8917E]">
                    Only women can join this plan
                  </p>
                </div>
                <div
                  className={`toggle-track ${formData.female_only ? "on" : ""}`}
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      female_only: !p.female_only,
                    }))
                  }
                >
                  <div className="toggle-thumb" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════
            STEP 3 — Review
        ════════════════════════════ */}
        {currentStep === 3 && (
          <div className="overflow-hidden rounded-14px border border-[#DDD5CB] bg-[#EDE7DF] shadow-sm" style={{ borderRadius: 14 }}>
            {formData.image_url && (
              <div className="relative">
                <img
                  src={formData.image_url}
                  className="h-[152px] w-full object-cover"
                  alt="Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              </div>
            )}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="cp-heading text-[15px] font-bold text-[#1a1410] leading-snug tracking-tight">
                  {formData.title}
                </p>
                <span
                  className="text-[10.5px] px-2 py-0.5 rounded-md font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: "#DDD5CB",
                    color: "#5c4a38",
                  }}
                >
                  {formData.visibility === "invite_only"
                    ? "Private"
                    : formData.requireApproval
                      ? "Approval"
                      : "Open"}
                </span>
              </div>

              {!isDescriptionEmpty(formData.description) && (
                <div className="border-b border-[#DDD5CB] pb-3">
                  <RichTextDisplay
                    html={formData.description}
                    variant="light"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="rmeta">
                  <Calendar className="h-3.5 w-3.5 opacity-50 flex-shrink-0" />
                  <span>{formatDateTime(formData.datetime)}</span>
                </div>
                <div className="rmeta">
                  <MapPin className="h-3.5 w-3.5 opacity-50 flex-shrink-0" />
                  <span>
                    {formData.location_name}
                    {formData.city ? `, ${formData.city}` : ""}
                  </span>
                </div>
                <div className="rmeta">
                  <Users className="h-3.5 w-3.5 opacity-50 flex-shrink-0" />
                  <span>Up to {formData.max_people} people</span>
                </div>
                {formData.cost_amount && (
                  <div className="rmeta">
                    <IndianRupee className="h-3.5 w-3.5 opacity-50 flex-shrink-0" />
                    <span>
                      {formData.cost_amount}{" "}
                      {formData.cost_mode === "per_person"
                        ? `per person${formData.host_included_in_spots_and_splits ? " · host incl." : ""}`
                        : `total${formData.host_included_in_spots_and_splits ? " · host incl." : ""}`}
                    </span>
                  </div>
                )}
                {formData.female_only && (
                  <span
                    className="inline-block text-[10.5px] px-2 py-0.5 rounded-md font-bold mt-0.5"
                    style={{ background: "#FCE7F3", color: "#9D174D" }}
                  >
                    Women only
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          type="submit"
          disabled={!canProceed() || loading}
          className={`cta-btn ${currentStep === steps.length - 1 ? "publish" : ""}`}
        >
          {loading ? (
            "Publishing..."
          ) : currentStep === steps.length - 1 ? (
            <>
              <Check className="h-4 w-4" />
              Publish plan
            </>
          ) : (
            <>
              Next — {steps[currentStep + 1]}
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div
            className="w-full max-w-sm bg-white p-5 shadow-2xl cp-root"
            style={{ borderRadius: 18 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="cp-heading font-bold text-[#2A1F1A] text-[15px]">
                How settings work
              </p>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="h-7 w-7 rounded-full bg-[#F3EDE6] flex items-center justify-center text-[#9A8475]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-4 text-xs leading-relaxed text-[#6A5A50]">
              <div className="space-y-1.5">
                <p className="font-bold text-[#2A1F1A] text-[12px]">
                  Visibility
                </p>
                <p>
                  <span className="font-semibold text-[#3D2B1F]">
                    Public — open
                  </span>{" "}
                  Visible on feed, anyone joins instantly.
                </p>
                <p>
                  <span className="font-semibold text-[#3D2B1F]">
                    Public — approval
                  </span>{" "}
                  Visible on feed, you review each request.
                </p>
                <p>
                  <span className="font-semibold text-[#3D2B1F]">Private</span>{" "}
                  Invite-only via link, hidden from feed.
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="font-bold text-[#2A1F1A] text-[12px]">Cost</p>
                <p>
                  Shown as an estimate. After the plan ends you can confirm the
                  final amount — participants get a UPI payment option.
                </p>
                <p className="text-[#A8917E]">
                  Set your UPI ID in your profile first.
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="font-bold text-[#2A1F1A] text-[12px]">
                  WhatsApp
                </p>
                <p>Only joined participants can see the group link.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}