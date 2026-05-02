"use client";

import { Flame, Sparkles } from "lucide-react";

import { useStreak } from "@/components/layout/use-streak";

type RewardDay = {
  day: number;
  discountPercent: number;
};

const rewardDays: RewardDay[] = [
  { day: 3, discountPercent: 3 },
  { day: 4, discountPercent: 4 },
  { day: 5, discountPercent: 5 },
  { day: 6, discountPercent: 6 },
  { day: 7, discountPercent: 7 },
  { day: 8, discountPercent: 8 },
  { day: 9, discountPercent: 9 },
  { day: 10, discountPercent: 10 }
];

export function MyStreakOffer() {
  const { currentStreak } = useStreak();

  return (
    <section className="relative w-full overflow-hidden bg-brand-900 py-24">
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_40%,rgba(40,180,70,0.45),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-200 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-brand-200" />
              Streak rewards
            </span>

            <h2 className="mt-6 font-display text-5xl font-black leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              <span className="block">🔥 {currentStreak} day{currentStreak === 1 ? "" : "s"}</span>
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-white/80">
              Streaks update automatically when you place orders—no manual clicks required.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <p className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white">
                Rewards start at Day 3
              </p>
              <p className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white/80">
                Free delivery after Day 10
              </p>
            </div>
          </div>

          <div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-200">Rewards</p>

              <div className="mt-4 space-y-2">
                {rewardDays.map(({ day, discountPercent }) => {
                  const active = currentStreak >= day;

                  return (
                    <div
                      key={day}
                      className={[
                        "flex items-center justify-between rounded-[1.2rem] px-4 py-3 text-sm",
                        active ? "bg-amber-400 text-ink" : "bg-white/10 text-white/80"
                      ].join(" ")}
                    >
                      <span className="font-semibold">Day {day}</span>
                      <span className="font-bold">{discountPercent}% off</span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-sm leading-6 text-white/75">
                Free delivery on orders above Rs 1,000 after day 10 of your streak.
              </p>

              <p className="mt-3 text-xs text-white/60">
                Place an order to move your streak forward.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MyStreakOffer;
