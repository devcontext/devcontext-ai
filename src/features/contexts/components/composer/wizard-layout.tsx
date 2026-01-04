"use client";

import { ReactNode } from "react";
import type { WizardStep } from "../../types";
import { ContentContainer } from "@/features/shared/components/layout/content-container";
import { cn } from "@/lib/utils";

const STEP_LABELS = {
  1: "Add Sources",
  2: "Select Mode",
  3: "Generate Draft",
  4: "Save",
};

type WizardLayoutProps = {
  currentStep: WizardStep;
  children: ReactNode;
};

export function WizardLayout({ currentStep, children }: WizardLayoutProps) {
  return (
    <ContentContainer size="md">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Context Composer
        </h1>
        <p className="text-muted-foreground">
          Create and version your AI context
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {([1, 2, 3, 4] as WizardStep[]).map((step) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === currentStep
                      ? "bg-primary text-primary-foreground"
                      : step < currentStep
                        ? "bg-muted text-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {step < currentStep ? "✓" : step}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs",
                    step === currentStep
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
              {step < 4 && (
                <div
                  className={cn(
                    "w-24 h-0.5 mx-2",
                    step < currentStep ? "bg-muted-foreground" : "bg-muted",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        {children}
      </div>
    </ContentContainer>
  );
}
