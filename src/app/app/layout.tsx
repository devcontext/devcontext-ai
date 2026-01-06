import { DashboardShell } from "@/features/shared/components/layout/dashboard-shell";
import { Toaster } from "@/features/shared/ui/sonner";
import { AppProvider } from "@/features/shared/providers/app-provider";
import { listProjectsAction } from "@/features/projects/actions/project-actions";

/**
 * Layout for the private app section.
 * Provides shared context and UI shell for all authenticated routes.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load initial projects on server for navigation
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
