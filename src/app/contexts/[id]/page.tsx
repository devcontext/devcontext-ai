import { notFound } from "next/navigation"
import { getContextDetails } from "@/features/core/app/store/get-context-details"
import { projectsRepository } from "@/features/core/infra/db/projects-repository"
import { ContextDetailContainer } from "@/features/store/components/context-detail-container"
import { ArrowLeft, Database, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ContextDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ContextDetailPage({ params }: ContextDetailPageProps) {
  const { id } = await params
  
  // 1. Fetch data
  const details = await getContextDetails(id)
  if (!details) {
    notFound()
  }

  const project = await projectsRepository.getById(details.context.projectId)

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/contexts" 
              className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-zinc-800 mx-2" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Context Store</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <Link 
              href="/composer"
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              Open Composer
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Context Info Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded">
                CONTEXT
              </span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400 text-sm font-medium">{project?.name || "Unknown Project"}</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">{details.context.name}</h2>
          </div>
        </div>

        {/* Detailed Container (Client Component) */}
        <ContextDetailContainer details={details} />
      </main>
    </div>
  )
}
