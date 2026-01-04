"use client";

import { useCallback } from "react";
import { WizardLayout } from "@/features/contexts/components/composer/wizard-layout";
import { StepAddSources } from "@/features/contexts/components/composer/step-add-sources";
import { StepSelectMode } from "@/features/contexts/components/composer/step-select-mode";
import { StepGuidedGeneration } from "@/features/contexts/components/composer/step-guided-generation";
import { StepEditorSave } from "@/features/contexts/components/composer/step-editor-save";
import { useWizardState } from "@/features/contexts/hooks/use-wizard-state";
import { useCurrentProject } from "@/features/projects/providers/project-provider";

export default function ComposerPage() {
  const wizard = useWizardState();
  const project = useCurrentProject();

  const handleSkipStep3 = useCallback(() => {
    // Skip directly to step 4
    wizard.nextStep();
  }, [wizard]);

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
          projectId={project.id}
        />
      )}
    </WizardLayout>
  );
}
