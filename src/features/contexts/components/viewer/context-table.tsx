"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import {
  Edit,
  Trash2,
  Tag as TagIcon,
  Clock,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Context } from "@/features/core/domain/types/contexts";
import {
  DataTable,
  DataTableRowActions,
} from "@/features/shared/components/data-table";
import { Badge } from "@/features/shared/ui/badge";
import { Button } from "@/features/shared/ui/button";
import { appRoutes } from "@/features/routes";
import { deleteContextAction } from "@/features/contexts/actions/context-actions";
import { useToast } from "@/features/shared/hooks/use-toast";

interface ContextTableProps {
  contexts: Context[];
  projectSlug: string;
}

export function ContextTable({ contexts, projectSlug }: ContextTableProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (context: Context) => {
    try {
      const result = await deleteContextAction(context.id);
      if (result.success) {
        toast({
          title: "Context deleted",
          description: `"${context.name}" has been removed.`,
          variant: "success",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete context",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Context>[] = [
    {
      accessorKey: "name",
      header: "Title",
      cell: ({ row }) => {
        const context = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded border border-primary/10">
              <FileText className="w-4 h-4 text-primary opacity-70" />
            </div>
            <Link
              href={appRoutes.contexts.detail.generatePath({
                projectSlug,
                id: context.id,
              })}
              className="font-medium hover:text-primary transition-colors"
            >
              {context.name}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tag",
      cell: ({ row }) => {
        const tags = row.original.tags;
        if (tags.length === 0)
          return (
            <span className="text-muted-foreground text-[10px] italic">
              No tags
            </span>
          );

        return (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-1.5 h-5 font-normal bg-muted/60 text-muted-foreground border-border/50"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 h-5 font-normal opacity-60"
              >
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = new Date(row.original.updatedAt);
        return (
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(date, { addSuffix: true })}
          </div>
        );
      },
    },
    {
      id: "updatedBy",
      header: "Updated By",
      cell: () => {
        return (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
              Q
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Admin
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const context = row.original;
        return (
          <div className="flex justify-end pr-2">
            <DataTableRowActions
              row={row}
              actions={[
                {
                  label: "Edit",
                  icon: Edit,
                  onClick: (data) =>
                    router.push(
                      appRoutes.contexts.edit.generatePath({
                        projectSlug,
                        id: data.id,
                      }),
                    ),
                },
                {
                  label: "Delete",
                  icon: Trash2,
                  variant: "destructive",
                  confirm: {
                    title: "Delete Context",
                    description: (data) =>
                      `Are you sure you want to delete "${data.name}"? This action cannot be undone.`,
                    confirmText: "Delete",
                    cancelText: "Cancel",
                  },
                  onClick: handleDelete,
                },
              ]}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={contexts}
      enablePagination
      pageSize={20}
      enableFiltering
      className="border-none"
      enableColumnVisibility={false}
    />
  );
}
