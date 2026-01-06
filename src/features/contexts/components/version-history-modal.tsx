"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/features/shared/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/features/shared/ui/alert-dialog";
import { Button } from "@/features/shared/ui/button";
import { Check, RotateCcw, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/features/shared/hooks/use-toast";
import type { ContextVersion } from "@/features/core/domain/types/contexts";
import { restoreVersionAction } from "@/features/contexts/actions/context-actions";

interface VersionHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versions: ContextVersion[];
  currentVersionId?: string;
}

type VersionWithNumber = ContextVersion & { versionNumber: number };

export function VersionHistoryModal({
  open,
  onOpenChange,
  versions,
  currentVersionId,
}: VersionHistoryModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [versionToRestore, setVersionToRestore] =
    useState<VersionWithNumber | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  // Sort versions by createdAt DESC (most recent first) and assign version numbers
  const sortedVersions: VersionWithNumber[] = [...versions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map((version, index) => ({
      ...version,
      versionNumber: versions.length - index, // v1, v2, v3...
    }));

  const handleRestoreClick = (version: VersionWithNumber) => {
    setVersionToRestore(version);
  };

  const handleRestoreConfirm = async () => {
    if (!versionToRestore) return;

    setIsRestoring(true);
    try {
      const result = await restoreVersionAction(versionToRestore.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to restore version");
      }

      // Close the AlertDialog only after success
      setVersionToRestore(null);

      // Refresh the page data
      router.refresh();

      toast({
        title: "Version v" + versionToRestore.versionNumber + " restored",
        description:
          "The context has been updated and a new version has been added to the history.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to restore version",
        variant: "destructive",
      });
      setVersionToRestore(null);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:w-112.5 p-0 flex flex-col"
        >
          <div className="shrink-0">
            <SheetHeader>
              <SheetTitle>Version History</SheetTitle>
              <SheetDescription>
                {versions.length} version{versions.length !== 1 ? "s" : ""}{" "}
                available
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto relative border-t border-border">
            {/* Loading Overlay for the entire list */}
            {isRestoring && (
              <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-xs font-medium text-muted-foreground">
                    Restoring version...
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col">
              {sortedVersions.map((version, index) => {
                const isCurrent = version.id === currentVersionId;
                const isLatest = index === 0;

                return (
                  <div
                    key={version.id}
                    className={`
                      relative group flex w-full border-b overflow-hidden transition-all
                      ${isCurrent ? "bg-primary/5" : "hover:bg-muted/30"}
                      ${isRestoring ? "opacity-50 grayscale-[0.5]" : ""}
                      border-border
                    `}
                  >
                    {/* Left Section: Metadata (Title, Version, Tags, Time) */}
                    <div className="flex-1 min-w-0 p-3 flex flex-col gap-2">
                      {/* Line 1: Version + Latest + Time */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${isCurrent ? "text-primary" : "text-foreground"}`}
                          >
                            v{version.versionNumber}
                          </span>
                          {isLatest && (
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary-foreground bg-primary px-1.5 py-0.5 rounded leading-none shrink-0">
                              Latest
                            </span>
                          )}
                          {isCurrent && (
                            <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                          {formatDistanceToNow(new Date(version.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      {/* Line 2: Title + Tags */}
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-semibold truncate ${isCurrent ? "text-foreground" : "text-foreground/80"}`}
                          >
                            {version.name || "Untitled version"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 overflow-hidden shrink-0">
                          {version.tags && version.tags.length > 0 ? (
                            version.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] font-medium text-muted-foreground bg-muted border border-border/50 px-1.5 py-0.5 rounded-sm"
                              >
                                #{tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-muted-foreground/40 italic">
                              No tags
                            </span>
                          )}
                          {version.tags && version.tags.length > 2 && (
                            <span className="text-[9px] text-muted-foreground">
                              +{version.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Square Restore Button */}
                    {!isCurrent && (
                      <Button
                        variant="ghost"
                        onClick={() => handleRestoreClick(version)}
                        disabled={isRestoring}
                        className="h-auto w-14 shrink-0 rounded-none border-l border-border hover:bg-primary hover:text-primary-foreground transition-colors group/btn"
                        title="Restore this version"
                      >
                        <div className="flex flex-col items-center gap-1">
                          {isRestoring &&
                          versionToRestore?.id === version.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RotateCcw className="w-4 h-4 transition-transform group-hover/btn:-rotate-45" />
                          )}
                          <span className="text-[9px] font-bold uppercase tracking-tighter">
                            {isRestoring && versionToRestore?.id === version.id
                              ? "Restoring"
                              : "Restore"}
                          </span>
                        </div>
                      </Button>
                    )}
                    {isCurrent && (
                      <div className="w-14 shrink-0 border-l border-primary/20 bg-primary/10 flex flex-col items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-primary/70">
                          Active
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Restore Confirmation Dialog */}
      <AlertDialog
        open={!!versionToRestore}
        onOpenChange={(open) => {
          if (!open && !isRestoring) setVersionToRestore(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Restore version v{versionToRestore?.versionNumber}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will copy the content from version{" "}
              <strong>v{versionToRestore?.versionNumber}</strong> and save it as
              a <strong>new version</strong>.
              <br />
              <br />
              No existing versions will be lost. Your history remains linear and
              complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!isRestoring && <AlertDialogCancel>Cancel</AlertDialogCancel>}
            <AlertDialogAction
              onClick={handleRestoreConfirm}
              disabled={isRestoring}
              className="bg-primary hover:bg-primary/90 min-w-[120px]"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                "Confirm Restore"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
