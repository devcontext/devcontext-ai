"use client";

import type { ComposerMode } from "../../types";
import { Button } from "@/features/shared/ui/button";
import { cn } from "@/lib/utils";

type StepSelectModeProps = {
  mode: ComposerMode | null;
  onSetMode: (mode: ComposerMode) => void;
  onContinue: () => void;
  onBack: () => void;
};

const MODE_OPTIONS: {
  value: ComposerMode;
  label: string;
  description: string;
}[] = [
  {
    value: "reference-only",
    label: "Reference Only",
    description: "Store sources as-is, no AI generation",
  },
  {
    value: "guided-draft",
    label: "Guided Draft",
    description: "AI generates a structured context draft from sources",
  },
  {
    value: "both",
    label: "Both",
    description: "Store sources + generate AI draft",
  },
];

export function StepSelectMode({
  mode,
  onSetMode,
  onContinue,
  onBack,
}: StepSelectModeProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Step 2: Select Mode
        </h2>
        <p className="text-muted-foreground">
          Choose how you want to use your sources.
        </p>
      </div>

      {/* Mode Options */}
      <div className="space-y-3">
        {MODE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSetMode(option.value)}
            className={cn(
              "w-full text-left p-4 rounded-lg border transition-colors",
              mode === option.value
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-sidebar-ring",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  mode === option.value
                    ? "border-primary"
                    : "border-muted-foreground",
                )}
              >
                {mode === option.value && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <div className="font-medium text-foreground">
                  {option.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {option.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue} disabled={!mode}>
          Continue
        </Button>
      </div>
    </div>
  );
}
