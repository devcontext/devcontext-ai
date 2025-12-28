import { Suspense } from "react"
import { getUserContexts } from "@/features/core/app/store/get-user-contexts"
import { projectsRepository } from "@/features/core/infra/db/projects-repository"
import { DEV_USER_ID } from "@/lib/config-dev"
import { StoreEmptyState } from "@/features/store/components/store-empty-state"
import { ContextCard } from "@/features/store/components/context-card"
import { FilterContainer } from "@/features/store/components/filter-container"
import { LayoutGrid, Database } from "lucide-react"

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
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Context Store</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-1">Cortex Repository</p>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Your AI Contexts</h2>
            </div>
          </div>

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
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-900 mt-12">
        <p className="text-zinc-600 text-sm">
          &copy; {new Date().getFullYear()} Context AI Control Plane. All technical guidelines are deterministic.
        </p>
      </footer>
    </div>
  )
}
