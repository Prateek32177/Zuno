"use client";

import Link from "next/link";
import { Flame, Plus, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SignInDialog } from "@/components/auth/SignInDialog";

export function BottomNav({
  pendingRequestsCount,
}: {
  pendingRequestsCount?: number;
}) {
  const pathname = usePathname();
  const is = (p: string) => pathname.startsWith(p);

  const [autoPendingCount, setAutoPendingCount] = useState(0);
  const [isAuthed, setIsAuthed] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [plusPressed, setPlusPressed] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setIsAuthed(!!data.user))
      .catch(() => setIsAuthed(false));
  }, []);

  useEffect(() => {
    if (typeof pendingRequestsCount === "number") return;
    let cancelled = false;

    const loadPendingCount = async () => {
      const { data: auth } = await createClient().auth.getUser();
      if (!auth.user) return;
      const res = await fetch("/api/plans?includeMine=1", { cache: "no-store" });
      const data = await res.json().catch(() => []);
      if (!Array.isArray(data) || cancelled) return;
      const hostedPending = data
        .filter((plan: any) => plan.host_id === auth.user?.id)
        .reduce(
          (sum: number, plan: any) =>
            sum + (plan.participants || []).filter((p: any) => p.status === "pending").length,
          0,
        );
      setAutoPendingCount(hostedPending);
    };

    loadPendingCount();
    return () => { cancelled = true; };
  }, [pendingRequestsCount]);

  const resolvedPendingCount = useMemo(
    () => typeof pendingRequestsCount === "number" ? pendingRequestsCount : autoPendingCount,
    [autoPendingCount, pendingRequestsCount],
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');

        .bn-root {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          padding-bottom: max(env(safe-area-inset-bottom), 10px);
          padding-top: 6px;
          /* frosted backdrop for the whole bar area */
          background: linear-gradient(to top, rgba(253,250,247,1) 55%, rgba(253,250,247,0));
          pointer-events: none;
        }

        .bn-pill {
          pointer-events: all;
          display: flex;
          align-items: center;
          gap: 38px;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(237, 232, 225, 0.9);
          border-radius: 100px;
          padding: 6px 6px;
          box-shadow:
            0 4px 24px rgba(28, 20, 16, 0.10),
            0 1px 4px rgba(28, 20, 16, 0.06),
            inset 0 1px 0 rgba(255,255,255,0.8);
        }

        /* ── NAV ITEM ── */
        .bn-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 7px 20px;
          border-radius: 100px;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          transition: background 0.18s ease;
          -webkit-tap-highlight-color: transparent;
       
        }
        .bn-item:active { transform: scale(0.94); }
        .bn-item.active {
          background: #1C1410;
        }

        .bn-icon {
          width: 20px;
          height: 20px;
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.15s;
          flex-shrink: 0;
        }
        .bn-item.active .bn-icon {
          color: #FDFAF7;
          transform: scale(1.05);
        }
        .bn-item:not(.active) .bn-icon {
          color: #B8AFA6;
        }

        .bn-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.01em;
          line-height: 1;
          transition: color 0.15s;
        }
        .bn-item.active .bn-label { color: #FDFAF7; }
        .bn-item:not(.active) .bn-label { color: #C4BAB2; }

        /* ── BADGE ── */
        .bn-badge {
          position: absolute;
          top: 4px;
          right: 12px;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          border-radius: 100px;
          background: #FF6B35;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 9px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 2px #fff;
          animation: badgePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes badgePop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        /* ── PLUS BUTTON ── */
        .bn-plus {
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #FF7A45 0%, #E8441A 55%, #C83010 100%);
          box-shadow:
            0 4px 14px rgba(255, 107, 53, 0.50),
            0 1px 3px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,200,160,0.4);
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
          margin: 0 2px;
        }
        .bn-plus:hover {
          transform: scale(1.07);
          box-shadow: 0 6px 20px rgba(255,107,53,0.55), 0 1px 3px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,200,160,0.4);
        }
        .bn-plus:active,
        .bn-plus.pressed {
          transform: scale(0.92);
          box-shadow: 0 2px 8px rgba(255,107,53,0.4), inset 0 1px 0 rgba(255,200,160,0.3);
        }
        .bn-plus svg {
          color: #fff;
          width: 22px;
          height: 22px;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .bn-plus:hover svg { transform: rotate(90deg) scale(1.1); }
        .bn-plus:active svg, .bn-plus.pressed svg { transform: rotate(45deg) scale(0.9); }

        /* Glow ring on plus */
        .bn-plus::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: transparent;
          border: 2px solid rgba(255,107,53,0);
          transition: border-color 0.2s, inset 0.2s;
        }
        .bn-plus:hover::after {
          border-color: rgba(255,107,53,0.25);
          inset: -5px;
        }
      `}</style>

      <nav className="bn-root" aria-label="Main navigation">
        <div className="bn-pill">
          {/* Discover */}
          <Link
            href="/feed"
            className={`bn-item ${is("/feed") ? "active" : ""}`}
            aria-label="Discover"
          >
            <Flame className="bn-icon" strokeWidth={is("/feed") ? 2.2 : 1.8} />
            <span className="bn-label">Discover</span>
          </Link>

          {/* Create */}
          <button
            className={`bn-plus ${plusPressed ? "pressed" : ""}`}
            aria-label="Create plan"
            onPointerDown={() => setPlusPressed(true)}
            onPointerUp={() => setPlusPressed(false)}
            onPointerLeave={() => setPlusPressed(false)}
            onClick={() => {
              if (!isAuthed) {
                setShowAuthDialog(true);
                return;
              }
              window.location.href = "/plans/create";
            }}
          >
            <Plus strokeWidth={2.8} />
          </button>

          {/* My Plans */}
          <Link
            href="/my-plans"
            className={`bn-item ${is("/my-plans") ? "active" : ""}`}
            aria-label="My Plans"
          >
            <Heart
              className="bn-icon"
              strokeWidth={is("/my-plans") ? 2.2 : 1.8}
              style={{ fill: is("/my-plans") ? "rgba(253,250,247,0.9)" : "none" }}
            />
            <span className="bn-label">My Plans</span>
            {!!resolvedPendingCount && (
              <span className="bn-badge">{resolvedPendingCount}</span>
            )}
          </Link>
        </div>
      </nav>

      <SignInDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        nextPath={pathname || "/feed"}
      />
    </>
  );
}