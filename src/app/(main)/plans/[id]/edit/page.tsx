"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import {
  ChevronLeft,
  Info,
  Camera,
  Trash2,
  ImageIcon,
  Globe,
  Lock,
  UserCheck,
  Zap,
  X,
  Save,
} from "lucide-react";
import { CATEGORY_META, getCityCategories } from "@/lib/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { RichTextEditor } from "@/components/RichTextEditor";
import { INDIA_HIGH_POTENTIAL_CITIES } from "@/lib/cities";
import { useCity } from "@/components/CityContext";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_BANNER_URL = "/images/default-plan-banner.jpg";
const MAX_PEOPLE_PRESETS = [2, 4, 6, 10, 15, 20, 50];
const COST_PRESETS = [0, 100, 200, 500, 1000, 2000];

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<any>({
    cost_mode: "per_person",
    visibility: "public",
    host_included_in_spots_and_splits: true,
    image_url: DEFAULT_BANNER_URL,
  });
  const { selectedCity, setSelectedCity } = useCity();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const res = await fetch(`/api/plans/${id}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error("Unable to load plan");
        router.replace("/my-plans");
        return;
      }
      setForm({
        ...data,
        requireApproval: !!data.approval_mode,
        cost_mode: data.cost_mode || "per_person",
        cost_amount: data.cost_amount || "",
        image_url: data.image_url || DEFAULT_BANNER_URL,
      });
      setLoading(false);
    };
    load();
  }, [id, router]);

  const update = (key: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [key]: value }));

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

      update("image_url", urlData.publicUrl);
      toast.success("Banner updated");
    } catch (err: any) {
      toast.error("Upload failed", { description: err.message });
    } finally {
      setBannerUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      image_url: form.image_url || DEFAULT_BANNER_URL,
      visibility:
        form.visibility === "private" ? "invite_only" : form.visibility,
    };
    const res = await fetch(`/api/plans/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok)
      return toast.error("Failed to save plan", {
        description: data.error || "Please try again.",
      });
    if (form.city !== selectedCity) setSelectedCity(form.city);
    toast.success("Plan saved");
    router.push(`/plans/${id}`);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#F7F3EF] flex items-center justify-center">
        <div className="text-[#A8917E] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Loading plan...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F7F3EF] text-sm">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .ep-root { font-family: 'DM Sans', sans-serif; }
        .ep-heading { font-family: 'Lora', serif; }

        /* Chip */
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

        /* Segment */
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

        /* Input */
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

        /* Label */
        .lbl {
          display: block; font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #A8917E; margin-bottom: 8px;
        }

        /* Banner */
        .banner-shell {
          position: relative; height: 180px; border-radius: 14px;
          overflow: hidden; background: #EDE7DF;
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
        .banner-shell:hover .banner-scrim { opacity: 1; }
        .bact {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 8px; border: none;
          font-size: 11.5px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        /* Toggle */
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

        /* Info card */
        .info-card {
          border-radius: 10px; background: #EDE7DF;
          padding: 12px 14px; display: flex;
          align-items: flex-start; justify-content: space-between; gap: 12px;
        }

        /* Save btn */
        .save-btn {
          width: 100%; border-radius: 12px;
          background: #3D2B1F; color: #F7EEE5;
          padding: 14px 0; font-size: 13.5px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.15s, transform 0.1s;
          border: none; cursor: pointer;
        }
        .save-btn:hover:not(:disabled) { opacity: 0.9; }
        .save-btn:active:not(:disabled) { transform: scale(0.99); }
        .save-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Scrollbar hide */
        .noscroll::-webkit-scrollbar { display: none; }
        .noscroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-[#F7F3EF]/96 backdrop-blur-sm border-b border-[#EAE3DA]">
        <div className="mx-auto max-w-md px-4 pt-5 pb-4 flex items-center justify-between ep-root">
          <button
            onClick={() => router.back()}
            className="h-8 w-8 rounded-full bg-[#EDE7DF] flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4 text-[#5C4A38]" />
          </button>
          <div className="text-center">
            <p className="ep-heading font-semibold text-[#2A1F1A] text-[14px] tracking-tight">
              Edit Plan
            </p>
            <p className="text-[11px] text-[#A8917E] mt-0.5">
              Changes save instantly
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            className="h-8 w-8 rounded-full bg-[#EDE7DF] flex items-center justify-center text-[#A8917E]"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-5 pb-28 space-y-6 ep-root">

        {/* BANNER */}
        <div>
          <span className="lbl">Banner</span>
          <div className="banner-shell">
            {form.image_url ? (
              <img src={form.image_url} alt="Banner" />
            ) : (
              <div className="banner-empty">
                <ImageIcon className="h-6 w-6 text-[#C4B5A5]" />
                <p className="text-xs text-[#C4B5A5]">No banner set</p>
              </div>
            )}
            <div className="banner-scrim">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bact bg-white text-[#3A2E2A]"
                disabled={bannerUploading}
              >
                <Camera className="h-3 w-3" />
                {bannerUploading ? "Uploading..." : "Change photo"}
              </button>
              {form.image_url && form.image_url !== DEFAULT_BANNER_URL && (
                <button
                  type="button"
                  onClick={() => update("image_url", DEFAULT_BANNER_URL)}
                  className="bact bg-white/20 text-white"
                >
                  <Trash2 className="h-3 w-3" />
                  Reset
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
            Hover to change photo
          </p>
        </div>

        {/* TITLE */}
        <div>
          <span className="lbl">Title</span>
          <input
            value={form.title || ""}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Plan title"
            className="field font-semibold text-[14px]"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <span className="lbl">Details</span>
          <RichTextEditor
            value={form.description || ""}
            onChange={(html) => update("description", html)}
            placeholder="What's the vibe?"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <span className="lbl">Category</span>
          <div className="flex gap-2 flex-wrap">
            {getCityCategories(form.city).map((cat) => (
              <button
                key={cat.category}
                type="button"
                onClick={() => update("category", cat.category)}
                className={`chip ${form.category === cat.category ? "on" : ""}`}
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

        {/* CITY */}
        <div>
          <span className="lbl">City</span>
          <select
            value={form.city || ""}
            onChange={(e) => update("city", e.target.value)}
            className="field"
          >
            {INDIA_HIGH_POTENTIAL_CITIES.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* LOCATION */}
        <div>
          <span className="lbl">Meetup spot</span>
          <input
            value={form.location_name || ""}
            onChange={(e) => update("location_name", e.target.value)}
            placeholder="Cubbon Park gate, Social..."
            className="field"
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
            value={form.google_maps_link || ""}
            onChange={(e) => update("google_maps_link", e.target.value)}
            placeholder="maps.app.goo.gl/..."
            className="field"
          />
        </div>

        {/* DATETIME */}
        <div>
          <span className="lbl">Date and time</span>
          <input
            type="datetime-local"
            value={
              form.datetime
                ? new Date(form.datetime).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              update("datetime", new Date(e.target.value).toISOString())
            }
            className="field"
          />
        </div>

        {/* MAX PEOPLE */}
        <div>
          <span className="lbl">Max people</span>
          <div className="flex gap-2 flex-wrap mb-2.5">
            {MAX_PEOPLE_PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => update("max_people", n)}
                className={`chip ${String(form.max_people) === String(n) ? "on" : ""}`}
              >
                {n}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            step="1"
            inputMode="numeric"
            value={form.max_people ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") update("max_people", "");
              else if (Number(v) >= 1) update("max_people", Number(v));
            }}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            className="field"
            placeholder="Custom number"
          />
        </div>

        {/* VISIBILITY */}
        <div>
          <span className="lbl">Visibility</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => update("visibility", "public")}
              className={`seg ${form.visibility === "public" ? "on" : ""}`}
            >
              <Globe className="h-3.5 w-3.5" />
              Public
            </button>
            <button
              type="button"
              onClick={() => {
                update("visibility", "invite_only");
                update("requireApproval", false);
              }}
              className={`seg ${form.visibility !== "public" ? "on" : ""}`}
            >
              <Lock className="h-3.5 w-3.5" />
              Private
            </button>
          </div>
        </div>

        {form.visibility === "public" && (
          <div>
            <span className="lbl">Joining</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => update("requireApproval", true)}
                className={`seg ${form.requireApproval ? "on" : ""}`}
              >
                <UserCheck className="h-3.5 w-3.5" />
                Approval
              </button>
              <button
                type="button"
                onClick={() => update("requireApproval", false)}
                className={`seg ${!form.requireApproval ? "on" : ""}`}
              >
                <Zap className="h-3.5 w-3.5" />
                Open to all
              </button>
            </div>
          </div>
        )}

        {/* COST */}
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
              onClick={() => update("cost_mode", "per_person")}
              className={`seg ${form.cost_mode === "per_person" ? "on" : ""}`}
            >
              Per person
            </button>
            <button
              type="button"
              onClick={() => update("cost_mode", "total")}
              className={`seg ${form.cost_mode === "total" ? "on" : ""}`}
            >
              Total
            </button>
          </div>
          <div className="flex gap-2 flex-wrap mb-2.5">
            {COST_PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => update("cost_amount", n === 0 ? "" : String(n))}
                className={`chip ${
                  (n === 0 && (form.cost_amount === "" || !form.cost_amount)) ||
                  form.cost_amount === String(n)
                    ? "on"
                    : ""
                }`}
              >
                {n === 0 ? "Free" : `₹${n}`}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={form.cost_amount || ""}
            onChange={(e) => update("cost_amount", e.target.value)}
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
              className={`toggle-track ${form.host_included_in_spots_and_splits ? "on" : ""}`}
              onClick={() =>
                update(
                  "host_included_in_spots_and_splits",
                  !form.host_included_in_spots_and_splits
                )
              }
            >
              <div className="toggle-thumb" />
            </div>
          </div>
        </div>

        {/* EXTRAS */}
        <div className="space-y-2.5">
          <span className="lbl">Optional extras</span>
          <input
            value={form.whatsapp_link || ""}
            onChange={(e) => update("whatsapp_link", e.target.value)}
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
              className={`toggle-track ${form.female_only ? "on" : ""}`}
              onClick={() => update("female_only", !form.female_only)}
            >
              <div className="toggle-thumb" />
            </div>
          </div>
        </div>

        {/* SAVE */}
        <button
          onClick={save}
          disabled={saving}
          className="save-btn"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {/* INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div
            className="w-full max-w-sm bg-white p-5 shadow-2xl ep-root"
            style={{ borderRadius: 18 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="ep-heading font-bold text-[#2A1F1A] text-[15px]">
                Settings guide
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
    </div>
  );
}