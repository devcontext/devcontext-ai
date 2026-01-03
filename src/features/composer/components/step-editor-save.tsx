"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SourceItem, ComposerMode } from "../types";
import { Button } from "@/features/shared/ui/button";
import { Loader2 } from "lucide-react";
import { saveContextAction } from "@/features/composer/actions/save-context";
import { Input } from "@/features/shared/ui/input";
import { Textarea } from "@/features/shared/ui/textarea";

type StepEditorSaveProps = {
  sources: SourceItem[];
  mode: ComposerMode | null;
  draft: string;
  contextName: string;
  tags: string[];
  isSaving: boolean;
  error: string | null;
  onSetDraft: (draft: string) => void;
  onSetContextName: (name: string) => void;
  onSetTags: (tags: string[]) => void;
  onSetIsSaving: (value: boolean) => void;
  onSetError: (error: string | null) => void;
  onBack: () => void;
  projectId: string;
};

export function StepEditorSave({
  sources,
  mode,
  draft,
  contextName,
  tags,
  isSaving,
  error,
  onSetDraft,
  onSetContextName,
  onSetTags,
  onSetIsSaving,
  onSetError,
  onBack,
  projectId,
}: StepEditorSaveProps) {
  const router = useRouter();
  const [tagsInput, setTagsInput] = useState(tags.join(", "));

  // For reference-only mode, use sources as content
  const content =
    mode === "reference-only"
      ? sources.map((s) => `## ${s.name}\n\n${s.content}`).join("\n\n---\n\n")
      : draft;

  const handleSave = async () => {
    if (!contextName.trim()) {
      onSetError("Context name is required");
      return;
    }

    onSetIsSaving(true);
    onSetError(null);

    // ... inside handleSave
    try {
      const result = await saveContextAction({
        name: contextName.trim(),
        markdown: content,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        projectId,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to save context");
      }

      // Success - redirect to contexts list
      router.push("/dashboard/contexts");
    } catch (err) {
      onSetError(err instanceof Error ? err.message : "Failed to save context");
    } finally {
      onSetIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Step 4: Edit & Save
        </h2>
        <p className="text-muted-foreground">
          Review your context, give it a name, and save.
        </p>
      </div>

      {/* Context Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Context Name <span className="text-destructive">*</span>
        </label>
        <Input
          value={contextName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSetContextName(e.target.value)
          }
          placeholder="e.g., Project Architecture"
          className="bg-background border-border"
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Tags (comma-separated)
        </label>
        <Input
          value={tagsInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTagsInput(e.target.value);
            onSetTags(
              e.target.value
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean),
            );
          }}
          placeholder="e.g., architecture, rules, onboarding"
          className="bg-background border-border"
        />
      </div>

      {/* Editor */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Context Content
        </label>
        <Textarea
          value={mode === "reference-only" ? content : draft}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            mode !== "reference-only" && onSetDraft(e.target.value)
          }
          readOnly={mode === "reference-only"}
          className="min-h-[300px] bg-background border-border font-mono text-sm"
        />
        {mode === "reference-only" && (
          <p className="text-xs text-muted-foreground">
            Reference-only mode: content is based on your sources.
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isSaving}>
          Back
        </Button>
        <Button onClick={handleSave} disabled={isSaving || !contextName.trim()}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Context"
          )}
        </Button>
      </div>
    </div>
  );
}
