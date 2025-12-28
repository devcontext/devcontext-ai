"use client"

import { useCallback } from "react"
import { WizardLayout } from "@/features/composer/components/wizard-layout"
import { StepAddSources } from "@/features/composer/components/step-add-sources"
import { StepSelectMode } from "@/features/composer/components/step-select-mode"
import { StepGuidedGeneration } from "@/features/composer/components/step-guided-generation"
import { StepEditorSave } from "@/features/composer/components/step-editor-save"
import { useWizardState } from "@/features/composer/hooks/use-wizard-state"

import { DEV_PROJECT_ID } from "@/lib/config-dev"

export default function ComposerPage() {
  const wizard = useWizardState()

  const handleSkipStep3 = useCallback(() => {
    // Skip directly to step 4
    wizard.nextStep()
  }, [wizard])

  return (
    <WizardLayout currentStep={wizard.currentStep}>
      {wizard.currentStep === 1 && (
        <StepAddSources
          sources={wizard.sources}
          onAddSource={wizard.addSource}
          onRemoveSource={wizard.removeSource}
          onContinue={wizard.nextStep}
        />
      )}
      {wizard.currentStep === 2 && (
        <StepSelectMode
          mode={wizard.mode}
          onSetMode={wizard.setMode}
          onContinue={wizard.nextStep}
          onBack={wizard.prevStep}
        />
      )}
      {wizard.currentStep === 3 && (
        <StepGuidedGeneration
          sources={wizard.sources}
          mode={wizard.mode}
          draft={wizard.draft}
          isGenerating={wizard.isGenerating}
          onSetDraft={wizard.setDraft}
          onSetIsGenerating={wizard.setIsGenerating}
          onContinue={wizard.nextStep}
          onBack={wizard.prevStep}
          onSkip={handleSkipStep3}
        />
      )}
      {wizard.currentStep === 4 && (
        <StepEditorSave
          sources={wizard.sources}
          mode={wizard.mode}
          draft={wizard.draft}
          contextName={wizard.contextName}
          tags={wizard.tags}
          isSaving={wizard.isSaving}
          error={wizard.error}
          onSetDraft={wizard.setDraft}
          onSetContextName={wizard.setContextName}
          onSetTags={wizard.setTags}
          onSetIsSaving={wizard.setIsSaving}
          onSetError={wizard.setError}
          onBack={wizard.prevStep}
          projectId={DEV_PROJECT_ID}
        />
      )}
    </WizardLayout>
  )
}
