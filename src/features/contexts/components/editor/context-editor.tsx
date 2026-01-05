"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/features/shared/ui/button";
import { Input } from "@/features/shared/ui/input";
import { Textarea } from "@/features/shared/ui/textarea";
import { ContentContainer } from "@/features/shared/components/layout/content-container";
import { Loader2, ArrowLeft } from "lucide-react";
import { appRoutes } from "@/features/routes";
import {
  createContextAction,
  updateContextAction,
} from "@/features/contexts/actions/context-actions";
import Link from "next/link";

interface ContextEditorProps {
  mode: "create" | "edit";
  projectId: string;
  projectSlug: string;
  projectName: string;
  initialData?: {
    id: string;
    name: string;
    tags: string[];
    markdown: string;
  };
}

export function ContextEditor({
  mode,
  projectId,
  projectSlug,
  projectName,
  initialData,
}: ContextEditorProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name ?? "");
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") ?? "",
  );
  const [markdown, setMarkdown] = useState(initialData?.markdown ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = mode === "edit";
  const pageTitle = isEdit ? "Edit Context" : "Create Context";
  const pageDescription = isEdit
    ? "Update your context content. Saving will create a new version."
    : "Create a new AI context with structured markdown content.";

  const parseTags = (input: string): string[] => {
    return input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Context name is required");
      return;
    }

    if (!markdown.trim()) {
      setError("Content cannot be empty");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEdit && initialData) {
        const result = await updateContextAction({
          contextId: initialData.id,
          name: name.trim(),
          tags: parseTags(tagsInput),
          markdown: markdown.trim(),
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to update context");
        }

        router.push(
          appRoutes.contexts.detail.generatePath({
            projectSlug,
            id: initialData.id,
          }),
        );
      } else {
        const result = await createContextAction({
          projectId,
          name: name.trim(),
          tags: parseTags(tagsInput),
          markdown: markdown.trim(),
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to create context");
        }

        router.push(appRoutes.contexts.list.generatePath({ projectSlug }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isEdit && initialData) {
      router.push(
        appRoutes.contexts.detail.generatePath({
          projectSlug,
          id: initialData.id,
        }),
      );
    } else {
      router.push(appRoutes.contexts.list.generatePath({ projectSlug }));
    }
  };

  return (
    <ContentContainer size="md">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href={
              isEdit && initialData
                ? appRoutes.contexts.detail.generatePath({
                    projectSlug,
                    id: initialData.id,
                  })
                : appRoutes.contexts.list.generatePath({ projectSlug })
            }
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 border border-primary/20 rounded">
                {projectName}
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-foreground">
              {pageTitle}
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground">{pageDescription}</p>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-6">
        {/* Context Name */}
        <div className="space-y-2">
          <label
            htmlFor="context-name"
            className="text-sm font-medium text-foreground"
          >
            Context Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="context-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="e.g., Project Architecture, Authentication Rules"
            className="bg-background border-border"
            disabled={isSaving}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label
            htmlFor="context-tags"
            className="text-sm font-medium text-foreground"
          >
            Tags{" "}
            <span className="text-muted-foreground font-normal">
              (comma-separated)
            </span>
          </label>
          <Input
            id="context-tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g., architecture, rules, onboarding"
            className="bg-background border-border"
            disabled={isSaving}
          />
          {parseTags(tagsInput).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {parseTags(tagsInput).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Markdown Content */}
        <div className="space-y-2">
          <label
            htmlFor="context-content"
            className="text-sm font-medium text-foreground"
          >
            Content <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="context-content"
            value={markdown}
            onChange={(e) => {
              setMarkdown(e.target.value);
              setError(null);
            }}
            placeholder="Write your context content in markdown..."
            className="min-h-80 bg-background border-border font-mono text-sm"
            disabled={isSaving}
          />
          <p className="text-xs text-muted-foreground">
            Supports markdown formatting. This content will be versioned
            automatically on each save.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !name.trim() || !markdown.trim()}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Context"
            )}
          </Button>
        </div>
      </div>
    </ContentContainer>
  );
}
