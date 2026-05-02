"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

type StreakState = {
  currentStreak: number;
  lastOrderDate: string | null;
};

const storageKey = "freshgo-streak-v1";

function loadStreak(): StreakState {
  if (typeof window === "undefined") return { currentStreak: 0, lastOrderDate: null };

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) return { currentStreak: 0, lastOrderDate: null };

    const parsed = JSON.parse(raw) as StreakState;
    return {
      currentStreak: typeof parsed.currentStreak === "number" ? parsed.currentStreak : 0,
      lastOrderDate: typeof parsed.lastOrderDate === "string" ? parsed.lastOrderDate : null
    };
  } catch {
    return { currentStreak: 0, lastOrderDate: null };
  }
}

function saveStreak(state: StreakState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function StreakModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [streak, setStreak] = useState<StreakState>({ currentStreak: 0, lastOrderDate: null });

  useEffect(() => {
    setStreak(loadStreak());
  }, [open]);

  const percent = useMemo(() => Math.min((streak.currentStreak / 10) * 100, 100), [streak.currentStreak]);

  // compact non-blocking popover positioned near top-right
  return (
    <div
      className={`fixed z-50 top-16 right-6 transition-all ${open ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"}`}
      aria-hidden={!open}
    >
      <div className="w-[min(420px,92vw)] rounded-[1rem] bg-white p-4 shadow-soft">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">Streak rewards</p>
            <h3 className="mt-1 text-lg font-semibold text-ink">🔥 {streak.currentStreak} day{streak.currentStreak === 1 ? "" : "s"}</h3>
            <p className="mt-1 text-sm text-ink/66">Streaks update automatically when you place orders—no manual clicks required.</p>
          </div>

          <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3">
          <div className="w-full rounded-full bg-cream p-1">
            <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${percent}%` }} />
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2 text-sm">
            {Array.from({ length: 10 }).map((_, idx) => {
              const day = idx + 1;
              const filled = streak.currentStreak >= day;

              return (
                <div key={day} className={`flex items-center justify-center rounded-md border p-2 ${filled ? "bg-amber-400 text-ink" : "bg-white text-ink/64"}`}>
                  {day}
                </div>
              );
            })}
          </div>

          <div className="mt-3 rounded-[0.9rem] border border-brand-100 bg-white p-3 text-sm">
            <p className="font-semibold">Rewards</p>
            <ul className="mt-2 space-y-1 text-sm text-ink/70">
              {Array.from({ length: 8 }).map((_, i) => {
                const day = i + 3;
                return (
                  <li key={day} className="flex items-center justify-between">
                    <span>Day {day}</span>
                    <span className="font-semibold">{day}% off</span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-3 text-sm text-ink/66">Free delivery on orders above Rs 1,000 after day 10 of your streak.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakModal;
