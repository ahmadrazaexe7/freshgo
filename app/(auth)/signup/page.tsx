import React from "react";
import { SignupPanel } from "@/components/auth/signup-panel";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="min-h-screen bg-brand-50 py-24">
      <div className="container mx-auto px-6">
        <SignupPanel />
      </div>
    </main>
  );
}
