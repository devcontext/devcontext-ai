import { listContexts } from "@/features/contexts/services";
import { listProjectsAction } from "@/features/projects/actions/project-actions";
import { ContextCard } from "@/features/contexts/components/viewer/context-card";
import { FilterContainer } from "@/features/contexts/components/viewer/filter-container";
import { PageContainer } from "@/features/shared/components/page-container";
import { EmptyState } from "@/features/shared/components/empty-state";
import { FilePlus } from "lucide-react";

interface ContextsPageProps {
  searchParams: Promise<{
    search?: string;
    projectId?: string;
    tags?: string;
  }>;
}

export default async function ContextsPage({
  searchParams,
}: ContextsPageProps) {
  const params = await searchParams;

  // Fetch data in parallel (eliminates waterfall)
  const [projectsResult, contexts] = await Promise.all([
    listProjectsAction(),
    listContexts({
      search: params.search,
      projectId: params.projectId,
      tags: params.tags
        ? params.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
    }),
  ]);

  const projects = projectsResult.success ? projectsResult.data || [] : [];

  if (
    contexts.length === 0 &&
    !params.search &&
    !params.projectId &&
    !params.tags
  ) {
    return (
      <EmptyState
        title="No Contexts Found"
        description="Create your first context to start building structured technical documentation."
        actions={[
          {
            text: "Create Context",
            href: "/dashboard/composer",
            icon: FilePlus,
          },
        ]}
      />
    );
  }

  return (
    <PageContainer
      title="Your AI Contexts"
      description="Browse and manage your AI context repository."
      rightContent={
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded border border-border">
            {projects.length} Projects
          </span>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded border border-border">
            {contexts.length} Contexts
          </span>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Filters */}
        <FilterContainer projects={projects} initialValues={params} />

        {/* Results */}
        {contexts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contexts.map((context) => (
              <ContextCard
                key={context.id}
                context={context}
                projectName={
                  projects.find((p) => p.id === context.projectId)?.name
                }
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
