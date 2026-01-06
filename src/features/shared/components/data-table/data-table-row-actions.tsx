"use client";

import * as React from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Loader2 } from "lucide-react";

import { Button } from "@/features/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/ui/dropdown-menu";
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

import { ActionConfig } from "./types";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions?: ActionConfig<TData>[];
}

export function DataTableRowActions<TData>({
  row,
  actions = [],
}: DataTableRowActionsProps<TData>) {
  const [confirmAction, setConfirmAction] =
    React.useState<ActionConfig<TData> | null>(null);
  const [isExecuting, setIsExecuting] = React.useState(false);

  if (actions.length === 0) {
    return null;
  }

  const handleAction = async (action: ActionConfig<TData>) => {
    // If action requires confirmation and has confirm config, show dialog
    if (action.confirm) {
      setConfirmAction(action);
      return;
    }

    // Otherwise execute directly
    await executeAction(action);
  };

  const executeAction = async (action: ActionConfig<TData>) => {
    setIsExecuting(true);
    try {
      await action.onClick(row.original);
    } finally {
      setIsExecuting(false);
      setConfirmAction(null);
    }
  };

  const getDescription = (action: ActionConfig<TData>) => {
    if (!action.confirm?.description) {
      return "";
    }

    if (typeof action.confirm.description === "function") {
      return action.confirm.description(row.original);
    }

    return action.confirm.description;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            disabled={isExecuting}
          >
            {isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem
                key={index}
                onClick={() => handleAction(action)}
                className={
                  action.variant === "destructive" ? "text-destructive" : ""
                }
                disabled={isExecuting || action.isLoading}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <AlertDialog
          open={!!confirmAction}
          onOpenChange={() => setConfirmAction(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmAction.confirm?.title || "Are you sure?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {getDescription(confirmAction)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isExecuting}>
                {confirmAction.confirm?.cancelText || "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  executeAction(confirmAction);
                }}
                disabled={isExecuting}
                className={
                  confirmAction.variant === "destructive"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : ""
                }
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {confirmAction.confirm?.confirmText || "Confirm"}
                  </>
                ) : (
                  confirmAction.confirm?.confirmText || "Confirm"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
