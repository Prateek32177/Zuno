"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Camera,
  Sparkles,
  Instagram,
  IndianRupee,
  Shield,
  Flag,
  LogOut,
  Pencil,
  Check,
  X,
  MapPin,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/lib/types";
import { generateAvatarSeed, getUserAvatarUrl } from "@/lib/avatar";
import { toast } from "@/components/ui/toast";
import Link from "next/link";
import { generateUpiLink, normalizeUpiId } from "@/lib/upi";
import { ActionDialog } from "@/components/ui/ActionDialog";

type EditableProfile = {
  name: string;
  email: string;
  avatarUrl: string;
  instagramUrl: string;
  gpayLink: string;
  upiPayeeName: string;
  avatarSeed: string;
  gender?: string;
  bio?: string;
  age?: number | string;
};

const REPORT_REASONS = [
  { value: "fake_profile", label: "Fake Profile" },
  { value: "harassment", label: "Harassment" },
  { value: "unsafe_plan", label: "Unsafe Plan" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Other" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Man" },
  { value: "female", label: "Woman" },
  { value: "nonbinary", label: "Non-binary" },
  { value: "other", label: "Other" },
];

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "";
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [blockBusy, setBlockBusy] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("fake_profile");
  const [reportDetails, setReportDetails] = useState("");
  const [reportBusy, setReportBusy] = useState(false);
  const [showAvatarActions, setShowAvatarActions] = useState(false);
  const [hostedCount, setHostedCount] = useState(0);
  const [editingBio, setEditingBio] = useState(false);
  const [bioCharCount, setBioCharCount] = useState(0);

  const [edit, setEdit] = useState<EditableProfile>({
    name: "",
    avatarUrl: "",
    instagramUrl: "",
    gpayLink: "",
    upiPayeeName: "",
    email: "",
    avatarSeed: "",
    bio: "",
    age: "",
  });

  const isOwnProfile =
    !!authUserId && (id === "me" || !id || id === authUserId);

  const applyProfileToForm = (profile: User) => {
    const bio = (profile as any).bio || "";
    setBioCharCount(bio.length);
    setEdit({
      name: profile.name || "",
      avatarUrl: profile.avatar_url || "",
      instagramUrl: profile.instagram_url || "",
      gpayLink: profile.gpay_link || "",
      upiPayeeName: profile.upi_payee_name || "",
      email: (profile as any).email || "",
      avatarSeed: profile.avatar_seed || "",
      gender: profile.gender || "",
      bio,
      age: profile.age || "",
    });
  };

  const loadProfile = async () => {
    setLoading(true);
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      router.push("/login");
      return;
    }

    setAuthUserId(authUser.id);
    const viewingSelf = id === "me" || !id || id === authUser.id;
    const targetId = viewingSelf ? authUser.id : id;
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", targetId)
      .single();
    if (data && viewingSelf) (data as any).email = authUser.email || "";

    if (!data) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { count: hostedPlansCount } = await supabase
      .from("plans")
      .select("id", { count: "exact", head: true })
      .eq("host_id", targetId);
    setHostedCount(hostedPlansCount || 0);

    let profile = data as User;
    if (!profile.avatar_seed) {
      const nextSeed = generateAvatarSeed();
      profile = { ...profile, avatar_seed: nextSeed };
      if (viewingSelf)
        await supabase
          .from("users")
          .update({ avatar_seed: nextSeed })
          .eq("id", targetId);
    }

    setUser(profile);
    applyProfileToForm(profile);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, [id, isOwnProfile]);

  useEffect(() => {
    if (!isOwnProfile || !authUserId) return;
    if (!edit.avatarUrl || edit.avatarUrl === user?.avatar_url) return;
    const saveAvatar = async () => {
      const { error } = await supabase
        .from("users")
        .update({ avatar_url: edit.avatarUrl })
        .eq("id", authUserId);
      if (!error)
        setUser((prev) =>
          prev ? { ...prev, avatar_url: edit.avatarUrl } : null,
        );
    };
    saveAvatar();
  }, [edit.avatarUrl]);

  const displayedAvatar = useMemo(
    () =>
      getUserAvatarUrl({
        avatarUrl: edit.avatarUrl,
        avatarSeed: edit.avatarSeed,
        fallbackSeed: user?.id || user?.name,
      }),
    [edit.avatarSeed, edit.avatarUrl, user?.id, user?.name],
  );

  const handleAvatarRegenerate = () => {
    const nextSeed = generateAvatarSeed();
    setEdit((prev) => ({ ...prev, avatarSeed: nextSeed }));
    toast.success("Avatar refreshed");
  };

  const handleSave = async () => {
    if (!edit.name.trim()) return toast.error("Name is required");
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const updates: any = {
      name: edit.name.trim(),
      avatar_url: edit.avatarUrl.trim() || null,
      avatar_seed: edit.avatarSeed.trim() || generateAvatarSeed(),
      instagram_url: edit.instagramUrl.trim() || null,
      gpay_link: edit.gpayLink.trim() || null,
      upi_payee_name: edit.upiPayeeName.trim() || null,
      gender: edit.gender || null,
      bio: edit.bio?.trim() || null,
      age: edit.age ? Number(edit.age) : null,
    };

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", auth.user.id);
    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }
    toast.success("Profile saved");
    setUser({ ...user, ...updates } as User);
    setSaving(false);
    setEditingBio(false);
  };

  const handleUploadAvatar = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 5242880)
        return toast.error("File must be smaller than 5MB");
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
        return toast.error("Only JPEG, PNG, and WebP images are allowed");
      const ext = file.name.split(".").pop() || "png";
      const filePath = `${authUserId}/avatar.${ext}`;
      const { error } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, { upsert: true });
      if (error) return toast.error(error.message || "Upload failed");
      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);
      setEdit((prev) => ({ ...prev, avatarUrl: data.publicUrl }));
      setShowAvatarActions(false);
      toast.success("Photo updated");
    };
    input.click();
  };

  const handleConfirmBlock = async () => {
    if (!user || !authUserId || isOwnProfile) return;
    setBlockBusy(true);
    const res = await fetch("/api/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockedId: user.id }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) toast.error(data.error || "Unable to block user");
    else {
      toast.success("User blocked");
      setShowBlockDialog(false);
    }
    setBlockBusy(false);
  };

  const submitReport = async () => {
    if (!user || isOwnProfile) return;
    setReportBusy(true);
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetType: "profile",
        targetUserId: user.id,
        reason: reportReason,
        details: reportDetails.trim(),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) toast.error(data.error || "Unable to submit report");
    else {
      toast.success(data.message || "Thanks, we will review this.");
      setShowReportDialog(false);
      setReportDetails("");
    }
    setReportBusy(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : null;

  if (loading) return <div className="min-h-screen bg-[#FAF6F1]" />;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF6F1] flex items-center justify-center">
        <p
          className="text-sm text-[#9A8880]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Profile not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F1] pb-28">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        .pf-root { font-family: 'DM Sans', sans-serif; }
        .pf-serif { font-family: 'Playfair Display', serif; }

        /* Cover gradient */
        .cover-gradient {
          background: linear-gradient(135deg, #D4A88A 0%, #C4856A 35%, #8B5A4A 100%);
        }

        /* Avatar ring */
        .avatar-ring {
          box-shadow: 0 0 0 3px #FAF6F1, 0 0 0 5px #C4856A;
        }

        /* Stat card */
        .stat-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(196,133,106,0.15);
          border-radius: 14px;
        }

        /* Input field */
        .pf-input {
          width: 100%;
          background: #F3EDE6;
          border: 1.5px solid transparent;
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #2A1F1A;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .pf-input:focus { border-color: #C4856A; background: #EEE6DE; }
        .pf-input::placeholder { color: #C4B5A5; }
        .pf-input[readonly] { color: #A89888; cursor: default; }

        /* Textarea */
        .pf-textarea {
          width: 100%;
          background: #F3EDE6;
          border: 1.5px solid #C4856A;
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #2A1F1A;
          outline: none;
          resize: none;
          line-height: 1.5;
        }
        .pf-textarea::placeholder { color: #C4B5A5; }

        /* Gender pill */
        .gender-pill {
          padding: 7px 14px; border-radius: 999px;
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: all 0.12s;
          background: #EDE7DF; color: #5C4A38;
          border: 1.5px solid transparent;
        }
        .gender-pill.on { background: #2A1F1A; color: #F7EEE5; }
        .gender-pill:hover:not(.on) { border-color: #C4856A; }

        /* Section card */
        .section-card {
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
          overflow: hidden;
        }

        /* Lbl */
        .lbl {
          display: block; font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #A8917E; margin-bottom: 7px;
        }

        /* Save button */
        .save-btn {
          width: 100%; border-radius: 14px;
          background: #2A1F1A; color: #F7EEE5;
          padding: 14px 0; font-size: 13.5px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          border: none; cursor: pointer;
          transition: opacity 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .save-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .save-btn:hover:not(:disabled) { opacity: 0.88; }

        /* Badge */
        .badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 600;
        }

        /* Verified badge */
        .verified-badge {
          background: #D4F5E2; color: #1A7A4A;
        }

        /* Action row */
        .action-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px; cursor: pointer;
          transition: background 0.1s;
        }
        .action-row:hover { background: #FAF6F1; }
        .action-row + .action-row { border-top: 1px solid #F0EAE3; }

        /* Scrollbar hide */
        .noscroll::-webkit-scrollbar { display: none; }
        .noscroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* Fade in */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .fade-up-2 { animation: fadeUp 0.35s 0.08s ease both; }
        .fade-up-3 { animation: fadeUp 0.35s 0.16s ease both; }
        .fade-up-4 { animation: fadeUp 0.35s 0.24s ease both; }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-30 bg-[#FAF6F1]/90 backdrop-blur-sm border-b border-black/5 px-4 py-3 flex items-center justify-between pf-root">
        <button
          onClick={() => router.back()}
          className="h-8 w-8 rounded-full bg-[#EDE7DF] flex items-center justify-center"
        >
          <ChevronLeft className="h-4 w-4 text-[#5C4A38]" />
        </button>
        <p className="pf-serif font-semibold text-[14px] text-[#2A1F1A]">
          {isOwnProfile ? "My Profile" : user.name}
        </p>
        {isOwnProfile ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-8 px-3 rounded-full bg-[#2A1F1A] text-[#F7EEE5] text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Check className="h-3 w-3" />
                Save
              </>
            )}
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      <div className="max-w-md mx-auto pf-root">
        {/* ── HERO SECTION ── */}
{/* ── HERO SECTION ── */}
<div className="relative fade-up">
  {/* Cover */}
  <div className="relative h-40 w-full overflow-hidden rounded-xl">
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center scale-105"
      style={{
        backgroundImage:
          "url(https://i.pinimg.com/1200x/5e/1c/4d/5e1c4d3cd83e7f0f439b41089c1cbe5c.jpg)",
      }}
    />

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />


  </div>

  {/* Avatar (now OUTSIDE banner) */}
  <div
    className="absolute left-1/2 -translate-x-1/2"
    style={{ bottom: -52 }}
  >
    <div className="relative">
      <img
        src={displayedAvatar}
        className="h-28 w-28 rounded-full object-cover avatar-ring"
        alt={user.name}
      />
      {isOwnProfile && (
        <button
          onClick={() => setShowAvatarActions((p) => !p)}
          className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-[#2A1F1A] text-white flex items-center justify-center shadow-lg"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  </div>
</div>
        {/* Spacer for avatar overlap */}
        <div className="h-16" />

        {/* Avatar action pills */}
        {isOwnProfile && showAvatarActions && (
          <div className="flex justify-center gap-2 mb-4 px-4 fade-up">
            <button
              onClick={handleUploadAvatar}
              className="text-xs px-4 py-2 bg-[#2A1F1A] text-white rounded-full font-medium"
            >
              Upload photo
            </button>
            {edit.avatarUrl && (
              <button
                onClick={() => {
                  setEdit((p) => ({ ...p, avatarUrl: "" }));
                  setShowAvatarActions(false);
                }}
                className="text-xs px-4 py-2 border border-[#DDD5CB] rounded-full font-medium text-[#5C4A38]"
              >
                Remove
              </button>
            )}
            <button
              onClick={() => {
                handleAvatarRegenerate();
                setShowAvatarActions(false);
              }}
              className="text-xs px-4 py-2 border border-[#DDD5CB] rounded-full font-medium text-[#5C4A38]"
            >
              Generate
            </button>
          </div>
        )}

        {/* ── IDENTITY ── */}
        <div className="text-center px-6 mb-5 fade-up-2">
          {isOwnProfile ? (
            <input
              value={edit.name}
              onChange={(e) => setEdit({ ...edit, name: e.target.value })}
              className="text-center pf-serif text-[22px] font-semibold text-[#2A1F1A] bg-transparent border-b-2 border-dashed border-[#DDD5CB] focus:border-[#C4856A] outline-none w-full max-w-[220px] mx-auto pb-0.5"
              placeholder="Your name"
            />
          ) : (
            <h1 className="pf-serif text-[22px] font-semibold text-[#2A1F1A]">
              {user.name}
            </h1>
          )}

          {/* Age + gender + verified row */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-2">
            {user.age && (
              <span className="text-[13px] text-[#7A6455] font-medium">
                {user.age}
              </span>
            )}
            {user.gender && (
              <span
                className="badge"
                style={{ background: "#F3EDE6", color: "#7A6455" }}
              >
                {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
              </span>
            )}
            {user.phone_verified && (
              <span className="badge verified-badge">
                <Shield className="h-2.5 w-2.5" />
                Verified
              </span>
            )}
          </div>

          {memberSince && (
            <p className="text-[11px] text-[#B0A090] mt-1.5 flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3 opacity-50" />
              Member since {memberSince}
            </p>
          )}

          {/* Bio display / edit */}
          <div className="mt-3">
            {isOwnProfile ? (
              editingBio ? (
                <div className="relative">
                  <textarea
                    value={edit.bio}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 300);
                      setEdit({ ...edit, bio: val });
                      setBioCharCount(val.length);
                    }}
                    rows={3}
                    placeholder="Tell people who you are — your vibe, what you love doing, what makes a great plan..."
                    className="pf-textarea text-center text-[13px]"
                    autoFocus
                  />
                  <div className="flex items-center justify-between mt-1.5 px-0.5">
                    <span className="text-[11px] text-[#B0A090]">
                      {bioCharCount}/300
                    </span>
                    <button
                      onClick={() => setEditingBio(false)}
                      className="text-[11px] text-[#C4856A] font-semibold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditingBio(true)}
                  className="group flex items-start justify-center gap-1.5 text-center w-full"
                >
                  {edit.bio ? (
                    <p className="text-[13.5px] text-[#5C4A38] leading-relaxed italic">
                      {edit.bio}
                    </p>
                  ) : (
                    <p className="text-[13px] text-[#C4B5A5]">Add a bio...</p>
                  )}
                  <Pencil className="h-3 w-3 text-[#C4B5A5] mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )
            ) : (
              (user as any).bio && (
                <p className="text-[13.5px] text-[#5C4A38] leading-relaxed italic">
                  {(user as any).bio}
                </p>
              )
            )}
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-3 gap-3 px-4 mb-5 fade-up-3">
          {[
            {
              label: "Reliability",
              value: `${Math.round(user.reliability_score || 100)}%`,
              sub: "score",
            },
            {
              label: "Plans",
              value: (user.total_joined || 0) + hostedCount,
              sub: "joined",
            },
            {
              label: "Completed",
              value: user.total_attended || 0,
              sub: "attended",
            },
          ].map((item) => (
            <div key={item.label} className="stat-card p-3.5 text-center">
              <p className="pf-serif text-[20px] font-bold text-[#2A1F1A]">
                {item.value}
              </p>
              <p className="text-[10px] font-semibold text-[#A8917E] uppercase tracking-wide mt-0.5">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── SOCIAL LINKS (viewer) ── */}
        {!isOwnProfile && (user.instagram_url || user.gpay_link) && (
          <div className="flex gap-2 px-4 mb-5 fade-up-3">
            {user.instagram_url && (
              <a
                href={user.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-14px text-sm font-semibold text-white"
                style={{
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366)",
                }}
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            )}
            {user.gpay_link && (
              <a
                href={
                  generateUpiLink({ upiId: normalizeUpiId(user.gpay_link) }) ||
                  "#"
                }
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white"
                style={{ borderRadius: 14, background: "#1A8C4E" }}
              >
                <IndianRupee className="h-4 w-4" />
                Pay via UPI
              </a>
            )}
          </div>
        )}

        {/* ── EDIT FORM (own profile) ── */}
        {isOwnProfile && (
          <div className="px-4 space-y-4 fade-up-4">
            {/* About section */}
            <div className="section-card">
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-[#C4856A]" />
                  <p className="font-semibold text-[#2A1F1A] text-[13.5px]">
                    About you
                  </p>
                </div>

                <div>
                  <span className="lbl">Display name</span>
                  <input
                    value={edit.name}
                    onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                    placeholder="Your name"
                    className="pf-input"
                  />
                </div>

                <div>
                  <span className="lbl">Age</span>
                  <input
                    type="number"
                    value={edit.age || ""}
                    onChange={(e) => setEdit({ ...edit, age: e.target.value })}
                    placeholder="Your age"
                    min={18}
                    max={99}
                    className="pf-input"
                  />
                </div>

                <div>
                  <span className="lbl">Gender</span>
                  <div className="flex gap-2 flex-wrap">
                    {GENDER_OPTIONS.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() =>
                          setEdit({
                            ...edit,
                            gender: edit.gender === g.value ? "" : g.value,
                          })
                        }
                        className={`gender-pill ${edit.gender === g.value ? "on" : ""}`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & social */}
            <div className="section-card">
              <div className="p-5 space-y-4">
                <p className="font-semibold text-[#2A1F1A] text-[13.5px] mb-1">
                  Contact & social
                </p>

                <div>
                  <span className="lbl">Email</span>
                  <input
                    value={edit.email}
                    placeholder="Email address"
                    readOnly
                    className="pf-input"
                  />
                </div>

                <div>
                  <span className="lbl">Instagram</span>
                  <input
                    value={edit.instagramUrl}
                    placeholder="instagram.com/yourhandle"
                    onChange={(e) =>
                      setEdit({ ...edit, instagramUrl: e.target.value })
                    }
                    className="pf-input"
                  />
                </div>
              </div>
            </div>

            {/* Payments */}
            <div className="section-card">
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-[#2A1F1A] text-[13.5px]">
                      Payments
                    </p>
                    <p className="text-[11px] text-[#A8917E] mt-0.5">
                      Used when participants split costs after a plan
                    </p>
                  </div>
                  <IndianRupee className="h-4 w-4 text-[#A8917E] mt-0.5 flex-shrink-0" />
                </div>

                <div>
                  <span className="lbl">UPI ID</span>
                  <input
                    value={edit.gpayLink}
                    placeholder="yourname@upi"
                    onChange={(e) =>
                      setEdit({ ...edit, gpayLink: e.target.value })
                    }
                    className="pf-input"
                  />
                </div>

                <div>
                  <span className="lbl">Payee name</span>
                  <input
                    placeholder="Name should be same as present in UPI App"
                    value={edit.upiPayeeName}
                    onChange={(e) =>
                      setEdit({ ...edit, upiPayeeName: e.target.value })
                    }
                    className="pf-input"
                  />
                </div>
              </div>
            </div>

            {/* Save button */}
            <button onClick={handleSave} disabled={saving} className="save-btn">
              <Check className="h-4 w-4" />
              {saving ? "Saving..." : "Save profile"}
            </button>

            {/* Account actions */}
            <div className="section-card mb-2">
              <button onClick={handleSignOut} className="action-row w-full">
                <div className="flex items-center gap-3">
                  <LogOut className="h-4 w-4 text-[#C4856A]" />
                  <span className="text-[13.5px] font-medium text-[#5C4A38]">
                    {signingOut ? "Signing out..." : "Sign out"}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── BLOCK / REPORT (other profile) ── */}
        {!isOwnProfile && (
          <div className="px-4 fade-up-4">
            <div className="section-card">
              <button
                onClick={() => setShowBlockDialog(true)}
                className="action-row w-full"
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-[#A8917E]" />
                  <span className="text-[13.5px] font-medium text-[#5C4A38]">
                    Block user
                  </span>
                </div>
              </button>
              <button
                onClick={() => setShowReportDialog(true)}
                className="action-row w-full"
              >
                <div className="flex items-center gap-3">
                  <Flag className="h-4 w-4 text-[#A8917E]" />
                  <span className="text-[13.5px] font-medium text-[#5C4A38]">
                    Report user
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="px-6 py-5 text-center text-[11px] text-[#B0A090]">
          Impersonating others is prohibited.{" "}
          <Link className="underline text-[#9A8478]" href="/terms">
            Terms
          </Link>
        </p>
      </div>

      <BottomNav />

      <ActionDialog
        open={showBlockDialog}
        onClose={() => setShowBlockDialog(false)}
        onConfirm={handleConfirmBlock}
        busy={blockBusy}
        confirmTone="danger"
        title="Block this user?"
        description="You will no longer see each other's plans or interactions."
        confirmLabel="Block"
      />

      <ActionDialog
        open={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        onConfirm={submitReport}
        busy={reportBusy}
        title="Report profile"
        description="Tell us what happened."
        confirmLabel="Submit report"
      >
        <div className="space-y-2">
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full rounded-xl border border-[#D7C6B5] bg-white px-3 py-2.5 text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {REPORT_REASONS.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
          <textarea
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
            rows={3}
            placeholder="Details (optional)"
            className="w-full rounded-xl border border-[#D7C6B5] bg-white px-3 py-2.5 text-sm resize-none"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
      </ActionDialog>
    </div>
  );
}
