import { ContextVersion } from "../../core/domain/types/contexts"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle2, History, Trash2, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface VersionTimelineProps {
  versions: ContextVersion[]
  selectedVersionId: string | null
  onSelectVersion: (id: string) => void
  onRestore: (id: string) => void
  isRestoring?: boolean
}

export function VersionTimeline({ 
  versions, 
  selectedVersionId, 
  onSelectVersion, 
  onRestore,
  isRestoring 
}: VersionTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-zinc-400 mb-4 px-2">
        <History className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Version History</span>
      </div>

      <div className="relative ml-4 border-l border-zinc-800 space-y-1">
        {versions.map((version, index) => {
          const isLatest = index === 0
          const isSelected = selectedVersionId === version.id
          const timestamp = formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })
          const versionNumber = versions.length - index

          return (
            <div key={version.id} className="relative pl-8 pb-8 group last:pb-0">
              {/* Dot mapping */}
              <div className={cn(
                "absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 transition-all",
                isLatest ? "bg-blue-500 border-blue-500" : "bg-zinc-950 border-zinc-700 group-hover:border-zinc-500",
                isSelected && !isLatest && "border-blue-400 bg-blue-400"
              )} />

              <div 
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer",
                  isSelected 
                    ? "bg-zinc-900 border-zinc-700 ring-1 ring-blue-500/20" 
                    : "bg-transparent border-transparent hover:bg-zinc-900/50 hover:border-zinc-800"
                )}
                onClick={() => onSelectVersion(version.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">v{versionNumber}</span>
                    {isLatest && (
                      <span className="flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                        LATEST
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500">{timestamp}</span>
                </div>

                <div className="text-xs text-zinc-400 mb-4 line-clamp-2">
                  {version.markdown.substring(0, 100)}...
                </div>

                {isSelected && !isLatest && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRestore(version.id)
                    }}
                    disabled={isRestoring}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
                  >
                    <RotateCcw className={cn("w-3 h-3", isRestoring && "animate-spin")} />
                    {isRestoring ? "Restoring..." : "Restore this version"}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
