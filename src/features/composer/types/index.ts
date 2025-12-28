/**
 * Composer feature types
 */

export type ComposerMode = "reference-only" | "guided-draft" | "both"

export type WizardStep = 1 | 2 | 3 | 4

export type SourceItem = {
  id: string
  name: string
  type: "file" | "text"
  content: string
}

export type WizardState = {
  currentStep: WizardStep
  sources: SourceItem[]
  mode: ComposerMode | null
  draft: string
  contextName: string
  tags: string[]
  isGenerating: boolean
  isSaving: boolean
  error: string | null
}

export type WizardActions = {
  addSource: (source: Omit<SourceItem, "id">) => void
  removeSource: (id: string) => void
  setMode: (mode: ComposerMode) => void
  setDraft: (draft: string) => void
  setContextName: (name: string) => void
  setTags: (tags: string[]) => void
  nextStep: () => void
  prevStep: () => void
  setIsGenerating: (value: boolean) => void
  setIsSaving: (value: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}
