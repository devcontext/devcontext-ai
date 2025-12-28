import { Context } from "../../core/domain/types/contexts"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Tag, Clock, Folder } from "lucide-react"

interface ContextCardProps {
  context: Context
  projectName?: string
}

export function ContextCard({ context, projectName }: ContextCardProps) {
  const lastUpdated = formatDistanceToNow(new Date(context.updatedAt), { addSuffix: true })

  return (
    <Link 
      href={`/contexts/${context.id}`}
      className="group block p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all hover:bg-zinc-800/50"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
          {context.name}
        </h3>
        {projectName && (
          <div className="flex items-center text-xs font-medium px-2 py-1 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700">
            <Folder className="w-3 h-3 mr-1.5" />
            {projectName}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {context.tags.length > 0 ? (
          context.tags.map(tag => (
            <span 
              key={tag} 
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
            >
              <Tag className="w-2.5 h-2.5 mr-1" />
              {tag}
            </span>
          ))
        ) : (
          <span className="text-zinc-500 text-[10px] italic">No tags</span>
        )}
      </div>

      <div className="flex items-center text-xs text-zinc-500">
        <Clock className="w-3 h-3 mr-1.5" />
        Updated {lastUpdated}
      </div>
    </Link>
  )
}
