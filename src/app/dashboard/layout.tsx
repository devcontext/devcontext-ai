import { DashboardShell } from "@/features/shared/components/layout/dashboard-shell";
import { Toaster } from "@/features/shared/ui/sonner";
import { AppProvider } from "@/features/shared/providers/app-provider";
import { listProjectsAction } from "@/features/projects/actions/project-actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load initial projects on server
  const projectsResult = await listProjectsAction();
  const initialProjects = projectsResult.success ? projectsResult.data! : [];

  return (
    <>
      <Toaster />
      <AppProvider initialProjects={initialProjects}>
        <DashboardShell>{children}</DashboardShell>
      </AppProvider>
    </>
  );
}
