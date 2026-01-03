import { getUserContexts } from "@/features/core/app/store/get-user-contexts";
import { projectsRepository } from "@/features/core/infra/db/projects-repository";
import { requireUser } from "@/features/auth/utils/get-user";
import { ContextCard } from "@/features/store/components/context-card";
import { FilterContainer } from "@/features/store/components/filter-container";
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

  // Get authenticated user (redirects to login if not authenticated)
  const user = await requireUser();

  // 1. Fetch data on the server
  const projects = await projectsRepository.getByOwnerId(user.id);
  const contexts = await getUserContexts({
    search: params.search,
    projectId: params.projectId,
    tags: params.tags
      ? params.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined,
  });

  if (contexts.length === 0) {
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
      </div>
    </PageContainer>
  );
}
