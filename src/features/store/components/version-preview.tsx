import { ContextVersion } from "../../core/domain/types/contexts"
import { Copy, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VersionPreviewProps {
  version: ContextVersion | null
}

export function VersionPreview({ version }: VersionPreviewProps) {
  if (!version) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center bg-zinc-950 border border-zinc-900 rounded-2xl h-full">
        <FileText className="w-12 h-12 text-zinc-800 mb-4" />
        <p className="text-zinc-500 text-sm">Select a version to preview content</p>
      </div>
    )
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(version.markdown)
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Markdown Preview</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyToClipboard}
          className="h-8 text-xs text-zinc-400 hover:text-white"
        >
          <Copy className="w-3.5 h-3.5 mr-2" />
          Copy
        </Button>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="prose prose-invert prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-mono text-zinc-300 text-sm bg-transparent border-0 p-0 mb-0">
            {version.markdown}
          </pre>
        </div>
      </div>
    </div>
  )
}
