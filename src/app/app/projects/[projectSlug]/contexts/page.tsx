import { listContexts } from "@/features/contexts/services";
import { ContextTable } from "@/features/contexts/components/viewer/context-table";
import { FilterContainer } from "@/features/contexts/components/viewer/filter-container";
import { PageContainer } from "@/features/shared/components/page-container";
import { EmptyState } from "@/features/shared/components/empty-state";
import { FilePlus, Plus } from "lucide-react";
import { getProjectBySlug } from "@/features/projects/services/get-project-by-slug";
import { listProjectsAction } from "@/features/projects/actions/project-actions";
import { appRoutes } from "@/features/routes";
import Link from "next/link";
import { Button } from "@/features/shared/ui/button";

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
        title="No Context Defined"
        description="Declare the specific rules and technical guidelines that the AI must respect within this project."
        actions={[
          {
            text: "Create Context",
            href: appRoutes.contexts.composer.generatePath({ projectSlug }),
            icon: FilePlus,
          },
        ]}
      />
    );
  }

  // Listing - show table
  return (
    <PageContainer
      title={`${project.name} · Contexts`}
      description="Explicit context declarations that define what the AI must respect within this project."
      rightContent={
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="h-9 px-4 shadow-sm active:scale-95 transition-all"
            asChild
          >
            <Link
              href={appRoutes.contexts.composer.generatePath({ projectSlug })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Context
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Results Table */}
        <ContextTable contexts={contexts} projectSlug={projectSlug} />
      </div>
    </PageContainer>
  );
}
