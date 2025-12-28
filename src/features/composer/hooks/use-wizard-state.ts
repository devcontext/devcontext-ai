"use client"

import { useState, useCallback } from "react"
import type { WizardState, WizardActions, WizardStep, ComposerMode, SourceItem } from "../types"

const initialState: WizardState = {
  currentStep: 1,
  sources: [],
  mode: null,
  draft: "",
  contextName: "",
  tags: [],
  isGenerating: false,
  isSaving: false,
  error: null,
}

export function useWizardState(): WizardState & WizardActions {
  const [state, setState] = useState<WizardState>(initialState)

  const addSource = useCallback((source: Omit<SourceItem, "id">) => {
    const id = `source-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setState((prev) => ({
      ...prev,
      sources: [...prev.sources, { ...source, id }],
      error: null,
    }))
  }, [])

  const removeSource = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      sources: prev.sources.filter((s) => s.id !== id),
    }))
  }, [])

  const setMode = useCallback((mode: ComposerMode) => {
    setState((prev) => ({ ...prev, mode, error: null }))
  }, [])

  const setDraft = useCallback((draft: string) => {
    setState((prev) => ({ ...prev, draft }))
  }, [])

  const setContextName = useCallback((contextName: string) => {
    setState((prev) => ({ ...prev, contextName, error: null }))
  }, [])

  const setTags = useCallback((tags: string[]) => {
    setState((prev) => ({ ...prev, tags }))
  }, [])

  const nextStep = useCallback(() => {
    setState((prev) => {
      const next = Math.min(prev.currentStep + 1, 4) as WizardStep
      return { ...prev, currentStep: next, error: null }
    })
  }, [])

  const prevStep = useCallback(() => {
    setState((prev) => {
      const prev_step = Math.max(prev.currentStep - 1, 1) as WizardStep
      return { ...prev, currentStep: prev_step, error: null }
    })
  }, [])

  const setIsGenerating = useCallback((isGenerating: boolean) => {
    setState((prev) => ({ ...prev, isGenerating }))
  }, [])

  const setIsSaving = useCallback((isSaving: boolean) => {
    setState((prev) => ({ ...prev, isSaving }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }, [])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    ...state,
    addSource,
    removeSource,
    setMode,
    setDraft,
    setContextName,
    setTags,
    nextStep,
    prevStep,
    setIsGenerating,
    setIsSaving,
    setError,
    reset,
  }
}
