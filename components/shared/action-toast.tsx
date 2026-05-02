"use client";

import { CheckCircle2 } from "lucide-react";

import { useStore } from "@/lib/store/store-provider";

export function ActionToast() {
  const { lastAction } = useStore();

  if (!lastAction) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white shadow-soft">
        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
        {lastAction}
      </div>
    </div>
  );
}
