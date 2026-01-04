import { redirect } from "next/navigation";
import { listProjectsAction } from "@/features/projects/actions/project-actions";
import { PageContainer } from "@/features/shared/components/page-container";
import { EmptyState } from "@/features/shared/components/empty-state";
import { FolderPlus } from "lucide-react";
import Link from "next/link";

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
        title="No Projects Found"
        description="Create your first project to start organizing your AI contexts."
        actions={[
          {
            text: "Create Project",
            href: "#", // Would open a modal or separate page
            icon: FolderPlus,
          },
        ]}
      />
    );
  }

  // Multiple projects - show list
  return (
    <PageContainer
      title="Your Projects"
      description="Select a project to view its contexts."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/app/projects/${project.slug}/contexts`}
            className="group block p-6 bg-card border border-border rounded-xl hover:border-primary transition-all hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              /{project.slug}
            </p>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
