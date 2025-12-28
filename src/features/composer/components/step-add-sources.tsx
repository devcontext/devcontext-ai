"use client"

import { useRef, ChangeEvent } from "react"
import type { SourceItem } from "../types"
import { Button } from "@/components/ui/button"
import { X, Upload, FileText } from "lucide-react"

type StepAddSourcesProps = {
  sources: SourceItem[]
  onAddSource: (source: Omit<SourceItem, "id">) => void
  onRemoveSource: (id: string) => void
  onContinue: () => void
}

export function StepAddSources({
  sources,
  onAddSource,
  onRemoveSource,
  onContinue,
}: StepAddSourcesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max size is 5MB.`)
        continue
      }

      // Check file type
      const validExtensions = [".md", ".txt", ".pdf"]
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
      if (!validExtensions.includes(ext)) {
        alert(`File ${file.name} has invalid extension. Use .md, .txt, or .pdf`)
        continue
      }

      // Read file content
      const content = await file.text()
      onAddSource({
        name: file.name,
        type: "file",
        content,
      })
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePasteText = () => {
    const text = prompt("Paste your text content:")
    if (text && text.trim()) {
      onAddSource({
        name: `Pasted text ${sources.length + 1}`,
        type: "text",
        content: text.trim(),
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Step 1: Add Sources
        </h2>
        <p className="text-zinc-400">
          Upload files or paste text to use as context sources.
        </p>
      </div>

      {/* Upload Actions */}
      <div className="flex gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.txt,.pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
        <Button
          variant="outline"
          onClick={handlePasteText}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </Button>
      </div>

      {/* Sources List */}
      {sources.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-400">
            Added Sources ({sources.length})
          </h3>
          <div className="space-y-2">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-white">{source.name}</span>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                    {source.type}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveSource(source.id)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-zinc-700 rounded-lg">
          <p className="text-zinc-500">No sources added yet</p>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          disabled={sources.length === 0}
          className="px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
