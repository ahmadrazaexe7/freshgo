"use client";

import { useEffect, useState } from "react";

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

export function useStreak() {
  const [streak, setStreak] = useState<StreakState>({ currentStreak: 0, lastOrderDate: null });

  useEffect(() => {
    setStreak(loadStreak());

    function onStorage(e: StorageEvent) {
      if (e.key === storageKey) {
        setStreak(loadStreak());
      }
    }

    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return streak;
}

export default useStreak;
