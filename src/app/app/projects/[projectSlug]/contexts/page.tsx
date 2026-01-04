import { listContexts } from "@/features/contexts/services";
import { ContextCard } from "@/features/contexts/components/viewer/context-card";
import { FilterContainer } from "@/features/contexts/components/viewer/filter-container";
import { PageContainer } from "@/features/shared/components/page-container";
import { EmptyState } from "@/features/shared/components/empty-state";
import { FilePlus } from "lucide-react";
import { getProjectBySlug } from "@/features/projects/services/get-project-by-slug";
import { listProjectsAction } from "@/features/projects/actions/project-actions";

interface ContextsPageProps {
  params: Promise<{ projectSlug: string }>;
  searchParams: Promise<{
    search?: string;
    tags?: string;
  }>;
}

export default async function ContextsPage({
  params,
  searchParams,
}: ContextsPageProps) {
  const { projectSlug } = await params;
  const searchParamsData = await searchParams;

  // Fetch project and contexts
  const [project, projectsResult, contexts] = await Promise.all([
    getProjectBySlug(projectSlug),
    listProjectsAction(),
    listContexts({
      projectSlug,
      search: searchParamsData.search,
      tags: searchParamsData.tags
        ? searchParamsData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
    }),
  ]);

  const projects = projectsResult.success ? projectsResult.data || [] : [];

  if (
    contexts.length === 0 &&
    !searchParamsData.search &&
    !searchParamsData.tags
  ) {
    return (
      <EmptyState
        title="No Contexts Found"
        description="Create your first context to start building structured technical documentation."
        actions={[
          {
            text: "Create Context",
            href: `/app/projects/${projectSlug}/composer`,
            icon: FilePlus,
          },
        ]}
      />
    );
  }

  return (
    <PageContainer
      title={`${project.name} - Contexts`}
      description="Browse and manage your AI context repository."
      rightContent={
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded border border-border">
          {contexts.length} Contexts
        </span>
      }
    >
      <div className="space-y-8">
        {/* Filters */}
        <FilterContainer projects={projects} initialValues={searchParamsData} />

        {/* Results */}
        {contexts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contexts.map((context) => (
              <ContextCard
                key={context.id}
                context={context}
                projectSlug={projectSlug}
                projectName={project.name}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">
              No contexts match your filters.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
