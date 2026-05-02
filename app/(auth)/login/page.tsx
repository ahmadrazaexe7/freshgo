import type { Metadata } from "next";

import { LoginPanel } from "@/components/auth/login-panel";

export const metadata: Metadata = {
  title: "Login | FreshGo"
};

export default function LoginPage() {
  return <LoginPanel />;
}
