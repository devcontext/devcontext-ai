import { listProjectsAction } from "@/features/projects/actions/project-actions";
import { listContexts } from "@/features/contexts/services";
import { PageContainer } from "@/features/shared/components/page-container";
import { LayoutGrid, FolderOpen, FilePlus, Settings } from "lucide-react";
import Link from "next/link";

export default async function OverviewPage() {
  const [projectsResult, contexts] = await Promise.all([
    listProjectsAction(),
    listContexts({}),
  ]);

  const projects = projectsResult.success ? projectsResult.data || [] : [];
  const totalContexts = contexts.length;
  const defaultProject = projects[0];

  return (
    <PageContainer
      title="Overview"
      description="Your AI Context Control Plane at a glance."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projects Summary */}
        <div className="p-6 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Projects</h3>
              <p className="text-sm text-muted-foreground">
                {projects.length} total
              </p>
            </div>
          </div>
          {defaultProject && (
            <Link
              href={`/app/projects/${defaultProject.slug}/contexts`}
              className="text-sm text-primary hover:underline"
            >
              Go to {defaultProject.name} →
            </Link>
          )}
        </div>

        {/* Contexts Summary */}
        <div className="p-6 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutGrid className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Contexts</h3>
              <p className="text-sm text-muted-foreground">
                {totalContexts} total across all projects
              </p>
            </div>
          </div>
          {defaultProject && (
            <Link
              href={`/app/projects/${defaultProject.slug}/contexts`}
              className="text-sm text-primary hover:underline"
            >
              View contexts →
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FilePlus className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Quick Actions
            </h3>
          </div>
          <div className="space-y-2">
            {defaultProject && (
              <Link
                href={`/app/projects/${defaultProject.slug}/composer`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                + Create new context
              </Link>
            )}
            <Link
              href="/app/settings"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-3 h-3 inline mr-1" />
              Manage API keys
            </Link>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {projects.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Your Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/app/projects/${project.slug}/contexts`}
                className="group p-4 bg-card border border-border rounded-lg hover:border-primary transition-all"
              >
                <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  /{project.slug}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
