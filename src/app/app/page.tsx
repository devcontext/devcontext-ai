import { listProjectsAction } from "@/features/projects/actions/project-actions";
import { listContexts } from "@/features/contexts/services";
import { PageContainer } from "@/features/shared/components/page-container";
import { LayoutGrid, FolderOpen, FilePlus, Settings } from "lucide-react";
import Link from "next/link";
import { appRoutes } from "@/features/routes";

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
      description="Manage the scopes and contexts that guide your AI."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projects Summary */}
        <div className="p-6 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground text-sm uppercase tracking-wider opacity-60">
                Scopes
              </h3>
              <p className="text-xl font-bold">{projects.length}</p>
            </div>
          </div>
          {defaultProject && (
            <Link
              href={appRoutes.contexts.list.generatePath({
                projectSlug: defaultProject.slug,
              })}
              className="text-xs text-primary hover:underline font-medium"
            >
              Enter {defaultProject.name} →
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
              <h3 className="font-semibold text-card-foreground text-sm uppercase tracking-wider opacity-60">
                Contexts
              </h3>
              <p className="text-xl font-bold">{totalContexts}</p>
            </div>
          </div>
          {defaultProject && (
            <Link
              href={appRoutes.contexts.list.generatePath({
                projectSlug: defaultProject.slug,
              })}
              className="text-xs text-primary hover:underline font-medium"
            >
              Manage contexts →
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FilePlus className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground text-sm uppercase tracking-wider opacity-60">
              Actions
            </h3>
          </div>
          <div className="space-y-3">
            {defaultProject && (
              <Link
                href={appRoutes.contexts.composer.generatePath({
                  projectSlug: defaultProject.slug,
                })}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                + Create context
              </Link>
            )}
            <Link
              href={appRoutes.settings.root.path}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <Settings className="w-3.5 h-3.5 inline mr-2 opacity-60 text-foreground" />
              API Settings
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
                href={appRoutes.contexts.list.generatePath({
                  projectSlug: project.slug,
                })}
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
