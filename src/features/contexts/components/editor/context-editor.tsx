"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/features/shared/ui/button";
import { Textarea } from "@/features/shared/ui/textarea";
import { Badge } from "@/features/shared/ui/badge";
import { FormField } from "@/features/shared/components/form/form-field";
import {
  Loader2,
  ArrowLeft,
  Copy,
  History,
  Download,
  Trash2,
  FileText,
} from "lucide-react";
import { appRoutes } from "@/features/routes";
import {
  createContextAction,
  updateContextAction,
  deleteContextAction,
} from "@/features/contexts/actions/context-actions";
import Link from "next/link";
import { useToast } from "@/features/shared/hooks/use-toast";
import {
  contextEditorFormSchema,
  type ContextEditorFormData,
} from "@/features/contexts/schemas";
import type { ContextVersion } from "@/features/core/domain/types/contexts";
import { VersionHistoryModal } from "../version-history-modal";

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
  currentVersionId?: string;
  versions?: ContextVersion[];
}

export function ContextEditor({
  mode,
  projectId,
  projectSlug,
  projectName,
  initialData,
  currentVersionId,
  versions = [],
}: ContextEditorProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  const isEdit = mode === "edit";
  const pageTitle = isEdit
    ? initialData?.name || "Edit Context"
    : "Create Context";
  const pageDescription = isEdit
    ? "Modify existing context declaration to ensure the AI has accurate information."
    : "Declare the explicit context that the AI must respect within this project.";

  // Initialize form with RHF + Zod
  const methods = useForm<ContextEditorFormData>({
    resolver: zodResolver(contextEditorFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: initialData?.name ?? "",
      tagsInput: initialData?.tags?.join(", ") ?? "",
      markdown: initialData?.markdown ?? "",
    },
  });

  const {
    formState: { isSubmitting, isDirty },
    watch,
    setError,
  } = methods;

  const tagsInput = watch("tagsInput");

  // Reset form when initialData changes (e.g., after version restore)
  useEffect(() => {
    if (initialData) {
      methods.reset({
        name: initialData.name,
        tagsInput: initialData.tags?.join(", ") ?? "",
        markdown: initialData.markdown,
      });
    }
  }, [initialData?.markdown, initialData?.name, initialData?.tags, methods]);

  const parseTags = (input: string): string[] => {
    return input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const onSubmit = async (data: ContextEditorFormData) => {
    try {
      if (isEdit && initialData) {
        const result = await updateContextAction({
          contextId: initialData.id,
          name: data.name.trim(),
          tags: parseTags(data.tagsInput),
          markdown: data.markdown.trim(),
        });

        if (!result.success) {
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, message]) => {
              setError(field as keyof ContextEditorFormData, {
                type: "manual",
                message: message as string, // Cast to string as message can be string[]
              });
            });
          }
          setError("root", {
            type: "manual",
            message: result.error || "Failed to save changes",
          });
          return;
        }

        toast({
          title: "Context updated",
          description: "Your changes have been saved successfully.",
          variant: "success",
        });

        router.refresh();
      } else {
        const result = await createContextAction({
          projectId,
          name: data.name.trim(),
          tags: parseTags(data.tagsInput),
          markdown: data.markdown.trim(),
        });

        if (!result.success) {
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, message]) => {
              setError(field as keyof ContextEditorFormData, {
                type: "manual",
                message: message as string, // Cast to string as message can be string[]
              });
            });
          }
          setError("root", {
            type: "manual",
            message: result.error || "Failed to create context",
          });
          return;
        }

        toast({
          title: "Context created",
          description: "Your context has been created successfully.",
          variant: "success",
        });

        router.push(appRoutes.contexts.list.generatePath({ projectSlug }));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError("root", {
        type: "manual",
        message: errorMessage,
      });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;

    if (!confirm(`Are you sure you want to delete "${initialData.name}"?`))
      return;

    setIsDeleting(true);
    try {
      const result = await deleteContextAction(initialData.id);
      if (result.success) {
        toast({
          title: "Context deleted",
          description: `"${initialData.name}" has been removed.`,
          variant: "success",
        });
        router.push(appRoutes.contexts.list.generatePath({ projectSlug }));
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete context",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = () => {
    const markdown = methods.getValues("markdown");
    navigator.clipboard.writeText(markdown);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const handleExport = () => {
    const { name, markdown } = methods.getValues();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "context"}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exported",
      description: "Context exported as Markdown file",
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="h-full flex flex-col bg-background overflow-hidden"
      >
        {/* Top Bar */}
        <div className="border-b border-border bg-card/30 shrink-0">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href={appRoutes.contexts.list.generatePath({ projectSlug })}
                  className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="h-6 w-px bg-border" />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 border border-primary/20 rounded">
                      {projectName}
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-foreground tracking-tight">
                    {pageTitle}
                  </h1>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {pageDescription}
            </p>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 py-4 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">
              {/* Left Column - Metadata */}
              <div className="lg:col-span-3 flex flex-col gap-4 lg:gap-6 overflow-y-auto">
                {/* Context Name */}
                <FormField
                  name="name"
                  label="Context Name"
                  type="text"
                  placeholder="e.g., Architecture Constraints"
                  required
                  disabled={isSubmitting}
                />

                {/* Tags */}
                <FormField
                  name="tagsInput"
                  label="Tags"
                  type="text"
                  placeholder="architecture, backend, etc."
                  description="comma-separated"
                  disabled={isSubmitting}
                />

                {/* Tags Preview */}
                {parseTags(tagsInput).length > 0 && (
                  <div className="flex flex-wrap gap-2 -mt-2">
                    {parseTags(tagsInput).map((tag, index) => (
                      <span
                        key={index}
                        className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground rounded border border-border font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Global Error Display */}
                {methods.formState.errors.root && (
                  <div className="text-xs text-red-500 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
                    {methods.formState.errors.root.message}
                  </div>
                )}
              </div>

              {/* Right Column - Editor */}
              <div className="lg:col-span-9 flex flex-col bg-card border border-border rounded-xl overflow-hidden h-full min-h-100 lg:min-h-0">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">
                      Markdown Editor
                    </span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8 px-2 md:px-3"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Copy</span>
                    </Button>
                    {isEdit && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsVersionModalOpen(true)}
                        className="h-8 px-2 md:px-3 gap-1.5"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Versions</span>
                        {versions.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="h-4 px-1 text-[10px] font-semibold"
                          >
                            {versions.length}
                          </Badge>
                        )}
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleExport}
                      className="h-8 px-2 md:px-3"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Export</span>
                    </Button>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 overflow-hidden">
                  <Textarea
                    id="markdown-editor"
                    placeholder="Declare the explicit context here using Markdown..."
                    className="p-3 md:p-4 w-full h-full resize-none bg-transparent border-none font-mono text-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isSubmitting}
                    {...methods.register("markdown")}
                  />
                </div>

                {/* Editor Footer */}
                <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-t border-border bg-muted/30">
                  <div>
                    {isEdit && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2 md:px-3"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span className="hidden md:inline">
                              Deleting...
                            </span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">
                              Delete Context
                            </span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="px-4 md:px-6 shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : isEdit ? (
                      "Save"
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Version History Modal */}
      {isEdit && (
        <VersionHistoryModal
          open={isVersionModalOpen}
          onOpenChange={setIsVersionModalOpen}
          versions={versions}
          currentVersionId={currentVersionId}
        />
      )}
    </FormProvider>
  );
}
