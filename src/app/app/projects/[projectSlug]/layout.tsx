import { redirect } from "next/navigation";
import { getProjectBySlug } from "@/features/projects/services/get-project-by-slug";
import { ProjectProvider } from "@/features/projects/providers/project-provider";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectSlug: string }>;
}

/**
 * Project-scoped layout - wraps children with ProjectProvider.
 * AppProvider and DashboardShell are provided by (app)/layout.tsx
 */
export default async function ProjectScopedLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { projectSlug } = await params;

  // Load current project by slug
  const currentProject = await getProjectBySlug(projectSlug).catch(() => null);

  // If project not found, redirect to projects list
  if (!currentProject) {
    redirect("/app/projects");
  }

  return <ProjectProvider project={currentProject}>{children}</ProjectProvider>;
}
