"use client"

import { useEffect } from "react"
import type { ComposerMode, SourceItem } from "../types"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type StepGuidedGenerationProps = {
  sources: SourceItem[]
  mode: ComposerMode | null
  draft: string
  isGenerating: boolean
  onSetDraft: (draft: string) => void
  onSetIsGenerating: (value: boolean) => void
  onContinue: () => void
  onBack: () => void
  onSkip: () => void
}

export function StepGuidedGeneration({
  sources,
  mode,
  draft,
  isGenerating,
  onSetDraft,
  onSetIsGenerating,
  onContinue,
  onBack,
  onSkip,
}: StepGuidedGenerationProps) {
  // Skip this step if mode is "reference-only"
  useEffect(() => {
    if (mode === "reference-only") {
      onSkip()
    }
  }, [mode, onSkip])

  // Generate draft when step loads
  useEffect(() => {
    if (mode !== "reference-only" && !draft && !isGenerating) {
      generateDraft()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const generateDraft = async () => {
    onSetIsGenerating(true)
    try {
      const response = await fetch("/api/composer/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: sources.map((s) => ({
            name: s.name,
            type: s.type,
            content: s.content,
          })),
          mode,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate draft")
      }

      const data = await response.json()
      onSetDraft(data.draft || "")
    } catch (error) {
      console.error("Draft generation error:", error)
      // Fallback to basic template
      const fallbackDraft = sources
        .map((s) => `## ${s.name}\n\n${s.content}`)
        .join("\n\n---\n\n")
      onSetDraft(`# Context Draft\n\n${fallbackDraft}`)
    } finally {
      onSetIsGenerating(false)
    }
  }

  if (mode === "reference-only") {
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Step 3: Generate Draft
        </h2>
        <p className="text-zinc-400">
          AI is generating a structured context draft from your sources.
        </p>
      </div>

      {/* Content */}
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-zinc-400">Generating context draft...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono">
              {draft}
            </pre>
          </div>
          <p className="text-xs text-zinc-500">
            This draft is editable in the next step.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isGenerating}>
          Back
        </Button>
        <Button onClick={onContinue} disabled={isGenerating || !draft}>
          Continue to Editor
        </Button>
      </div>
    </div>
  )
}
