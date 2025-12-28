import { Suspense } from "react"
import { getUserContexts } from "@/features/core/app/store/get-user-contexts"
import { projectsRepository } from "@/features/core/infra/db/projects-repository"
import { DEV_USER_ID } from "@/lib/config-dev"
import { StoreEmptyState } from "@/features/store/components/store-empty-state"
import { ContextCard } from "@/features/store/components/context-card"
import { FilterContainer } from "@/features/store/components/filter-container"
import { PageHeader } from "@/features/shared/components/layout/page-header"
import { ContentContainer } from "@/features/shared/components/layout/content-container"

interface ContextsPageProps {
  searchParams: Promise<{
    search?: string
    projectId?: string
    tags?: string
  }>
}

export default async function ContextsPage({ searchParams }: ContextsPageProps) {
  const params = await searchParams
  
  // 1. Fetch data on the server
  const projects = await projectsRepository.getByOwnerId(DEV_USER_ID)
  const contexts = await getUserContexts({
    search: params.search,
    projectId: params.projectId,
    tags: params.tags ? params.tags.split(",").map(t => t.trim()).filter(Boolean) : undefined
  })

  return (
    <ContentContainer>
      <PageHeader 
        title="Your AI Contexts" 
        description="Browse and manage your AI context repository."
      >
        <div className="flex items-center gap-2">
           <span className="text-xs font-medium text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
              {projects.length} Projects
           </span>
            <span className="text-xs font-medium text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
              {contexts.length} Contexts
           </span>
        </div>
      </PageHeader>

      <div className="space-y-8">
        {/* Filters */}
        <FilterContainer projects={projects} initialValues={params} />

        {/* Results */}
        <div className="min-h-[400px]">
          {contexts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contexts.map(context => (
                <ContextCard 
                  key={context.id} 
                  context={context} 
                  projectName={projects.find(p => p.id === context.projectId)?.name}
                />
              ))}
            </div>
          ) : (
            <StoreEmptyState />
          )}
        </div>
      </div>
    </ContentContainer>
  )
}
