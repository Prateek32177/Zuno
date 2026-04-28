"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import {
  ChevronLeft,
  ChevronDown,
  MapPin,
  Users,
  Calendar,
  IndianRupee,
  X,
  Camera,
  ImageIcon,
  Trash2,
  Globe,
  Lock,
  UserCheck,
  Zap,
  Check,
  Eye,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { CATEGORY_META, getCityCategories } from "@/lib/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { DEFAULT_LAUNCH_CITY, INDIA_HIGH_POTENTIAL_CITIES } from "@/lib/cities";
import { useCity } from "@/components/CityContext";
import { RichTextEditor, RichTextDisplay } from "@/components/RichTextEditor";
import { createClient } from "@/lib/supabase/client";
import type { PlanCategory } from "@/lib/categories";

const DEFAULT_BANNER_URL =
  "https://i.pinimg.com/736x/0d/e0/41/0de041a6672a9b2eaa49f19f4d3bf03b.jpg";
const MAX_PEOPLE_PRESETS = [2, 4, 6, 10, 15, 20, 50];
const COST_PRESETS = [0, 100, 200, 500, 1000, 2000];

function toDatetimeLocalValue(date: Date) {
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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

function isDescriptionEmpty(html: string) {
  if (!html) return true;
  return html.replace(/<[^>]*>/g, "").trim().length === 0;
}

type PopupType = "people" | "visibility" | "cost" | "city" | null;

export default function CreatePlanPage() {
  const router = useRouter();
  const { selectedCity, setSelectedCity } = useCity();
  const [loading, setLoading] = useState(false);
  const [currentUserGender, setCurrentUserGender] = useState("");
  const [bannerUploading, setBannerUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [descOpen, setDescOpen] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activePopup, setActivePopup] = useState<PopupType>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as PlanCategory | "",
    city: DEFAULT_LAUNCH_CITY,
    location_name: "",
    google_maps_link: "",
    datetime: "",
    max_people: "",
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

  const handleBannerUpload = async (file: File) => {
    try {
      setBannerUploading(true);
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");
      const ext = file.name.split(".").pop();
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

  const canPublish =
    formData.title.trim() && formData.location_name.trim() && formData.datetime;

  const handlePublish = async () => {
    if (!canPublish) return;
    try {
      if (new Date(formData.datetime).getTime() < Date.now()) {
        toast.error("Please choose a future date and time");
        return;
      }
      if (formData.female_only && currentUserGender !== "female") {
        toast.error("Women-only plans can only be hosted by women");
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

  const peoplePillLabel = formData.max_people
    ? `${formData.max_people} people`
    : "Unlimited";

  const visPillLabel =
    formData.visibility === "invite_only"
      ? "Private"
      : formData.requireApproval
        ? "Approval"
        : "Open";

  const costPillLabel = formData.cost_amount
    ? `₹${formData.cost_amount}${formData.cost_mode === "per_person" ? "/pp" : " total"}`
    : "Free";

  // Bottom nav height + sticky CTA height padding
  const BOTTOM_OFFSET = 56; // BottomNav height
  const STICKY_BAR_HEIGHT = 68;

  return (
    <div
      className="min-h-screen cp-root"
      style={{
        background: "#FDFAF7",
        paddingBottom: BOTTOM_OFFSET + STICKY_BAR_HEIGHT + 16,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Satoshi:wght@400;500;600;700&display=swap');
        /* Fallback to Google Fonts alternatives */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,500;0,700;1,500&display=swap');

        * { box-sizing: border-box; }
        .cp-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .cp-heading { font-family: 'Fraunces', Georgia, serif; }

        /* ── FIELD ── */
        .field {
          width: 100%;
          border-radius: 10px;
          background: #fff;
          border: 1.5px solid #EDE8E1;
          padding: 9px 12px;
          font-size: 13px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
          color: #1C1410;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field:focus {
          border-color: #FF6B35;
          box-shadow: 0 0 0 3px rgba(255,107,53,0.1);
          background: #fff;
        }
        .field::placeholder { color: #C4B8AC; }

        /* ── LABEL ── */
        .lbl {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9C8778;
          margin-bottom: 5px;
        }

        /* ── CHIP (category / date presets) ── */
        .chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 11px; border-radius: 20px;
          font-size: 11.5px; font-weight: 600; cursor: pointer;
          white-space: nowrap; transition: all 0.12s;
          background: #fff; color: #5C4A38;
          border: 1.5px solid #EDE8E1;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .chip.on {
          background: #FF6B35;
          color: #fff;
          border-color: #FF6B35;
          box-shadow: 0 2px 8px rgba(255,107,53,0.35);
        }
        .chip:hover:not(.on) { border-color: #FF6B35; color: #FF6B35; }

        /* ── DEFAULT PILL (smart defaults) ── */
        .default-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 11px; border-radius: 20px;
          font-size: 11.5px; font-weight: 600; cursor: pointer;
          white-space: nowrap; transition: all 0.12s;
          background: #fff; color: #3D2B1F;
          border: 1.5px solid #EDE8E1;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .default-pill:hover { border-color: #FF6B35; color: #FF6B35; }
        .default-pill svg { opacity: 0.6; flex-shrink: 0; }
        .default-pill.active-pill {
          background: linear-gradient(135deg, #FF6B35, #FF9A5C);
          color: #fff; border-color: transparent;
          box-shadow: 0 2px 8px rgba(255,107,53,0.3);
        }
        .default-pill.active-pill svg { opacity: 1; }

        /* ── SEG (segment controls in popups) ── */
        .seg {
          border-radius: 8px; padding: 8px 0;
          font-size: 12px; font-weight: 700;
          transition: all 0.12s; cursor: pointer;
          background: #F5F0EC; color: #5C4A38;
          border: 1.5px solid transparent;
          display: flex; align-items: center; justify-content: center; gap: 5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .seg.on {
          background: #FF6B35; color: #fff;
          border-color: #FF6B35;
          box-shadow: 0 2px 8px rgba(255,107,53,0.3);
        }
        .seg:hover:not(.on) { border-color: #FF6B35; color: #FF6B35; }

        /* ── BANNER ── */
        .banner-shell {
          position: relative; height: 130px; border-radius: 12px;
          overflow: hidden; background: #F0EBE4;
          cursor: pointer; display: block;
        }
        .banner-shell img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .banner-empty {
          width: 100%; height: 100%; display: flex;
          flex-direction: column; align-items: center;
          justify-content: center; gap: 8px;
        }
        .banner-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%);
          display: flex; align-items: flex-end; padding: 9px 10px; gap: 7px;
          opacity: 0; transition: opacity 0.2s;
        }
        .banner-shell:hover .banner-scrim,
        .banner-shell:focus-within .banner-scrim { opacity: 1; }
        .bact {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 9px; border-radius: 6px; border: none;
          font-size: 10.5px; font-weight: 700; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── TOGGLE ── */
        .toggle-track {
          width: 34px; height: 19px; border-radius: 10px;
          background: #DDD5CC; transition: background 0.2s;
          position: relative; cursor: pointer; flex-shrink: 0;
        }
        .toggle-track.on { background: #FF6B35; }
        .toggle-thumb {
          position: absolute; top: 2px; left: 2px;
          width: 15px; height: 15px; border-radius: 50%;
          background: white; transition: transform 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .toggle-track.on .toggle-thumb { transform: translateX(15px); }

        /* ── INFO ROW ── */
        .info-row {
          border-radius: 10px; background: #fff;
          border: 1.5px solid #EDE8E1;
          padding: 10px 12px; display: flex;
          align-items: center; justify-content: space-between; gap: 10px;
        }

        /* ── ACCORDION ── */
        .accd-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px; cursor: pointer; border-radius: 10px;
          background: #fff;
          border: 1.5px solid #EDE8E1;
          transition: all 0.15s; user-select: none;
        }
        .accd-header:hover { border-color: #FF6B35; }
        .accd-header.open {
          border-color: #FF6B35;
          background: linear-gradient(135deg, #FFF5F1 0%, #FFF9F6 100%);
          border-radius: 10px 10px 0 0;
          border-bottom-color: #FFD5C4;
        }
        .accd-body {
          background: linear-gradient(135deg, #FFF5F1 0%, #FFFAF8 100%);
          border: 1.5px solid #FF6B35;
          border-top: none; border-radius: 0 0 10px 10px; padding: 12px;
        }
        .accd-arrow { transition: transform 0.2s; color: #C4B5A5; flex-shrink: 0; }
        .accd-arrow.open { transform: rotate(180deg); color: #FF6B35; }

        /* ── SCROLLBAR HIDE ── */
        .noscroll::-webkit-scrollbar { display: none; }
        .noscroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── STICKY BOTTOM CTA BAR ── */
        .sticky-cta {
          position: fixed;
          bottom: 56px; /* BottomNav height */
          left: 0; right: 0;
          z-index: 50;
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px 10px;
          background: rgba(253,250,247,0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(237,232,225,0.8);
          max-width: 480px;
          margin: 0 auto;
        }
        /* Center sticky bar properly */
        @media (min-width: 480px) {
          .sticky-cta { left: 50%; right: auto; transform: translateX(-50%); width: 480px; }
        }

        /* ── CTA BUTTON ── */
        .cta-btn {
          flex: 1; border-radius: 10px;
          padding: 8px 0; font-size: 13px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: opacity 0.15s, transform 0.1s;
          border: none; cursor: pointer;
        }
        .cta-btn:hover:not(:disabled) { opacity: 0.88; }
        .cta-btn:active:not(:disabled) { transform: scale(0.98); }
        .cta-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .cta-btn.secondary {
          background: #fff; color: #3D2B1F;
          border: 1.5px solid #EDE8E1; flex: 0 0 auto;
          padding: 8px 14px;
        }
        .cta-btn.secondary:hover:not(:disabled) { border-color: #FF6B35; color: #FF6B35; opacity: 1; }
        .cta-btn.publish {
          background: linear-gradient(135deg, #FF6B35 0%, #E8441A 100%);
          color: #fff;
          box-shadow: 0 4px 14px rgba(255,107,53,0.4);
        }
        .cta-btn.publish:hover:not(:disabled) { box-shadow: 0 6px 18px rgba(255,107,53,0.5); }

        /* ── RMETA (preview card meta row) ── */
        .rmeta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #7A6455; }

        /* ── SHEET OVERLAY ── */
        .sheet-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          z-index: 60; display: flex; align-items: flex-end; justify-content: center;
          animation: fadeIn 0.15s ease;
        }
        .sheet-panel {
          background: #FDFAF7; border-radius: 20px 20px 0 0;
          width: 100%; max-width: 480px;
          padding: 18px 16px 32px;
          animation: slideUp 0.22s cubic-bezier(0.32,0.72,0,1);
          max-height: 85vh; overflow-y: auto;
        }
        .sheet-panel::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(28px) } to { transform: translateY(0) } }

        .num-preset-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }

        /* ── CITY PILL in header ── */
        .city-pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
          background: linear-gradient(135deg, #FFF0E8, #FFE4D4);
          color: #C84B1F;
          border: 1px solid #FFD0B8;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.12s;
        }
        .city-pill:hover { background: linear-gradient(135deg, #FFE4D4, #FFD0B8); }
        .city-pill svg { width: 10px; height: 10px; }

        /* ── SECTION DIVIDER LABEL ── */
        .section-gap { margin-top: 14px; }

        /* ── CITY SHEET grid ── */
        .city-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;
        }
        .city-option {
          padding: 8px 6px; border-radius: 8px; text-align: center;
          font-size: 11.5px; font-weight: 600; cursor: pointer;
          border: 1.5px solid #EDE8E1; background: #fff;
          color: #3D2B1F; transition: all 0.12s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .city-option.on {
          background: linear-gradient(135deg, #FF6B35, #FF9A5C);
          color: #fff; border-color: transparent;
          box-shadow: 0 2px 8px rgba(255,107,53,0.3);
        }
        .city-option:hover:not(.on) { border-color: #FF6B35; color: #FF6B35; }

        /* ── Hint text ── */
        .hint { font-size: 11px; color: #B5A598; line-height: 1.45; }

        /* Info box in popups */
        .info-box {
          border-radius: 9px; background: #FFF5F1;
          border: 1px solid #FFD5C4;
          padding: 9px 12px; font-size: 11.5px;
          color: #7A4A32; line-height: 1.5; margin-bottom: 12px;
        }
        .info-box strong { color: #C84B1F; }
      `}</style>

      {/* ── HEADER ── */}
      <div
        className="sticky top-0 z-40"
        style={{
          background: "rgba(253,250,247,0.97)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #EDE8E1",
        }}
      >
        <div className="mx-auto max-w-md px-4 pt-4 pb-3 cp-root">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                height: 32,
                width: 32,
                borderRadius: "50%",
                background: "#fff",
                border: "1.5px solid #EDE8E1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.1s",
              }}
              className="active:scale-95"
            >
              <ChevronLeft
                style={{ width: 15, height: 15, color: "#5C4A38" }}
              />
            </button>

            <p
              className="cp-heading"
              style={{ fontSize: 15, fontWeight: 700, color: "#1C1410" }}
            >
              Create Plan
            </p>

            {/* City pill — top right */}
            <button
              type="button"
              className="city-pill"
              onClick={() => setActivePopup("city")}
            >
              <MapPin style={{ width: 9, height: 9 }} />
              {formData.city}
              <ChevronDown style={{ width: 9, height: 9, opacity: 0.6 }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN FORM ── */}
      <div
        className="mx-auto max-w-md px-4 pt-4 pb-2 cp-root"
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        {/* Banner */}
        <div>
          <span className="lbl">
            Banner{" "}
            <span
              style={{
                textTransform: "none",
                fontWeight: 400,
                color: "#C4B5A5",
              }}
            >
              optional
            </span>
          </span>
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
                <ImageIcon
                  style={{ width: 20, height: 20, color: "#C4B5A5" }}
                />
                <p style={{ fontSize: 11, color: "#C4B5A5", fontWeight: 600 }}>
                  Tap to add a banner
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
                className="bact"
                style={{ background: "white", color: "#3A2E2A" }}
                disabled={bannerUploading}
              >
                <Camera style={{ width: 10, height: 10 }} />
                {bannerUploading ? "Uploading..." : "Change"}
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
                    className="bact"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  >
                    <Trash2 style={{ width: 10, height: 10 }} />
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
        </div>

        {/* Title */}
        <div>
          <span className="lbl">Title</span>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Goa trip this weekend"
            className="field"
            style={{ fontSize: 14, fontWeight: 500 }}
            autoFocus
          />
        </div>

        {/* Location */}
        <div>
          <span className="lbl">Location</span>
          <input
            name="location_name"
            value={formData.location_name}
            onChange={handleChange}
            placeholder="Cubbon Park, Koramangala Social..."
            className="field"
          />
        </div>

        {/* Google Maps link */}
        <div>
          <span className="lbl">
            Meetup location link{" "}
            <span
              style={{
                textTransform: "none",
                fontWeight: 400,
                color: "#C4B5A5",
              }}
            >
              optional
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

        {/* When */}
        <div>
          <span className="lbl">When</span>
          <div
            className="flex gap-2 overflow-x-auto pb-1 noscroll"
            style={{ marginBottom: 7 }}
          >
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
                className={`chip flex-shrink-0 ${formData.datetime === toDatetimeLocalValue(preset.value) ? "on" : ""}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <input
            type="datetime-local"
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
            min={toDatetimeLocalValue(new Date())}
            className="field"
          />
        </div>

        {/* Smart defaults row */}
        <div>
          <span className="lbl">
            Details{" "}
            <span
              style={{
                textTransform: "none",
                fontWeight: 400,
                color: "#C4B5A5",
              }}
            >
              tap to change
            </span>
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            <button
              className={`default-pill ${formData.max_people ? "active-pill" : ""}`}
              onClick={() => setActivePopup("people")}
            >
              <Users style={{ width: 12, height: 12 }} />
              {peoplePillLabel}
            </button>
            <button
              className={`default-pill ${formData.visibility !== "public" || formData.requireApproval ? "active-pill" : ""}`}
              onClick={() => setActivePopup("visibility")}
            >
              <Globe style={{ width: 12, height: 12 }} />
              {visPillLabel}
            </button>
            <button
              className={`default-pill ${formData.cost_amount ? "active-pill" : ""}`}
              onClick={() => setActivePopup("cost")}
            >
              <IndianRupee style={{ width: 12, height: 12 }} />
              {costPillLabel}
            </button>
          </div>
        </div>

        {/* Category / Vibe */}
        <div>
          <span className="lbl">What's your Vibe?</span>
          <div className=" pb-1 gap-1 flex flex-wrap">
            {getCityCategories(formData.city).map((cat) => (
              <button
                key={cat.category}
                type="button"
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    category: p.category === cat.category ? "" : cat.category,
                  }))
                }
                className={`chip flex-shrink-0 ${formData.category === cat.category ? "on" : ""}`}
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

        {/* Description accordion */}
        <div>
          <div
            className={`accd-header ${descOpen ? "open" : ""}`}
            onClick={() => setDescOpen((v) => !v)}
          >
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: descOpen ? "#C84B1F" : "#5C4A38",
              }}
            >
              {descOpen ? "Description" : "+ Add description"}
            </span>
            <ChevronDown
              className={`accd-arrow ${descOpen ? "open" : ""}`}
              style={{ width: 14, height: 14 }}
            />
          </div>
          {descOpen && (
            <div className="accd-body">
              <RichTextEditor
                value={formData.description}
                onChange={(html) =>
                  setFormData((p) => ({ ...p, description: html }))
                }
                placeholder="What's the vibe? Itinerary, dress code, what's included..."
              />
            </div>
          )}
        </div>

        {/* Advanced settings accordion */}
        <div>
          <div
            className={`accd-header ${advOpen ? "open" : ""}`}
            onClick={() => setAdvOpen((v) => !v)}
          >
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: advOpen ? "#C84B1F" : "#5C4A38",
              }}
            >
              Advanced settings
            </span>
            <ChevronDown
              className={`accd-arrow ${advOpen ? "open" : ""}`}
              style={{ width: 14, height: 14 }}
            />
          </div>
          {advOpen && (
            <div
              className="accd-body"
              style={{ display: "flex", flexDirection: "column", gap: 9 }}
            >
              <div>
                <span className="lbl">
                  WhatsApp group link{" "}
                  <span
                    style={{
                      textTransform: "none",
                      fontWeight: 400,
                      color: "#C4B5A5",
                    }}
                  >
                    optional
                  </span>
                </span>
                <input
                  name="whatsapp_link"
                  value={formData.whatsapp_link}
                  onChange={handleChange}
                  placeholder="https://chat.whatsapp.com/..."
                  className="field"
                />
              </div>
              <div className="info-row">
                <div>
                  <p
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "#1C1410",
                    }}
                  >
                    Women only
                  </p>
                  <p style={{ fontSize: 11, color: "#A8917E", marginTop: 1 }}>
                    Only women can join this plan
                  </p>
                </div>
                <div
                  className={`toggle-track ${formData.female_only ? "on" : ""}`}
                  onClick={() =>
                    setFormData((p) => ({ ...p, female_only: !p.female_only }))
                  }
                >
                  <div className="toggle-thumb" />
                </div>
              </div>
              <div className="info-row">
                <div>
                  <p
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "#1C1410",
                    }}
                  >
                    Include host in spots & split
                  </p>
                  <p style={{ fontSize: 11, color: "#A8917E", marginTop: 1 }}>
                    Max count includes you
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
          )}
        </div>
      </div>

      {/* ══════════════════════════════
          STICKY CTA BAR
      ══════════════════════════════ */}
      <div className="sticky-cta">
        <button
          type="button"
          disabled={!canPublish}
          onClick={() => setShowPreview(true)}
          className="cta-btn secondary"
        >
          <Eye style={{ width: 14, height: 14 }} />
          Preview
        </button>
        <button
          type="button"
          disabled={!canPublish || loading}
          onClick={handlePublish}
          className="cta-btn publish"
        >
          {loading ? (
            "Publishing..."
          ) : (
            <>
              <Check style={{ width: 14, height: 14 }} />
              Publish plan
            </>
          )}
        </button>
      </div>

      {/* ══════════════════════════════
          POPUP — City
      ══════════════════════════════ */}
      {activePopup === "city" && (
        <div className="sheet-overlay" onClick={() => setActivePopup(null)}>
          <div
            className="sheet-panel cp-root"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <p
                className="cp-heading"
                style={{ fontSize: 15, fontWeight: 700, color: "#1C1410" }}
              >
                Choose city
              </p>
              <button
                type="button"
                onClick={() => setActivePopup(null)}
                style={{
                  height: 28,
                  width: 28,
                  borderRadius: "50%",
                  background: "#F5F0EC",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X style={{ width: 13, height: 13, color: "#9A8475" }} />
              </button>
            </div>
            <div className="city-grid">
              {INDIA_HIGH_POTENTIAL_CITIES.map((city) => (
                <button
                  key={city}
                  className={`city-option ${formData.city === city ? "on" : ""}`}
                  onClick={() => {
                    setFormData((p) => ({ ...p, city }));
                    setSelectedCity(city);
                    setActivePopup(null);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          POPUP — Max people
      ══════════════════════════════ */}
      {activePopup === "people" && (
        <div className="sheet-overlay" onClick={() => setActivePopup(null)}>
          <div
            className="sheet-panel cp-root"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <p
                className="cp-heading"
                style={{ fontSize: 15, fontWeight: 700, color: "#1C1410" }}
              >
                Max people
              </p>
              <button
                type="button"
                onClick={() => setActivePopup(null)}
                style={{
                  height: 28,
                  width: 28,
                  borderRadius: "50%",
                  background: "#F5F0EC",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X style={{ width: 13, height: 13, color: "#9A8475" }} />
              </button>
            </div>
            <div className="num-preset-row">
              <button
                className={`chip ${formData.max_people === "" ? "on" : ""}`}
                onClick={() => setFormData((p) => ({ ...p, max_people: "" }))}
              >
                Unlimited
              </button>
              {MAX_PEOPLE_PRESETS.map((n) => (
                <button
                  key={n}
                  className={`chip ${formData.max_people === String(n) ? "on" : ""}`}
                  onClick={() =>
                    setFormData((p) => ({ ...p, max_people: String(n) }))
                  }
                >
                  {n}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={formData.max_people}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || Number(v) >= 1)
                  setFormData((p) => ({ ...p, max_people: v }));
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
              placeholder="Custom number"
              className="field"
            />
            <button
              type="button"
              className="cta-btn publish"
              style={{ marginTop: 12, width: "100%", flex: "none" }}
              onClick={() => setActivePopup(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          POPUP — Visibility & joining
      ══════════════════════════════ */}
      {activePopup === "visibility" && (
        <div className="sheet-overlay" onClick={() => setActivePopup(null)}>
          <div
            className="sheet-panel cp-root"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <p
                className="cp-heading"
                style={{ fontSize: 15, fontWeight: 700, color: "#1C1410" }}
              >
                Visibility & joining
              </p>
              <button
                type="button"
                onClick={() => setActivePopup(null)}
                style={{
                  height: 28,
                  width: 28,
                  borderRadius: "50%",
                  background: "#F5F0EC",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X style={{ width: 13, height: 13, color: "#9A8475" }} />
              </button>
            </div>
            <span className="lbl">Visibility</span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <button
                className={`seg ${formData.visibility === "public" ? "on" : ""}`}
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    visibility: "public",
                    requireApproval: false,
                  }))
                }
              >
                <Globe style={{ width: 13, height: 13 }} /> Public
              </button>
              <button
                className={`seg ${formData.visibility === "invite_only" ? "on" : ""}`}
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    visibility: "invite_only",
                    requireApproval: false,
                  }))
                }
              >
                <Lock style={{ width: 13, height: 13 }} /> Private
              </button>
            </div>
            {formData.visibility === "public" && (
              <>
                <span className="lbl">Joining</span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <button
                    className={`seg ${formData.requireApproval ? "on" : ""}`}
                    onClick={() =>
                      setFormData((p) => ({ ...p, requireApproval: true }))
                    }
                  >
                    <UserCheck style={{ width: 13, height: 13 }} /> Approval
                  </button>
                  <button
                    className={`seg ${!formData.requireApproval ? "on" : ""}`}
                    onClick={() =>
                      setFormData((p) => ({ ...p, requireApproval: false }))
                    }
                  >
                    <Zap style={{ width: 13, height: 13 }} /> Open
                  </button>
                </div>
              </>
            )}
            <div className="info-box">
              <p>
                <strong>Public · Open</strong> — visible on feed, anyone joins
                instantly.
              </p>
              <p style={{ marginTop: 3 }}>
                <strong>Public · Approval</strong> — visible on feed, you review
                each request.
              </p>
              <p style={{ marginTop: 3 }}>
                <strong>Private</strong> — invite-only via link, hidden from
                feed.
              </p>
            </div>
            <button
              type="button"
              className="cta-btn publish"
              style={{ width: "100%", flex: "none" }}
              onClick={() => setActivePopup(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          POPUP — Cost
      ══════════════════════════════ */}
      {activePopup === "cost" && (
        <div className="sheet-overlay" onClick={() => setActivePopup(null)}>
          <div
            className="sheet-panel cp-root"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <p
                className="cp-heading"
                style={{ fontSize: 15, fontWeight: 700, color: "#1C1410" }}
              >
                Cost
              </p>
              <button
                type="button"
                onClick={() => setActivePopup(null)}
                style={{
                  height: 28,
                  width: 28,
                  borderRadius: "50%",
                  background: "#F5F0EC",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X style={{ width: 13, height: 13, color: "#9A8475" }} />
              </button>
            </div>
            <span className="lbl">Type</span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <button
                className={`seg ${formData.cost_mode === "per_person" ? "on" : ""}`}
                onClick={() =>
                  setFormData((p) => ({ ...p, cost_mode: "per_person" }))
                }
              >
                Per person
              </button>
              <button
                className={`seg ${formData.cost_mode === "total" ? "on" : ""}`}
                onClick={() =>
                  setFormData((p) => ({ ...p, cost_mode: "total" }))
                }
              >
                Total
              </button>
            </div>
            <span className="lbl">Amount</span>
            <div className="num-preset-row">
              {COST_PRESETS.map((n) => (
                <button
                  key={n}
                  className={`chip ${(n === 0 && formData.cost_amount === "") || formData.cost_amount === String(n) ? "on" : ""}`}
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      cost_amount: n === 0 ? "" : String(n),
                    }))
                  }
                >
                  {n === 0 ? "Free" : `₹${n}`}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={formData.cost_amount}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || Number(v) >= 0)
                  setFormData((p) => ({ ...p, cost_amount: v }));
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
              placeholder="Custom amount (₹)"
              className="field"
            />
            <div className="info-box" style={{ marginTop: 10 }}>
              Shown as an estimate. After the plan ends you can confirm the
              final amount — participants get a UPI payment option.
            </div>
            <button
              type="button"
              className="cta-btn publish"
              style={{ width: "100%", flex: "none" }}
              onClick={() => setActivePopup(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          PREVIEW SHEET
      ══════════════════════════════ */}
      {showPreview && (
        <div className="sheet-overlay" onClick={() => setShowPreview(false)}>
          <div
            className="sheet-panel cp-root"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <p
                className="cp-heading"
                style={{ fontSize: 15, fontWeight: 700, color: "#1C1410" }}
              >
                Preview
              </p>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                style={{
                  height: 28,
                  width: 28,
                  borderRadius: "50%",
                  background: "#F5F0EC",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X style={{ width: 13, height: 13, color: "#9A8475" }} />
              </button>
            </div>

            {/* Preview card */}
            <div
              style={{
                borderRadius: 14,
                overflow: "hidden",
                border: "1.5px solid #EDE8E1",
                background: "#fff",
              }}
            >
              {formData.image_url && (
                <div style={{ position: "relative" }}>
                  <img
                    src={formData.image_url}
                    style={{
                      height: 140,
                      width: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    alt="Banner"
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.38) 0%, transparent 60%)",
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <p
                    className="cp-heading"
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#1a1410",
                      lineHeight: 1.3,
                      flex: 1,
                    }}
                  >
                    {formData.title || "—"}
                  </p>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 7px",
                      borderRadius: 20,
                      background:
                        formData.visibility === "invite_only"
                          ? "#F0EDFF"
                          : formData.requireApproval
                            ? "#FFF5E0"
                            : "#E8F8EE",
                      color:
                        formData.visibility === "invite_only"
                          ? "#5B4BCC"
                          : formData.requireApproval
                            ? "#B07D00"
                            : "#1A7A42",
                      fontWeight: 700,
                      flexShrink: 0,
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
                  <div
                    style={{
                      borderBottom: "1px solid #EDE8E1",
                      paddingBottom: 9,
                    }}
                  >
                    <RichTextDisplay
                      html={formData.description}
                      variant="light"
                    />
                  </div>
                )}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                  <div className="rmeta">
                    <Calendar
                      style={{
                        width: 13,
                        height: 13,
                        opacity: 0.45,
                        flexShrink: 0,
                      }}
                    />
                    <span>{formatDateTime(formData.datetime)}</span>
                  </div>
                  <div className="rmeta">
                    <MapPin
                      style={{
                        width: 13,
                        height: 13,
                        opacity: 0.45,
                        flexShrink: 0,
                      }}
                    />
                    <span>
                      {formData.location_name}
                      {formData.city ? `, ${formData.city}` : ""}
                    </span>
                  </div>
                  <div className="rmeta">
                    <Users
                      style={{
                        width: 13,
                        height: 13,
                        opacity: 0.45,
                        flexShrink: 0,
                      }}
                    />
                    <span>
                      {formData.max_people
                        ? `Up to ${formData.max_people} people`
                        : "Unlimited spots"}
                    </span>
                  </div>
                  {formData.cost_amount && (
                    <div className="rmeta">
                      <IndianRupee
                        style={{
                          width: 13,
                          height: 13,
                          opacity: 0.45,
                          flexShrink: 0,
                        }}
                      />
                      <span>
                        ₹{formData.cost_amount}{" "}
                        {formData.cost_mode === "per_person"
                          ? `per person${formData.host_included_in_spots_and_splits ? " · host incl." : ""}`
                          : `total${formData.host_included_in_spots_and_splits ? " · host incl." : ""}`}
                      </span>
                    </div>
                  )}
                  {formData.female_only && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: "#FCE7F3",
                        color: "#9D174D",
                        fontWeight: 700,
                        alignSelf: "flex-start",
                      }}
                    >
                      Women only
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 14,
              }}
            >
              <button
                type="button"
                disabled={loading}
                onClick={handlePublish}
                className="cta-btn publish"
                style={{ flex: "none", width: "100%" }}
              >
                {loading ? (
                  "Publishing..."
                ) : (
                  <>
                    <Check style={{ width: 14, height: 14 }} />
                    Publish plan
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="cta-btn secondary"
                style={{
                  flex: "none",
                  width: "100%",
                  border: "1.5px solid #EDE8E1",
                }}
              >
                Edit more
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
