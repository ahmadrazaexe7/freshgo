import { AccountShell } from "@/components/account/account-shell";

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AccountShell>{children}</AccountShell>;
}
