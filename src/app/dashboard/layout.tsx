import { DashboardShell } from "@/features/shared/components/layout/dashboard-shell";
import { Toaster } from "@/features/shared/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: add toast provider
  return (
    <>
      <Toaster />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
