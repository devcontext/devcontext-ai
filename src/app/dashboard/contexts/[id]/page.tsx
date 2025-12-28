import { notFound } from "next/navigation"
import { getContextDetails } from "@/features/core/app/store/get-context-details"
import { projectsRepository } from "@/features/core/infra/db/projects-repository"
import { ContextDetailContainer } from "@/features/store/components/context-detail-container"
import { ContentContainer } from "@/features/shared/components/layout/content-container"
import { ArrowLeft, ExternalLink } from "lucide-react"
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
    <ContentContainer>
       {/* Custom Header with Back Navigation */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/contexts" 
              className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-zinc-800 mx-2" />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded">
                  {project?.name || "Unknown Project"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">{details.context.name}</h1>
            </div>
          </div>
          
          <Link 
            href="/dashboard/composer"
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            Open Composer
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Detailed Container (Client Component) */}
        <ContextDetailContainer details={details} />
    </ContentContainer>
  )
}
