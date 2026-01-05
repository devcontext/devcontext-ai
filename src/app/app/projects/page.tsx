import { redirect } from "next/navigation";
import { listProjectsAction } from "@/features/projects/actions/project-actions";
import { PageContainer } from "@/features/shared/components/page-container";
import { EmptyState } from "@/features/shared/components/empty-state";
import { FolderPlus } from "lucide-react";
import { ProjectCardList } from "@/features/projects/components/project-card-list";

export default async function ProjectsPage() {
  const projectsResult = await listProjectsAction();
  const projects = projectsResult.success ? projectsResult.data || [] : [];

  // If user has one project, redirect to it
  if (projects.length === 1) {
    redirect(`/app/projects/${projects[0].slug}/contexts`);
  }

  // If no projects, show empty state
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No Scopes Defined"
        description="Define a new scope to start organizing the explicit context that the AI must respect."
        actions={[
          {
            text: "Define Scope",
            href: "#", // Flow to be implemented
            icon: FolderPlus,
          },
        ]}
      />
    );
  }

  // Multiple projects - show list
  return (
    <PageContainer
      title="Active Scopes"
      description="Select a scope to manage its requirements and constraints."
    >
      <ProjectCardList projects={projects} />
    </PageContainer>
  );
}
