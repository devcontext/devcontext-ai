"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ContextDetails } from "../../core/app/store/get-context-details"
import { VersionTimeline } from "./version-timeline"
import { VersionPreview } from "./version-preview"
import { restoreVersionAction, deleteContextAction } from "../actions/context-actions"
import { Button } from "@/components/ui/button"
import { Trash2, AlertCircle } from "lucide-react"

interface ContextDetailContainerProps {
  details: ContextDetails
}

export function ContextDetailContainer({ details }: ContextDetailContainerProps) {
  const router = useRouter()
  const [selectedVersionId, setSelectedVersionId] = useState<string>(details.versions[0]?.id || "")
  const [isRestoring, setIsRestoring] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedVersion = details.versions.find(v => v.id === selectedVersionId) || null

  const handleRestore = async (versionId: string) => {
    if (!confirm("Are you sure you want to restore this version? This will create a new entry in the history.")) return
    
    setIsRestoring(true)
    setError(null)
    
    const result = await restoreVersionAction(versionId)
    
    if (result.success) {
      // revalidatePath handles data refresh, we just need to select the new latest version
      // In a real app we might want to wait for the refresh or handle it via router.refresh()
      router.refresh()
    } else {
      setError(result.error || "Failed to restore version")
    }
    
    setIsRestoring(false)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this context? This action cannot be undone.")) return
    
    setIsDeleting(true)
    setError(null)
    
    const result = await deleteContextAction(details.context.id)
    
    if (result.success) {
      router.push("/dashboard/contexts")
    } else {
      setError(result.error || "Failed to delete context")
      setIsDeleting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar: Timeline */}
      <div className="lg:col-span-4 xl:col-span-3 space-y-8">
        <VersionTimeline 
          versions={details.versions}
          selectedVersionId={selectedVersionId}
          onSelectVersion={setSelectedVersionId}
          onRestore={handleRestore}
          isRestoring={isRestoring}
        />

        <div className="pt-8 border-t border-zinc-900">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 h-10 px-4"
            onClick={handleDelete}
            disabled={isDeleting || isRestoring}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Context
          </Button>
        </div>
      </div>

      {/* Main content: Preview */}
      <div className="lg:col-span-8 xl:col-span-9 h-[calc(100vh-300px)] min-h-[500px] flex flex-col gap-4">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-4">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        <VersionPreview version={selectedVersion} />
      </div>
    </div>
  )
}
