import { AccountShell } from "@/components/account/account-shell";

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AccountShell>{children}</AccountShell>;
}
