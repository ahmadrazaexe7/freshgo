"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Shop page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0B1F12] px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[#0B2418]/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-semibold">Oops, something went wrong.</h1>
        <p className="mt-4 text-sm text-white/70">
          We couldn&apos;t load the shop right now. Please check your connection or try again in a moment.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-[#081D18]"
          >
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
