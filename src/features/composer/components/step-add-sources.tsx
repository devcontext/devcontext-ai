"use client";

import { useRef, ChangeEvent, useState } from "react";
import type { SourceItem } from "../types";
import { Button } from "@/features/shared/ui/button";
import { X, Upload, FileText, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/features/shared/ui/dialog";
import { Input } from "@/features/shared/ui/input";
import { Textarea } from "@/features/shared/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/shared/ui/alert-dialog";

type StepAddSourcesProps = {
  sources: SourceItem[];
  onAddSource: (source: Omit<SourceItem, "id">) => void;
  onRemoveSource: (id: string) => void;
  onContinue: () => void;
};

export function StepAddSources({
  sources,
  onAddSource,
  onRemoveSource,
  onContinue,
}: StepAddSourcesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
  const [pastedName, setPastedName] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorDialog({
          isOpen: true,
          title: "File Too Large",
          message: `File ${file.name} is too large. Max size is 5MB.`,
        });
        continue;
      }

      const validExtensions = [".md", ".txt", ".pdf"];
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!validExtensions.includes(ext)) {
        setErrorDialog({
          isOpen: true,
          title: "Invalid File Type",
          message: `File ${file.name} has invalid extension. Use .md, .txt, or .pdf`,
        });
        continue;
      }

      const content = await file.text();
      onAddSource({
        name: file.name,
        type: "file",
        content,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePasteSubmit = () => {
    if (pastedText.trim()) {
      onAddSource({
        name: pastedName.trim() || `Pasted text ${sources.length + 1}`,
        type: "text",
        content: pastedText.trim(),
      });
      setIsPasteDialogOpen(false);
      setPastedName("");
      setPastedText("");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Step 1: Add Sources
        </h2>
        <p className="text-muted-foreground">
          Upload files or paste text to use as context sources.
        </p>
      </div>

      {/* Upload Actions */}
      <div className="flex gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.txt,.pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsPasteDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </Button>
      </div>

      {/* Paste Dialog */}
      <Dialog open={isPasteDialogOpen} onOpenChange={setIsPasteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Paste Source Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Source Name (optional)
              </label>
              <Input
                placeholder="e.g., Code Snippet, Tech Spec..."
                value={pastedName}
                onChange={(e) => setPastedName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Paste your text here..."
                className="min-h-[200px] font-mono text-sm"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsPasteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasteSubmit} disabled={!pastedText.trim()}>
              Add Source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Alert Dialog */}
      <AlertDialog
        open={errorDialog.isOpen}
        onOpenChange={(open) =>
          setErrorDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              {errorDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {errorDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sources List */}
      {sources.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Added Sources ({sources.length})
          </h3>
          <div className="space-y-2">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{source.name}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {source.type}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveSource(source.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">No sources added yet</p>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          disabled={sources.length === 0}
          className="px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
